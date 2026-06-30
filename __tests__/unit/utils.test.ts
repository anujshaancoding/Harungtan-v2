import {
  cn,
  formatPrice,
  formatDate,
  truncate,
  generateSlug,
  getDiscountPercentage,
  parseJsonField,
} from '@/lib/utils'

describe('cn', () => {
  it('joins multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(false, undefined, null)).toBe('')
  })

  it('returns single class when only one is provided', () => {
    expect(cn('solo')).toBe('solo')
  })

  it('returns empty string when called with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
  })
})

describe('formatPrice', () => {
  it('formats a whole number price in INR', () => {
    const result = formatPrice(1000)
    expect(result).toContain('1,000')
    expect(result).toContain('₹')
  })

  it('formats a decimal price', () => {
    const result = formatPrice(999.99)
    expect(result).toContain('999.99')
  })

  it('formats zero', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
  })

  it('formats large numbers with Indian grouping', () => {
    const result = formatPrice(100000)
    // Indian numbering: 1,00,000
    expect(result).toContain('1,00,000')
  })
})

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date('2025-01-15T00:00:00Z')
    const result = formatDate(date)
    expect(result).toContain('January')
    expect(result).toContain('2025')
    expect(result).toContain('15')
  })

  it('formats a date string', () => {
    const result = formatDate('2024-12-25T00:00:00Z')
    expect(result).toContain('December')
    expect(result).toContain('2024')
    expect(result).toContain('25')
  })

  it('formats an ISO string', () => {
    const result = formatDate('2024-06-01T12:00:00.000Z')
    expect(result).toContain('June')
    expect(result).toContain('2024')
  })
})

describe('truncate', () => {
  it('returns the string unchanged if within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('returns the string unchanged if exactly at limit', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates and adds ellipsis when exceeding limit', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('handles length of 0', () => {
    expect(truncate('hello', 0)).toBe('...')
  })
})

describe('generateSlug', () => {
  it('converts to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('round neck tshirt')).toBe('round-neck-tshirt')
  })

  it('removes special characters', () => {
    expect(generateSlug('V-Neck T-Shirt!')).toBe('v-neck-t-shirt')
  })

  it('removes leading and trailing hyphens', () => {
    expect(generateSlug('--hello--')).toBe('hello')
  })

  it('handles multiple consecutive special characters', () => {
    expect(generateSlug('foo   &&&  bar')).toBe('foo-bar')
  })

  it('handles single word', () => {
    expect(generateSlug('Polo')).toBe('polo')
  })
})

describe('getDiscountPercentage', () => {
  it('calculates discount correctly', () => {
    expect(getDiscountPercentage(750, 1000)).toBe(25)
  })

  it('returns 0 when comparePrice is 0', () => {
    expect(getDiscountPercentage(500, 0)).toBe(0)
  })

  it('returns 0 when comparePrice is less than price', () => {
    expect(getDiscountPercentage(1000, 500)).toBe(0)
  })

  it('returns 0 when comparePrice equals price', () => {
    expect(getDiscountPercentage(500, 500)).toBe(0)
  })

  it('rounds the percentage', () => {
    // 100 off 300 = 33.33...% => 33
    expect(getDiscountPercentage(200, 300)).toBe(33)
  })

  it('handles 100% discount', () => {
    expect(getDiscountPercentage(0, 1000)).toBe(100)
  })
})

describe('parseJsonField', () => {
  it('parses a valid JSON array of strings', () => {
    expect(parseJsonField('["S","M","L"]')).toEqual(['S', 'M', 'L'])
  })

  it('returns empty array for invalid JSON', () => {
    expect(parseJsonField('not json')).toEqual([])
  })

  it('parses an empty JSON array', () => {
    expect(parseJsonField('[]')).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseJsonField('')).toEqual([])
  })

  it('parses a single-element array', () => {
    expect(parseJsonField('["XL"]')).toEqual(['XL'])
  })
})
