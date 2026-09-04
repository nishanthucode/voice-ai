import { WorkflowField } from '../db/types';

export function extractFieldsFromText(
  userText: string,
  fields: WorkflowField[],
  existingFields: Record<string, any>
): Record<string, any> {
  const updated = { ...existingFields };
  const textLower = userText.toLowerCase();

  for (const field of fields) {
    const fieldName = field.name;

    // Rule-based heuristic extractions for robust fallback
    if (fieldName === 'caller_name' && !updated.caller_name) {
      const nameMatch = userText.match(/(?:my name is|i am|this is|im)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (nameMatch && nameMatch[1]) {
        updated.caller_name = nameMatch[1].trim();
      }
    }

    if (fieldName === 'cake_type' && !updated.cake_type) {
      if (textLower.includes('birthday')) updated.cake_type = 'Birthday Cake';
      else if (textLower.includes('wedding')) updated.cake_type = 'Wedding Cake';
      else if (textLower.includes('anniversary')) updated.cake_type = 'Anniversary Cake';
      else if (textLower.includes('custom') || textLower.includes('cake')) updated.cake_type = 'Custom Cake';
    }

    if (fieldName === 'flavour' && !updated.flavour) {
      if (textLower.includes('chocolate') || textLower.includes('choc')) updated.flavour = 'Belgian Chocolate';
      else if (textLower.includes('vanilla')) updated.flavour = 'Vanilla Bean';
      else if (textLower.includes('red velvet')) updated.flavour = 'Red Velvet';
      else if (textLower.includes('strawberry')) updated.flavour = 'Fresh Strawberry';
      else if (textLower.includes('pineapple')) updated.flavour = 'Pineapple';
      else if (textLower.includes('mango')) updated.flavour = 'Mango Mousse';
    }

    if (fieldName === 'weight' && !updated.weight) {
      const weightMatch = userText.match(/(\d+(?:\.\d+)?\s*(?:kg|kilo|pound|lbs|tier))/i);
      if (weightMatch) {
        updated.weight = weightMatch[1].trim();
      }
    }

    if (fieldName === 'delivery_or_pickup' && !updated.delivery_or_pickup) {
      if (textLower.includes('deliver') || textLower.includes('home delivery')) updated.delivery_or_pickup = 'Delivery';
      else if (textLower.includes('pickup') || textLower.includes('store')) updated.delivery_or_pickup = 'Pickup';
    }

    if (fieldName === 'delivery_address' && !updated.delivery_address) {
      const addrMatch = userText.match(/(?:deliver to|address is|at)\s+([0-9]+\s+[A-Za-z0-9\s,.]+)/i);
      if (addrMatch) {
        updated.delivery_address = addrMatch[1].trim();
      }
    }

    if (fieldName === 'property_type' && !updated.property_type) {
      if (textLower.includes('2bhk') || textLower.includes('2 bedroom')) updated.property_type = '2BHK Apartment';
      else if (textLower.includes('3bhk') || textLower.includes('3 bedroom')) updated.property_type = '3BHK Luxury Apartment';
      else if (textLower.includes('villa') || textLower.includes('house')) updated.property_type = 'Independent Villa';
      else if (textLower.includes('office') || textLower.includes('commercial')) updated.property_type = 'Commercial Space';
    }

    if (fieldName === 'preferred_location' && !updated.preferred_location) {
      const locMatch = userText.match(/(?:in|near|at|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (locMatch && !['Birthday', 'Delivery', 'Pickup'].includes(locMatch[1])) {
        updated.preferred_location = locMatch[1].trim();
      }
    }

    if (fieldName === 'budget' && !updated.budget) {
      const budgetMatch = userText.match(/(\$\d+(?:\.\d+)?\s*(?:k|m|million|thousand)?|\d+\s*(?:lakhs|cr|dollars))/i);
      if (budgetMatch) {
        updated.budget = budgetMatch[1].trim();
      }
    }

    if ((fieldName === 'required_date' || fieldName === 'preferred_visit_datetime' || fieldName === 'preferred_appointment_datetime') && !updated[fieldName]) {
      if (textLower.includes('tomorrow')) {
        const tomorrow = new Date(Date.now() + 86400000);
        tomorrow.setHours(15, 0, 0, 0);
        updated[fieldName] = tomorrow.toISOString();
      } else if (textLower.includes('friday') || textLower.includes('weekend')) {
        const nextDate = new Date(Date.now() + 86400000 * 3);
        nextDate.setHours(10, 0, 0, 0);
        updated[fieldName] = nextDate.toISOString();
      }
    }
  }

  return updated;
}
