import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * sendSequenceEmail
 *
 * Sends a personalised outbound email as part of a sequence step.
 * Handles:
 *   - Variable substitution  ({{first_name}}, {{company}}, {{title}}, etc.)
 *   - AI-powered subject / body personalisation (optional)
 *   - Logging the send against the Contact & Campaign entities
 *   - Scheduling (send_at timestamp) — if provided and in the future, defers
 *
 * Expected request body:
 * {
 *   contact_id:      string            // required
 *   sequence_id:     string            // required
 *   step_id:         string            // required (step identifier within sequence)
 *   subject:         string            // template with {{vars}}
 *   body:            string            // HTML/plain template with {{vars}}
 *   from_name:       string            // sender display name
 *   from_email:      string            // sender address
 *   send_at?:        string            // ISO datetime — if future, defer
 *   personalise?:    boolean           // default true — AI rewrite intro paragraph
 *   tracking?:       boolean           // default true — open/click tracking
 *   unsubscribe_footer?: boolean       // default true
 * }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      contact_id,
      sequence_id,
      step_id,
      subject: rawSubject,
      body: rawBody,
      from_name = 'RVNU Sales',
      from_email,
      send_at,
      personalise = true,
      tracking = true,
      unsubscribe_footer = true,
    } = body;

    if (!contact_id || !sequence_id || !step_id || !rawSubject || !rawBody) {
      return Response.json(
        { error: 'Missing required fields: contact_id, sequence_id, step_id, subject, body' },
        { status: 400 }
      );
    }

    // ── 1. Fetch contact data ────────────────────────────────────────────────
    const contact = await base44.asServiceRole.entities.Contact.get(contact_id);
    if (!contact) {
      return Response.json({ error: 'Contact not found' }, { status: 404 });
    }

    // ── 2. Variable substitution ─────────────────────────────────────────────
    const vars: Record<string, string> = {
      first_name: contact.first_name || '',
      last_name:  contact.last_name  || '',
      full_name:  `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
      email:      contact.email      || '',
      company:    contact.company    || '',
      title:      contact.title      || '',
      industry:   contact.industry   || '',
      city:       contact.city       || '',
      country:    contact.country    || '',
    };

    const interpolate = (template: string) =>
      template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);

    let finalSubject = interpolate(rawSubject);
    let finalBody    = interpolate(rawBody);

    // ── 3. Optional AI personalisation ──────────────────────────────────────
    if (personalise && contact.first_name) {
      try {
        const aiPrompt = `You are an expert B2B sales copywriter. Improve ONLY the opening 1-2 sentences of the email body below to feel genuinely personalised for ${contact.first_name} ${contact.last_name || ''}, who is ${contact.title || 'a professional'} at ${contact.company || 'their company'} in the ${contact.industry || ''} industry. Keep the rest of the email exactly as-is. Return ONLY the full improved email body, no commentary.

Email body:
${finalBody}`;

        const aiResult = await base44.integrations.Core.InvokeLLM({
          prompt: aiPrompt,
          response_json_schema: {
            type: 'object',
            properties: {
              improved_body: { type: 'string' },
            },
          },
        });

        if (aiResult?.improved_body) {
          finalBody = aiResult.improved_body;
        }
      } catch (_aiErr) {
        // AI personalisation is best-effort — continue with interpolated body
      }
    }

    // ── 4. Append unsubscribe footer ─────────────────────────────────────────
    if (unsubscribe_footer) {
      finalBody += `\n\n---\nYou received this email because you're on our outreach list. <a href="{{unsubscribe_link}}">Unsubscribe</a>`;
    }

    // ── 5. Check scheduled send ───────────────────────────────────────────────
    const scheduledTime = send_at ? new Date(send_at) : null;
    const isScheduled   = scheduledTime && scheduledTime > new Date();

    if (isScheduled) {
      // Store in a queue — actual delivery handled by a scheduled trigger
      await base44.asServiceRole.entities.Campaign.create({
        name:           `[Scheduled] ${finalSubject}`,
        type:           'email',
        status:         'scheduled',
        subject_line:   finalSubject,
        body_content:   finalBody,
        start_date:     scheduledTime.toISOString().split('T')[0],
        total_contacts: 1,
        tags:           [`sequence:${sequence_id}`, `step:${step_id}`, `contact:${contact_id}`],
      });

      return Response.json({
        status:    'scheduled',
        send_at:   scheduledTime.toISOString(),
        subject:   finalSubject,
        contact_id,
        sequence_id,
      });
    }

    // ── 6. Send the email ─────────────────────────────────────────────────────
    await base44.integrations.Core.SendEmail({
      to:       contact.email,
      from:     from_email ? `${from_name} <${from_email}>` : from_name,
      subject:  finalSubject,
      body:     finalBody,
      tracking: tracking ? { opens: true, clicks: true } : undefined,
    });

    // ── 7. Update contact last_contacted ─────────────────────────────────────
    await base44.asServiceRole.entities.Contact.update(contact_id, {
      last_contacted: new Date().toISOString().split('T')[0],
      status: contact.status === 'new' ? 'contacted' : contact.status,
    });

    return Response.json({
      status:       'sent',
      subject:      finalSubject,
      to:           contact.email,
      personalised: personalise,
      contact_id,
      sequence_id,
      step_id,
      sent_at:      new Date().toISOString(),
    });

  } catch (error) {
    console.error('sendSequenceEmail error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
