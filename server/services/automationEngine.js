const axios = require('axios');
const db = require('../db');
const whatsappProvider = require('./whatsappProvider');
const complianceService = require('./complianceService');

class AutomationEngine {
  /**
   * Main event dispatcher: checks active workflows matching the trigger event
   */
  async trigger(eventName, eventData = {}) {
    const workflows = db.getWorkflows().filter(w => w.enabled && w.trigger === eventName);
    const results = [];

    for (const wf of workflows) {
      try {
        const matched = this._evaluateConditions(wf.conditions || [], eventData);
        if (matched) {
          const execResult = await this._executeWorkflowActions(wf, eventData);
          results.push({ workflow_id: wf.id, name: wf.name, status: 'executed', details: execResult });
        }
      } catch (err) {
        console.error(`[AutomationEngine Error] Workflow ${wf.name}:`, err.message);
        db.logWorkflowExecution({
          workflow_id: wf.id,
          workflow_name: wf.name,
          trigger_event: eventName,
          target_lead_id: eventData.lead?.id || eventData.lead_id,
          target_lead_name: eventData.lead?.business_name,
          status: 'failed',
          details: err.message
        });
        results.push({ workflow_id: wf.id, name: wf.name, status: 'failed', error: err.message });
      }
    }

    return results;
  }

  /**
   * Evaluates if conditions pass for the trigger event data
   */
  _evaluateConditions(conditions, eventData) {
    if (!conditions || conditions.length === 0) return true;
    const targetObj = eventData.lead || eventData;

    return conditions.every(cond => {
      const val = targetObj[cond.field];
      switch (cond.operator) {
        case 'eq': return String(val).toLowerCase() === String(cond.value).toLowerCase();
        case 'neq': return String(val).toLowerCase() !== String(cond.value).toLowerCase();
        case 'gte': return Number(val) >= Number(cond.value);
        case 'lte': return Number(val) <= Number(cond.value);
        case 'contains': return String(val || '').toLowerCase().includes(String(cond.value).toLowerCase());
        default: return true;
      }
    });
  }

  /**
   * Executes configured action steps sequentially
   */
  async _executeWorkflowActions(workflow, eventData) {
    const lead = eventData.lead || (eventData.lead_id ? db.getLeadById(eventData.lead_id) : null);
    const actionLogs = [];

    for (const action of workflow.actions || []) {
      switch (action.type) {
        case 'add_tag':
          if (lead && action.tag) {
            const currentTags = lead.tags || [];
            if (!currentTags.includes(action.tag)) {
              currentTags.push(action.tag);
              db.updateLead(lead.id, { tags: currentTags });
              actionLogs.push(`Added tag "${action.tag}"`);
            }
          }
          break;

        case 'remove_tag':
          if (lead && action.tag) {
            const currentTags = (lead.tags || []).filter(t => t !== action.tag);
            db.updateLead(lead.id, { tags: currentTags });
            actionLogs.push(`Removed tag "${action.tag}"`);
          }
          break;

        case 'update_status':
          if (lead && action.status) {
            db.updateLead(lead.id, {
              status: action.status,
              status_reason: `Automated by workflow: ${workflow.name}`
            });
            actionLogs.push(`Updated status to "${action.status}"`);
          }
          break;

        case 'assign_agent':
          if (lead && action.user_id) {
            const user = db.getUserById(action.user_id);
            if (user) {
              db.updateLead(lead.id, { assigned_to: user });
              actionLogs.push(`Assigned to agent ${user.name}`);
            }
          }
          break;

        case 'create_task':
          if (lead) {
            const task = db.addTask({
              lead_id: lead.id,
              lead_name: lead.business_name,
              title: action.title || 'Follow up with lead',
              priority: action.priority || 'medium',
              due_date: new Date(Date.now() + (action.due_hours || 24) * 3600 * 1000).toISOString()
            });
            actionLogs.push(`Created task: ${task.title}`);
          }
          break;

        case 'send_template':
          if (lead) {
            const eligibility = complianceService.canSendMarketing(lead);
            if (eligibility.eligible) {
              await whatsappProvider.sendTemplateMessage({
                phone: lead.phone,
                templateName: action.template_name || 'gentle_followup_reminder',
                languageCode: 'en'
              });
              actionLogs.push(`Dispatched template "${action.template_name}"`);
            } else {
              actionLogs.push(`Skipped send: ${eligibility.reason}`);
            }
          }
          break;

        case 'add_to_suppression_list':
          if (lead || eventData.phone) {
            const phone = lead?.phone || eventData.phone;
            complianceService.processOptOut(phone, 'Opt-out keyword trigger', lead?.id);
            actionLogs.push(`Added ${phone} to suppression list`);
          }
          break;

        case 'call_n8n_webhook':
          if (action.webhook_url) {
            try {
              await axios.post(action.webhook_url, {
                event: workflow.trigger,
                workflow_name: workflow.name,
                timestamp: new Date().toISOString(),
                lead,
                metadata: eventData
              }, { timeout: 6000 });
              actionLogs.push(`Called n8n webhook: ${action.webhook_url}`);
            } catch (whErr) {
              actionLogs.push(`n8n webhook failed: ${whErr.message}`);
            }
          }
          break;
      }
    }

    db.logWorkflowExecution({
      workflow_id: workflow.id,
      workflow_name: workflow.name,
      trigger_event: workflow.trigger,
      target_lead_id: lead?.id,
      target_lead_name: lead?.business_name,
      status: 'success',
      details: actionLogs.join(' | ')
    });

    return actionLogs;
  }
}

module.exports = new AutomationEngine();
