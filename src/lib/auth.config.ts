import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-safe auth config. Contains NO Prisma adapter, bcrypt, or provider
 * `authorize` logic, so it can be bundled into the Edge middleware without
 * exceeding Vercel's 1 MB Edge Function limit. The full config (with adapter
 * and credentials logic) lives in `auth.ts` and runs in the Node.js runtime.
 *
 * Middleware only needs to *read* the JWT session cookie — it does not sign
 * users in — so `providers` can be empty here. The `session` callback copies
 * `id`/`role` off the already-populated token (the prisma-backed `jwt`
 * callback that fills the token lives in `auth.ts`).
 */
export const authConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
