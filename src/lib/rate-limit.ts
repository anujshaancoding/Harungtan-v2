const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Max requests allowed within the window */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
}

/**
 * Simple in-memory rate limiter for API routes.
 * Returns { success: true } if under limit, { success: false } if over limit.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number } {
  const now = Date.now()
  const key = identifier
  const entry = rateLimit.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, {
      count: 1,
      resetTime: now + options.windowSeconds * 1000,
    })
    return { success: true, remaining: options.maxRequests - 1 }
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: options.maxRequests - entry.count }
}

/**
 * Get client IP from request headers (works behind proxies).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
