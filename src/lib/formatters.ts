/**
 * Format phone number as user types: 98765 43210
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)} ${digits.slice(5)}`
}

/**
 * Extract raw digits from formatted phone
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10)
}

/**
 * Format pincode as user types: 400 001
 */
export function formatPincode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 3) return digits
  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}

/**
 * Extract raw digits from formatted pincode
 */
export function unformatPincode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6)
}
