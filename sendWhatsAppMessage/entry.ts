import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * sendWhatsAppMessage
 *
 * Sends a WhatsApp message to a contact (via Base44's WhatsApp integration),
 * then records the send in the WhatsAppMessage entity for inbox/thread tracking.
 *
 * Also supports:
 *   - Template messages  (pre-approved WhatsApp Business templates)
 *   - Free-form messages (within 24-hour session window)
 *   - AI content generation for the message body
 *   - Thread grouping by thread_id
 *
 * Expected request body:
 * {
 *   contact_id:      string         // required
 *   message:         string         // message body (or use template_name)
 *   template_name?:  string         // approved WA Business template name
 *   template_params?: string[]      // params for template placeholders {{1}}, {{2}}, etc.
 *   sequence_id?:    string         // attach to a sequence
 *   deal_id?:        string         // attach to a deal
 *   thread_id?:      string         // group into an existing thread
 *   generate_ai?:    boolean        // AI-write the message from contact context
 *   ai_goal?:        string         // e.g. "introduce product", "follow up", "book meeting"
 * }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch (_) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const {
      contact_id,
      message: rawMessage,
      template_name,
      template_params = [],
      sequence_id,
      deal_id,
      thread_id,
      generate_ai = false,
      ai_goal = 'introduce our product and start a conversation',
    } = body;

    if (!contact_id) {
      return Response.json({ error: 'contact_id is required' }, { status: 400 });
    }
    if (!rawMessage && !template_name && !generate_ai) {
      return Response.json(
        { error: 'Provide message, template_name, or set generate_ai=true' },
        { status: 400 }
      );
    }

    // ── 1. Load contact ───────────────────────────────────────────────────────
    const contact = await base44.asServiceRole.entities.Contact.get(contact_id);
    if (!contact) return Response.json({ error: 'Contact not found' }, { status: 404 });

    const phoneNumber = contact.phone?.trim();
    if (!phoneNumber) {
      return Response.json({ error: 'Contact has no phone number' }, { status: 422 });
    }

    // ── 2. Build message content ──────────────────────────────────────────────
    let finalMessage = rawMessage || '';

    if (generate_ai) {
      const aiPrompt = `You are a B2B sales rep writing a short, friendly WhatsApp message to ${contact.first_name || 'a prospect'}, who is ${contact.title || 'a professional'} at ${contact.company || 'their company'}${contact.industry ? ` in the ${contact.industry} industry` : ''}.

Goal: ${ai_goal}

Rules:
- Max 3 short paragraphs. WhatsApp-style — conversational, not corporate.
- No HTML. Plain text only. Can use 1-2 relevant emojis.
- First person. Don't say "I am an AI" or mention RVNU explicitly unless asked.
- End with a simple, low-friction question or CTA.

Return ONLY the message text, nothing else.`;

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: aiPrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      });

      finalMessage = aiResult?.message || finalMessage;
    }

    // Substitute basic variables
    const vars: Record<string, string> = {
      first_name: contact.first_name || '',
      company:    contact.company    || '',
      title:      contact.title      || '',
    };
    finalMessage = finalMessage.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');

    // ── 3. Send via WhatsApp integration ──────────────────────────────────────
    let sendResult: Record<string, unknown> = {};
    try {
      if (template_name) {
        sendResult = await base44.integrations.WhatsApp.SendTemplateMessage({
          to:            phoneNumber,
          template_name,
          template_params,
        });
      } else {
        sendResult = await base44.integrations.WhatsApp.SendMessage({
          to:      phoneNumber,
          message: finalMessage,
        });
      }
    } catch (waErr) {
      console.error('WhatsApp send failed:', waErr.message);
      return Response.json(
        { error: 'WhatsApp send failed', details: waErr.message },
        { status: 502 }
      );
    }

    // ── 4. Log to WhatsAppMessage entity ─────────────────────────────────────
    const threadKey = thread_id || `${contact_id}-${Date.now()}`;

    await base44.asServiceRole.entities.WhatsAppMessage.create({
      contact_id,
      contact_name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
      company:      contact.company || '',
      deal_id:      deal_id  || undefined,
      sequence_id:  sequence_id || undefined,
      thread_id:    threadKey,
      direction:    'sent',
      content:      finalMessage,
      timestamp:    new Date().toISOString(),
      status:       'sent',
      engagement_status: 'opened',
    });

    // ── 5. Update contact last_contacted ──────────────────────────────────────
    await base44.asServiceRole.entities.Contact.update(contact_id, {
      last_contacted: new Date().toISOString().split('T')[0],
      status: contact.status === 'new' ? 'contacted' : contact.status,
    });

    return Response.json({
      status:    'sent',
      to:        phoneNumber,
      contact_id,
      thread_id: threadKey,
      message:   finalMessage,
      template:  template_name || null,
      ai_written: generate_ai,
      sent_at:   new Date().toISOString(),
      provider_result: sendResult,
    });

  } catch (error) {
    console.error('sendWhatsAppMessage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
