# RVNU — New Base44 Backend Functions

Five new Deno server functions to drop into `base44/functions/`. Each follows the same pattern as the existing `generateLinkedInContent` and `advanceLinkedInSequence` functions.

---

## Deployment

1. Copy each folder into `base44/functions/`
2. Push to GitHub — Base44 will auto-detect and deploy
3. Wire each function to entity automations or call from the frontend via `base44.functions.<name>(payload)`

---

## Functions

### 1. `sendSequenceEmail`
**Purpose:** Sends a personalised outbound email as part of a sequence step.

**Key features:**
- `{{variable}}` substitution (first_name, company, title, etc.)
- Optional AI-rewrite of the opening paragraph for genuine personalisation
- Scheduled send support (pass `send_at` ISO datetime)
- Auto-updates `Contact.last_contacted` and status after send
- Unsubscribe footer injection

**Request:**
```json
{
  "contact_id": "abc123",
  "sequence_id": "seq_001",
  "step_id": "step_1",
  "subject": "Quick question about {{company}}'s payment stack",
  "body": "Hi {{first_name}}, I noticed that {{company}} recently...",
  "from_name": "Your Name",
  "from_email": "you@yourco.com",
  "send_at": "2025-01-20T09:00:00Z",   // optional — omit to send immediately
  "personalise": true,
  "tracking": true
}
```

**Response:**
```json
{
  "status": "sent",
  "subject": "Quick question about Flutterwave's payment stack",
  "to": "chisom@flutterwave.com",
  "personalised": true,
  "sent_at": "2025-01-17T14:32:00Z"
}
```

---

### 2. `sendWhatsAppMessage`
**Purpose:** Sends a WhatsApp message (free-form or template) and logs it to the `WhatsAppMessage` entity.

**Key features:**
- Supports free-form messages and pre-approved Business templates
- AI-generated message body from contact context + stated goal
- Thread grouping via `thread_id`
- Gracefully handles unconfigured WhatsApp integration (logs only)
- Auto-updates `Contact.last_contacted`

**Request:**
```json
{
  "contact_id": "abc123",
  "message": "Hi {{first_name}}! 👋 Wanted to share something relevant...",
  "sequence_id": "seq_001",
  "thread_id": "thread_abc",
  "generate_ai": false
}
```
Or with AI generation:
```json
{
  "contact_id": "abc123",
  "generate_ai": true,
  "ai_goal": "follow up on last week's demo call and propose next steps"
}
```

---

### 3. `executeAutomation`
**Purpose:** Core automation engine — evaluates triggers from entity events and executes the matching automation action.

**Key features:**
- Trigger detection from Base44 entity webhook payloads
- Supports all 9 trigger types and 9 action types from the UI
- Runs all matching active automation rules in sequence
- Safe — individual rule failures don't block other rules

**Trigger types:**
`reply_received` · `deal_stage_change` · `no_reply_after` · `contact_created`
`meeting_booked` · `whatsapp_reply` · `email_opened_multiple`
`sequence_completed` · `deal_stale`

**Action types:**
`send_email` · `send_whatsapp` · `slack_notify` · `add_to_sequence`
`remove_from_sequence` · `update_deal_stage` · `create_task`
`mark_high_intent` · `stop_all_outreach`

**Wire up in Base44:** Set this as the automation webhook on the `Contact`, `Deal`, and `WhatsAppMessage` entities.

**Request (from entity webhook):**
```json
{
  "event": { "type": "create", "entity": "Contact" },
  "data": { "id": "abc123", "first_name": "Chisom", ... },
  "old_data": null
}
```

---

### 4. `scoreAndEnrichContact`
**Purpose:** AI-powered lead scoring + profile enrichment. Updates the contact in place.

**Key features:**
- **Scoring (0-100):** Profile completeness, title seniority, company quality, recency, status
- **Intent signal:** hot / warm / cold / unknown
- **Enrichment:** Fills in missing fields (title, company, industry, etc.) using LLM inference
- **Next best action:** Specific, contextual recommendation
- Returns full score breakdown

**Request:**
```json
{
  "contact_id": "abc123",
  "mode": "both"   // "score" | "enrich" | "both"
}
```

**Response:**
```json
{
  "ok": true,
  "lead_score": 78,
  "intent_signal": "warm",
  "score_breakdown": {
    "profile_completeness": 16,
    "title_seniority": 20,
    "company_quality": 15,
    "recency": 12,
    "status": 10
  },
  "reasoning": "Senior title at a large fintech company, contacted recently.",
  "next_best_action": "Send case study email and invite to product webinar.",
  "enriched_fields": ["industry", "city"]
}
```

---

### 5. `dealIntelligence`
**Purpose:** Full AI deal review — health score, risk flags, win probability, coaching tips, and a drafted follow-up email.

**Key features:**
- **Health score (0-100)**
- **Risk flags:** stale_deal, no_close_date, single_threaded, negotiation_stalled, etc.
- **Win probability** with AI reasoning
- **Coaching tips:** 3-4 specific, actionable next steps
- **Draft email:** Ready-to-send follow-up based on next action
- Auto-updates `Deal.next_action`, `Deal.probability`, `Deal.last_activity`

**Request:**
```json
{
  "deal_id": "deal_456",
  "include_email": true,
  "include_coaching": true
}
```

**Response (abbreviated):**
```json
{
  "health_score": 62,
  "risk_flags": ["stale_deal", "no_close_date"],
  "win_probability": { "estimate": 45, "reasoning": "Strong champion but CFO not engaged." },
  "coaching": {
    "tips": [
      "Schedule a multi-stakeholder call to include the CFO",
      "Share an ROI calculator tailored to their company size",
      "Set a clear close date with the champion"
    ],
    "next_action": "Send personalised ROI summary to CFO",
    "next_action_date": "2025-01-20"
  },
  "draft_email": {
    "subject": "ROI snapshot for Flutterwave — worth 10 mins?",
    "body": "Hi Amara, ..."
  }
}
```

---

## Frontend Integration

Call any function from your React components via the base44 client:

```js
import { base44 } from '@/api/base44Client';

// Score a contact
const result = await base44.functions.scoreAndEnrichContact({
  contact_id: contact.id,
  mode: 'both',
});

// Run deal intelligence
const intel = await base44.functions.dealIntelligence({
  deal_id: deal.id,
  include_email: true,
});

// Send a sequence email
await base44.functions.sendSequenceEmail({
  contact_id: contact.id,
  sequence_id: sequence.id,
  step_id: step.id,
  subject: step.subject,
  body: step.body,
  personalise: true,
});
```
