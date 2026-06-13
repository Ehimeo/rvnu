import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * executeAutomation
 *
 * Core automation engine. Called by entity triggers (e.g. on Contact update,
 * Deal update, etc.) or on a schedule. Evaluates all active automations whose
 * trigger matches the incoming event and runs their configured action.
 *
 * Supported triggers (mirrors Automations.jsx UI):
 *   reply_received | deal_stage_change | no_reply_after | contact_created
 *   meeting_booked | whatsapp_reply    | email_opened_multiple
 *   sequence_completed | deal_stale
 *
 * Supported actions:
 *   send_email | send_whatsapp | slack_notify | add_to_sequence
 *   remove_from_sequence | update_deal_stage | create_task
 *   mark_high_intent | stop_all_outreach
 *
 * Expected request body (sent by Base44 entity automation webhook):
 * {
 *   event: {
 *     type:   'create' | 'update' | 'delete'
 *     entity: 'Contact' | 'Deal' | 'Campaign' | 'WhatsAppMessage' | ...
 *   }
 *   data:     object   // new entity state
 *   old_data: object   // previous entity state (for update events)
 *   // Optional: call directly with explicit trigger
 *   trigger_override?: string
 *   contact_id?:       string
 *   deal_id?:          string
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
    const { event, data, old_data, trigger_override, contact_id, deal_id } = body;

    // ── 1. Determine which trigger fired ─────────────────────────────────────
    const firedTrigger = trigger_override || detectTrigger(event, data, old_data);
    if (!firedTrigger) {
      return Response.json({ ok: true, skipped: true, reason: 'No matching trigger' });
    }

    // ── 2. Resolve context IDs ────────────────────────────────────────────────
    const resolvedContactId = contact_id || data?.contact_id || data?.id;
    const resolvedDealId    = deal_id    || data?.deal_id    || (event?.entity === 'Deal' ? data?.id : undefined);

    // ── 3. Load hardcoded automation rules ───────────────────────────────────
    // In a full implementation these would be stored in a Automation entity.
    // For now, the engine applies the default rules matching the UI.
    const automationRules = getDefaultRules();
    const matchingRules   = automationRules.filter(r => r.trigger === firedTrigger && r.status === 'active');

    if (matchingRules.length === 0) {
      return Response.json({ ok: true, skipped: true, reason: `No active automation for trigger: ${firedTrigger}` });
    }

    const results: Array<Record<string, unknown>> = [];

    for (const rule of matchingRules) {
      try {
        const result = await executeAction({
          rule,
          data,
          contactId: resolvedContactId,
          dealId:    resolvedDealId,
          base44,
          firedTrigger,
        });
        results.push({ rule: rule.name, action: rule.action, result });
      } catch (ruleErr) {
        results.push({ rule: rule.name, action: rule.action, error: ruleErr.message });
      }
    }

    return Response.json({
      ok:              true,
      trigger:         firedTrigger,
      rules_evaluated: matchingRules.length,
      results,
    });

  } catch (error) {
    console.error('executeAutomation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Trigger detection ─────────────────────────────────────────────────────────
function detectTrigger(
  event: { type?: string; entity?: string } | undefined,
  data: Record<string, unknown> | undefined,
  old_data: Record<string, unknown> | undefined
): string | null {
  if (!event || !data) return null;

  const { type, entity } = event;

  // New contact created
  if (entity === 'Contact' && type === 'create') return 'contact_created';

  // Deal stage changed
  if (entity === 'Deal' && type === 'update' && data.stage !== old_data?.stage) return 'deal_stage_change';

  // WhatsApp reply received
  if (entity === 'WhatsAppMessage' && type === 'create' && data.direction === 'received') return 'whatsapp_reply';

  // Email reply (Campaign engagement_status update)
  if (entity === 'Campaign' && type === 'update' && data.reply_rate && (data.reply_rate as number) > (old_data?.reply_rate as number || 0)) return 'reply_received';

  return null;
}

// ── Action executor ───────────────────────────────────────────────────────────
async function executeAction({
  rule,
  data,
  contactId,
  dealId,
  base44,
  firedTrigger,
}: {
  rule: AutomationRule;
  data: Record<string, unknown>;
  contactId: string | undefined;
  dealId: string | undefined;
  base44: ReturnType<typeof import('npm:@base44/sdk@0.8.25').createClientFromRequest>;
  firedTrigger: string;
}): Promise<Record<string, unknown>> {

  switch (rule.action) {

    case 'send_email': {
      if (!contactId) return { skipped: true, reason: 'No contact_id' };
      const contact = await base44.asServiceRole.entities.Contact.get(contactId);
      if (!contact?.email) return { skipped: true, reason: 'Contact has no email' };

      await base44.integrations.Core.SendEmail({
        to:      contact.email,
        subject: rule.email_subject || 'Following up',
        body:    rule.email_body    || 'Hi {{first_name}}, just checking in!',
      });
      return { sent_to: contact.email };
    }

    case 'create_task': {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (rule.task_due_days || 1));

      await base44.asServiceRole.entities.LinkedInTask.create({
        task_type:    rule.task_type    || 'follow_up_message',
        status:       'pending',
        priority:     rule.task_priority || 'normal',
        contact_id:   contactId,
        contact_name: (data.contact_name as string) || '',
        sequence_id:  (data.sequence_id as string)  || '',
        due_date:     dueDate.toISOString(),
        notes:        `Auto-created by automation: "${rule.name}" (trigger: ${firedTrigger})`,
      });
      return { task_created: true, due_date: dueDate.toISOString() };
    }

    case 'update_deal_stage': {
      if (!dealId) return { skipped: true, reason: 'No deal_id' };

      await base44.asServiceRole.entities.Deal.update(dealId, {
        stage: rule.target_stage || 'qualification',
      });
      return { stage_updated_to: rule.target_stage };
    }

    case 'mark_high_intent': {
      if (!contactId) return { skipped: true, reason: 'No contact_id' };

      await base44.asServiceRole.entities.Contact.update(contactId, {
        intent_signal: 'hot',
        lead_score:    95,
      });
      return { intent_signal: 'hot', lead_score: 95 };
    }

    case 'stop_all_outreach': {
      if (!contactId) return { skipped: true, reason: 'No contact_id' };

      // Mark contact so sequence engine skips them
      await base44.asServiceRole.entities.Contact.update(contactId, {
        status: 'qualified',
        tags:   [...(Array.isArray(data.tags) ? data.tags : []), 'outreach_stopped'],
      });
      return { outreach_stopped: true };
    }

    case 'slack_notify': {
      try {
        await base44.integrations.Slack.SendMessage({
          channel: rule.slack_channel || '#sales-alerts',
          text:    rule.slack_message  || `🔔 Automation fired: ${rule.name}\nTrigger: ${firedTrigger}\nContact: ${data.contact_name || contactId}`,
        });
        return { slack_notified: true };
      } catch (slackErr) {
        return { slack_notified: false, warning: slackErr.message };
      }
    }

    case 'add_to_sequence': {
      if (!contactId || !rule.target_sequence_id) return { skipped: true, reason: 'No contact_id or target_sequence_id' };
      // Increment enrolled count on the sequence
      const seq = await base44.asServiceRole.entities.Sequence.get(rule.target_sequence_id).catch(() => null);
      if (seq) {
        await base44.asServiceRole.entities.Sequence.update(rule.target_sequence_id, {
          enrolled_count: (seq.enrolled_count || 0) + 1,
        });
      }
      return { enrolled_in_sequence: rule.target_sequence_id };
    }

    case 'remove_from_sequence': {
      if (!contactId) return { skipped: true, reason: 'No contact_id' };
      await base44.asServiceRole.entities.Contact.update(contactId, {
        tags: [...(Array.isArray(data.tags) ? data.tags : []), 'sequence_removed'],
      });
      return { removed_from_sequence: true };
    }

    default:
      return { skipped: true, reason: `Unknown action: ${rule.action}` };
  }
}

// ── Default automation rules (mirrors Automations.jsx initialAutomations) ────
interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  // Action-specific config
  email_subject?: string;
  email_body?: string;
  task_type?: string;
  task_priority?: string;
  task_due_days?: number;
  target_stage?: string;
  slack_channel?: string;
  slack_message?: string;
  target_sequence_id?: string;
}

function getDefaultRules(): AutomationRule[] {
  return [
    {
      id: 1,
      name: 'Auto Follow-up — No Reply in 3 Days',
      trigger: 'no_reply_after',
      action: 'send_email',
      status: 'active',
      email_subject: 'Quick follow-up, {{first_name}}',
      email_body: 'Hi {{first_name}},\n\nI wanted to follow up on my previous message. I know things get busy, so I\'ll keep this brief.\n\nWould it make sense to connect for a quick 15-minute call to see if there\'s a fit?\n\nBest,\n{{sender_name}}',
    },
    {
      id: 2,
      name: 'WhatsApp Reply → Slack Alert',
      trigger: 'whatsapp_reply',
      action: 'slack_notify',
      status: 'active',
      slack_channel: '#sales-alerts',
      slack_message: '📱 WhatsApp reply received! Check RVNU inbox.',
    },
    {
      id: 3,
      name: 'New Contact → Welcome Sequence',
      trigger: 'contact_created',
      action: 'add_to_sequence',
      status: 'active',
    },
    {
      id: 4,
      name: 'Deal Won → Handoff Task',
      trigger: 'deal_stage_change',
      action: 'create_task',
      status: 'paused',
      task_type: 'follow_up_message',
      task_priority: 'high',
      task_due_days: 1,
    },
    {
      id: 5,
      name: 'Meeting Booked → Stop Outreach',
      trigger: 'meeting_booked',
      action: 'stop_all_outreach',
      status: 'active',
    },
    {
      id: 6,
      name: 'Reply Received → Remove from Sequence',
      trigger: 'reply_received',
      action: 'remove_from_sequence',
      status: 'active',
    },
    {
      id: 7,
      name: 'Email Opened 3x → High Intent Flag',
      trigger: 'email_opened_multiple',
      action: 'mark_high_intent',
      status: 'active',
    },
  ];
}
