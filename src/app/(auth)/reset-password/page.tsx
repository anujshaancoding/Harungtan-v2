'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(
          json.message || 'Failed to reset password. The link may have expired.'
        )
        return
      }

      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="border border-[var(--border)] bg-white p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-red-200 bg-red-50/50">
          <AlertCircle size={24} strokeWidth={1.5} className="text-red-600" />
        </div>
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Invalid Link</h2>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Link href="/forgot-password">
          <Button variant="primary" className="btn-primary mt-6 w-full" size="lg">
            Request New Link
          </Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="border border-[var(--border)] bg-white p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-green-200 bg-green-50/50">
          <CheckCircle size={24} strokeWidth={1.5} className="text-green-600" />
        </div>
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Password Reset</h2>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
        <Link href="/login">
          <Button variant="primary" className="btn-primary mt-6 w-full" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-[var(--border)] bg-white p-8 sm:p-10">
      <div className="mb-8 text-center">
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Reset your password</h2>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
          Enter your new password below
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
          label="New Password"
          type="password"
          icon={Lock}
          placeholder="Enter new password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          loading={loading}
          className="btn-primary w-full"
          size="lg"
        >
          Reset Password
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
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="border border-[var(--border)] bg-white p-8 sm:p-10 text-center">
          <p className="text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
