import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * dealIntelligence
 *
 * AI-powered deal intelligence engine. Given a deal (and optionally its
 * associated contacts and activity history), produces:
 *
 *   - Health score (0-100)
 *   - Risk flags    (stale, single-threaded, no close date, etc.)
 *   - Win probability estimate (with reasoning)
 *   - Coaching tips (specific next actions to advance the deal)
 *   - Suggested email/message to send next
 *   - Updated deal fields  (probability, next_action, next_action_date)
 *
 * Expected request body:
 * {
 *   deal_id:          string    // required
 *   include_email?:   boolean   // also draft the next outreach email (default: true)
 *   include_coaching?: boolean  // include coaching narrative (default: true)
 * }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let _body: Record<string, unknown>;
    try {
      _body = await req.json();
    } catch (_) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const {
      deal_id,
      include_email    = true,
      include_coaching = true,
    } = _body;

    if (!deal_id) {
      return Response.json({ error: 'deal_id is required' }, { status: 400 });
    }

    // ── 1. Load deal ──────────────────────────────────────────────────────────
    const deal = await base44.asServiceRole.entities.Deal.get(deal_id);
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 });

    // ── 2. Calculate staleness ────────────────────────────────────────────────
    const daysSinceActivity = deal.last_activity
      ? Math.floor((Date.now() - new Date(deal.last_activity).getTime()) / 86400000)
      : 999;

    const daysToClose = deal.close_date
      ? Math.floor((new Date(deal.close_date).getTime() - Date.now()) / 86400000)
      : null;

    // ── 3. Risk flag detection ────────────────────────────────────────────────
    const riskFlags: string[] = [];

    if (daysSinceActivity > 14) riskFlags.push('stale_deal');
    if (!deal.close_date)        riskFlags.push('no_close_date');
    if (!deal.contact_name)      riskFlags.push('single_threaded');
    if ((deal.value || 0) === 0) riskFlags.push('no_deal_value');
    if (!deal.next_action)       riskFlags.push('no_next_action');
    if (daysToClose !== null && daysToClose < 7 && deal.stage !== 'closed_won' && deal.stage !== 'closed_lost') {
      riskFlags.push('close_date_imminent');
    }
    if (deal.stage === 'negotiation' && daysSinceActivity > 7) {
      riskFlags.push('negotiation_stalled');
    }

    // ── 4. AI deal intelligence ───────────────────────────────────────────────
    const stageProgressMap: Record<string, number> = {
      prospecting:   1,
      qualification: 2,
      proposal:      3,
      negotiation:   4,
      closed_won:    5,
      closed_lost:   0,
    };

    const intelligencePrompt = `You are a senior B2B sales coach and revenue intelligence expert. Analyse this deal and provide detailed, actionable intelligence.

Deal data:
${JSON.stringify({
  title:            deal.title,
  stage:            deal.stage,
  value:            deal.value ? `${deal.currency || 'USD'} ${deal.value.toLocaleString()}` : 'Unknown',
  probability:      deal.probability ? `${deal.probability}%` : 'Unknown',
  close_date:       deal.close_date || 'Not set',
  days_to_close:    daysToClose !== null ? daysToClose : 'Unknown',
  days_since_activity: daysSinceActivity,
  owner:            deal.owner || 'Unknown',
  contact_name:     deal.contact_name || 'Unknown',
  company:          deal.company || 'Unknown',
  source:           deal.source || 'Unknown',
  tags:             deal.tags || [],
  next_action:      deal.next_action || 'None',
  notes:            deal.notes || 'None',
  risk_flags:       riskFlags,
}, null, 2)}

Stage progression: ${deal.stage} (step ${stageProgressMap[deal.stage] || 0} of 4)

Provide:
1. health_score: Integer 0-100 (overall deal health)
2. win_probability: Integer 0-100 (AI-estimated win probability)
3. win_probability_reasoning: String (2-3 sentences)
4. risk_summary: String (concise summary of biggest risks)
5. coaching_tips: Array of 3-4 specific, actionable strings to advance the deal
6. next_action: String (single most important action to take today)
7. next_action_date: String (ISO date, within 7 days unless deal is stale)
8. updated_probability: Number (recommended probability update, 0-100)`;

    const intelligence = await base44.integrations.Core.InvokeLLM({
      prompt: intelligencePrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          health_score:              { type: 'number' },
          win_probability:           { type: 'number' },
          win_probability_reasoning: { type: 'string' },
          risk_summary:              { type: 'string' },
          coaching_tips:             { type: 'array', items: { type: 'string' } },
          next_action:               { type: 'string' },
          next_action_date:          { type: 'string' },
          updated_probability:       { type: 'number' },
        },
      },
    });

    // ── 5. Draft next email (optional) ────────────────────────────────────────
    let draftEmail: Record<string, string> | null = null;

    if (include_email && intelligence?.next_action) {
      const emailPrompt = `You are a B2B sales copywriter. Draft a short, personalised sales email to advance the following deal.

Deal context:
- Deal: ${deal.title}
- Stage: ${deal.stage}
- Company: ${deal.company || 'the prospect\'s company'}
- Contact: ${deal.contact_name || 'the prospect'}
- Next action: ${intelligence.next_action}
- Key risk: ${intelligence.risk_summary || 'staying top of mind'}

Requirements:
- Subject line: clear, specific, under 60 characters
- Body: 3-4 short paragraphs. Professional but human tone.
- End with a single, clear CTA tied to the next action
- Do NOT use filler phrases like "Hope this finds you well"

Return:
{
  "subject": "...",
  "body": "..."
}`;

      const emailResult = await base44.integrations.Core.InvokeLLM({
        prompt: emailPrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            subject: { type: 'string' },
            body:    { type: 'string' },
          },
        },
      });

      if (emailResult?.subject && emailResult?.body) {
        draftEmail = {
          subject: emailResult.subject,
          body:    emailResult.body,
        };
      }
    }

    // ── 6. Update deal with AI recommendations ────────────────────────────────
    const dealUpdates: Record<string, unknown> = {};

    if (intelligence?.next_action) {
      dealUpdates.next_action = intelligence.next_action;
    }
    if (intelligence?.next_action_date) {
      try {
        dealUpdates.next_action_date = new Date(intelligence.next_action_date).toISOString().split('T')[0];
      } catch (_) { /* ignore invalid dates */ }
    }
    if (intelligence?.updated_probability !== undefined) {
      dealUpdates.probability = Math.min(100, Math.max(0, Math.round(intelligence.updated_probability)));
    }
    dealUpdates.last_activity = new Date().toISOString().split('T')[0];

    await base44.asServiceRole.entities.Deal.update(deal_id, dealUpdates);

    // ── 7. Return full intelligence report ────────────────────────────────────
    return Response.json({
      ok:            true,
      deal_id,
      deal_title:    deal.title,
      deal_stage:    deal.stage,
      health_score:  intelligence?.health_score ?? null,
      risk_flags:    riskFlags,
      risk_summary:  intelligence?.risk_summary ?? null,
      win_probability: {
        estimate:  intelligence?.win_probability ?? null,
        reasoning: intelligence?.win_probability_reasoning ?? null,
      },
      coaching: include_coaching ? {
        tips:        intelligence?.coaching_tips ?? [],
        next_action: intelligence?.next_action ?? null,
        next_action_date: dealUpdates.next_action_date ?? null,
      } : undefined,
      draft_email:     draftEmail,
      deal_updates:    dealUpdates,
      days_since_activity: daysSinceActivity,
      days_to_close:   daysToClose,
      analysed_at:     new Date().toISOString(),
    });

  } catch (error) {
    console.error('dealIntelligence error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
