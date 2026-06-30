'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.message || 'Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-[var(--border)] bg-white p-8 sm:p-10">
      {submitted ? (
        /* Success state */
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-green-200 bg-green-50/50">
            <CheckCircle size={24} strokeWidth={1.5} className="text-green-600" />
          </div>
          <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Check your email</h2>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
            If an account exists with that email, we&apos;ll send a password
            reset link. Please check your inbox and spam folder.
          </p>
          <Link href="/login">
            <Button variant="primary" className="btn-primary mt-6 w-full" size="lg">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        /* Form state */
        <>
          <div className="mb-8 text-center">
            <h2 className="heading-editorial text-2xl text-[var(--foreground)]">
              Forgot your password?
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 border border-red-200 bg-red-50/50 px-4 py-3 text-red-700" style={{ fontSize: '13px' }}>
              <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              loading={loading}
              className="btn-primary w-full"
              size="lg"
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
              style={{ fontSize: '13px' }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
