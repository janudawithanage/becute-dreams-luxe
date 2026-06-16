/**
 * Validation utilities
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic US format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Sanitize string for safe display
 */
export function sanitize(value: string): string {
  return value.trim().replace(/[<>]/g, "");
}
