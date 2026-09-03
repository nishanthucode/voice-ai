import { WorkflowCondition, PriorityLevel } from '../db/types';

export interface ConditionEvaluationResult {
  conditionId: string;
  matched: boolean;
  fieldName: string;
  operator: string;
  comparisonValue: string;
  actualValue: any;
  priorityOverride?: PriorityLevel;
  customMessage?: string;
}

export function evaluateConditions(
  conditions: WorkflowCondition[],
  extractedFields: Record<string, any>
): ConditionEvaluationResult[] {
  const results: ConditionEvaluationResult[] = [];

  for (const cond of conditions) {
    const actualVal = extractedFields[cond.field_name];
    let matched = false;

    if (actualVal !== undefined && actualVal !== null && actualVal !== '') {
      switch (cond.operator) {
        case 'equals':
          matched = String(actualVal).toLowerCase() === String(cond.comparison_value).toLowerCase();
          break;
        case 'not_equals':
          matched = String(actualVal).toLowerCase() !== String(cond.comparison_value).toLowerCase();
          break;
        case 'contains':
          matched = String(actualVal).toLowerCase().includes(String(cond.comparison_value).toLowerCase());
          break;
        case 'greater_than':
          matched = Number(actualVal) > Number(cond.comparison_value);
          break;
        case 'less_than':
          matched = Number(actualVal) < Number(cond.comparison_value);
          break;
        case 'is_true':
          matched = actualVal === true || String(actualVal).toLowerCase() === 'true';
          break;
        case 'is_false':
          matched = actualVal === false || String(actualVal).toLowerCase() === 'false';
          break;
        case 'within_hours': {
          const hours = parseFloat(cond.comparison_value);
          const targetDate = new Date(actualVal);
          if (!isNaN(targetDate.getTime()) && !isNaN(hours)) {
            const now = new Date();
            const diffHours = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            matched = diffHours >= 0 && diffHours <= hours;
          }
          break;
        }
        case 'before': {
          const targetDate = new Date(actualVal);
          const compDate = new Date(cond.comparison_value);
          if (!isNaN(targetDate.getTime()) && !isNaN(compDate.getTime())) {
            matched = targetDate.getTime() < compDate.getTime();
          }
          break;
        }
        case 'after': {
          const targetDate = new Date(actualVal);
          const compDate = new Date(cond.comparison_value);
          if (!isNaN(targetDate.getTime()) && !isNaN(compDate.getTime())) {
            matched = targetDate.getTime() > compDate.getTime();
          }
          break;
        }
        default:
          matched = false;
      }
    }

    results.push({
      conditionId: cond.id,
      matched,
      fieldName: cond.field_name,
      operator: cond.operator,
      comparisonValue: cond.comparison_value,
      actualValue: actualVal ?? null,
      priorityOverride: matched ? cond.action_config.set_priority : undefined,
      customMessage: matched ? cond.action_config.custom_message : undefined,
    });
  }

  return results;
}
