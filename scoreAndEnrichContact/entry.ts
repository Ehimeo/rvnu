import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * scoreAndEnrichContact
 *
 * AI-powered lead scoring and enrichment. Two modes:
 *
 *   1. score   — Analyses existing contact data + activity to produce a
 *                lead_score (0-100) and intent_signal (hot/warm/cold/unknown).
 *                Also recommends next best action.
 *
 *   2. enrich  — Given minimal contact data (email / LinkedIn URL),
 *                uses web search to fill in missing fields: title, company,
 *                industry, country, website, linkedin_url.
 *
 * Both modes update the Contact entity in place.
 *
 * Expected request body:
 * {
 *   contact_id:  string          // required
 *   mode?:       'score' | 'enrich' | 'both'   // default: 'both'
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
    const { contact_id, mode = 'both' } = _body;

    if (!contact_id) {
      return Response.json({ error: 'contact_id is required' }, { status: 400 });
    }

    const contact = await base44.asServiceRole.entities.Contact.get(contact_id);
    if (!contact) return Response.json({ error: 'Contact not found' }, { status: 404 });

    const updates: Record<string, unknown> = {};
    const output: Record<string, unknown> = { contact_id };

    // ── MODE: ENRICH ──────────────────────────────────────────────────────────
    if (mode === 'enrich' || mode === 'both') {
      const missingFields = getMissingFields(contact);

      if (missingFields.length > 0) {
        const searchQuery = buildEnrichQuery(contact);

        const enrichPrompt = `You are a B2B data enrichment assistant. Based on the following contact information, infer or look up any missing fields. Return only what you can confidently determine — do NOT guess or hallucinate.

Known information:
${JSON.stringify(omitEmpty(contact), null, 2)}

Search context: ${searchQuery}

Return a JSON object with any of these fields you can fill in (skip fields you already know or cannot determine):
- title (job title)
- company (company name)
- industry
- country
- city
- website (company website URL)
- linkedin_url

IMPORTANT: Only include fields where you are highly confident. Return empty object {} if uncertain.`;

        try {
          const enrichResult = await base44.integrations.Core.InvokeLLM({
            prompt: enrichPrompt,
            response_json_schema: {
              type: 'object',
              properties: {
                title:        { type: 'string' },
                company:      { type: 'string' },
                industry:     { type: 'string' },
                country:      { type: 'string' },
                city:         { type: 'string' },
                website:      { type: 'string' },
                linkedin_url: { type: 'string' },
              },
            },
          });

          // Only apply fields that are missing in original contact
          for (const field of missingFields) {
            if (enrichResult?.[field]) {
              updates[field] = enrichResult[field];
            }
          }

          output.enriched_fields = Object.keys(updates);
        } catch (enrichErr) {
          output.enrich_warning = enrichErr.message;
        }
      } else {
        output.enrich_note = 'Contact already fully enriched';
      }
    }

    // ── MODE: SCORE ───────────────────────────────────────────────────────────
    if (mode === 'score' || mode === 'both') {
      // Build activity context — days since last contact
      const daysSinceContact = contact.last_contacted
        ? Math.floor((Date.now() - new Date(contact.last_contacted).getTime()) / 86400000)
        : 999;

      const scorePrompt = `You are a B2B lead scoring expert. Score this contact from 0-100 based on their data and activity signals.

Contact data:
${JSON.stringify(omitEmpty({ ...contact, ...updates }), null, 2)}

Activity signals:
- Days since last contact: ${daysSinceContact}
- Current status: ${contact.status}
- Current intent_signal: ${contact.intent_signal}

Scoring criteria:
- Completeness of profile (title, company, phone, linkedin) → up to 20 pts
- Seniority of title (C-suite, VP, Director = high; Manager = medium; Other = low) → up to 25 pts
- Company quality (large company, relevant industry = high) → up to 20 pts
- Recency of engagement (< 7 days = high, 7-30 = medium, > 30 = low) → up to 20 pts
- Status progression (converted > qualified > nurturing > contacted > new) → up to 15 pts

Return:
{
  "lead_score": number (0-100),
  "intent_signal": "hot" | "warm" | "cold" | "unknown",
  "score_breakdown": {
    "profile_completeness": number,
    "title_seniority": number,
    "company_quality": number,
    "recency": number,
    "status": number
  },
  "reasoning": string (1-2 sentences),
  "next_best_action": string (specific, actionable recommendation)
}`;

      const scoreResult = await base44.integrations.Core.InvokeLLM({
        prompt: scorePrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            lead_score:      { type: 'number' },
            intent_signal:   { type: 'string', enum: ['hot', 'warm', 'cold', 'unknown'] },
            score_breakdown: {
              type: 'object',
              properties: {
                profile_completeness: { type: 'number' },
                title_seniority:      { type: 'number' },
                company_quality:      { type: 'number' },
                recency:              { type: 'number' },
                status:               { type: 'number' },
              },
            },
            reasoning:        { type: 'string' },
            next_best_action: { type: 'string' },
          },
        },
      });

      if (scoreResult?.lead_score !== undefined) {
        updates.lead_score    = Math.round(scoreResult.lead_score);
        updates.intent_signal = scoreResult.intent_signal || 'unknown';

        output.lead_score        = updates.lead_score;
        output.intent_signal     = updates.intent_signal;
        output.score_breakdown   = scoreResult.score_breakdown;
        output.reasoning         = scoreResult.reasoning;
        output.next_best_action  = scoreResult.next_best_action;
      }
    }

    // ── Apply updates to Contact entity ───────────────────────────────────────
    if (Object.keys(updates).length > 0) {
      await base44.asServiceRole.entities.Contact.update(contact_id, updates);
    }

    return Response.json({
      ok: true,
      mode,
      ...output,
      updates_applied: updates,
    });

  } catch (error) {
    console.error('scoreAndEnrichContact error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getMissingFields(contact: Record<string, unknown>): string[] {
  const optional = ['title', 'company', 'industry', 'country', 'city', 'website', 'linkedin_url'];
  return optional.filter(f => !contact[f]);
}

function buildEnrichQuery(contact: Record<string, unknown>): string {
  const parts = [
    contact.first_name,
    contact.last_name,
    contact.email,
    contact.company,
  ].filter(Boolean);
  return parts.join(' ');
}

function omitEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''));
}
