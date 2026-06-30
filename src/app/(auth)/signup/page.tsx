'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Lock, AlertCircle, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' }
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' }
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' }
  return { score, label: 'Very Strong', color: 'bg-emerald-500' }
}

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  })

  const password = watch('password')
  const strength = getPasswordStrength(password || '')

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.message || 'Registration failed. Please try again.')
        return
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created but sign-in failed. Please log in manually.')
        router.push('/login')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch {
      setError('Google sign-up failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="border border-[var(--border)] bg-white p-8 sm:p-10">
      <div className="mb-8 text-center">
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Create an account</h2>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
          Join Harungtan for exclusive styles
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
          label="Full Name"
          type="text"
          icon={User}
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register('password')}
          />
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 transition-colors',
                      i <= strength.score ? strength.color : 'bg-[var(--border)]'
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-[var(--muted-foreground)]" style={{ fontSize: '11px' }}>
                Password strength:{' '}
                <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-2 text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--accent)]"
              style={{ borderRadius: 0 }}
              {...register('acceptTerms')}
            />
            <span>
              I agree to the{' '}
              <Link
                href="/terms-of-service"
                className="font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                target="_blank"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-red-600" style={{ fontSize: '12px' }}>
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          className="btn-primary w-full"
          size="lg"
        >
          Create Account
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

      {/* Google sign-up */}
      <Button
        type="button"
        variant="secondary"
        className="btn-outline w-full"
        size="lg"
        loading={googleLoading}
        onClick={handleGoogleSignUp}
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

      {/* Login link */}
      <p className="mt-6 text-center text-[var(--muted-foreground)]" style={{ fontSize: '13px' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--warm-dark)]"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
