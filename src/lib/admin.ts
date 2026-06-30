import { auth } from '@/lib/auth'

/**
 * Check if the current session user is an admin.
 * Returns the session if admin, null otherwise.
 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'admin') {
    return null
  }
  return session
}
