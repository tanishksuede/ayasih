/** Shared validation helpers for AYA serverless API endpoints. */
export function validateString(value, fieldName, maxLength = 500) {
  if (typeof value !== 'string') return `${fieldName} must be a string`;
  if (!value.trim()) return `${fieldName} cannot be empty`;
  if (value.length > maxLength) return `${fieldName} exceeds maximum length of ${maxLength} characters`;
  return null;
}

export function validateUUID(value, fieldName) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof value !== 'string' || !uuidPattern.test(value)
    ? `${fieldName} must be a valid UUID`
    : null;
}

export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;').trim();
}

export function errorResponse(res, status, message) {
  return res.status(status).json({ success: false, error: message, timestamp: new Date().toISOString() });
}
