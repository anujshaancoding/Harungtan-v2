import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it to your environment variables to enable payments.'
      )
    }
    stripeInstance = new Stripe(key, { apiVersion: '2026-02-25.clover' })
  }
  return stripeInstance
}

// Lazy proxy: the real Stripe client is only constructed on first property
// access (at request time), so importing this module never requires the key.
// This keeps `next build` from failing when STRIPE_SECRET_KEY is absent.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripe(), prop, receiver)
  },
})

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}
