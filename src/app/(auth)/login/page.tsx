'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      setError('Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="border border-[var(--border)] bg-white p-8 sm:p-10">
      <div className="mb-8 text-center">
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Welcome back</h2>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
          Sign in to your account
        </p>
      </div>

      {/* Error message */}
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

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
            <input
              type="checkbox"
              className="h-4 w-4 border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--accent)]"
              style={{ borderRadius: 0 }}
              {...register('rememberMe')}
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            style={{ fontSize: '13px' }}
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="btn-primary w-full"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="uppercase text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
          or continue with
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      {/* Google sign-in */}
      <Button
        type="button"
        variant="secondary"
        className="btn-outline w-full"
        size="lg"
        loading={googleLoading}
        onClick={handleGoogleSignIn}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>

      {/* Sign up link */}
      <p className="mt-6 text-center text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--warm-dark)]"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
