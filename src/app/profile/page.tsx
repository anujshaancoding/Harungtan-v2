'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Heart,
  MapPin,
  Settings,
  Edit3,
  Check,
  X,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const quickLinks = [
  {
    label: 'My Orders',
    description: 'Track, return, or buy things again',
    href: '/profile/orders',
    icon: Package,
  },
  {
    label: 'Wishlist',
    description: 'Your saved items',
    href: '/profile/wishlist',
    icon: Heart,
  },
  {
    label: 'Addresses',
    description: 'Manage your delivery addresses',
    href: '/profile/settings',
    icon: MapPin,
  },
  {
    label: 'Settings',
    description: 'Password, notifications & more',
    href: '/profile/settings',
    icon: Settings,
  },
]

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
    }
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })

      if (res.ok) {
        await update({ name })
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCancel = () => {
    setName(session?.user?.name || '')
    setPhone('')
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={cn(
            'px-4 py-3',
            message.type === 'success'
              ? 'border border-green-200 bg-green-50/50 text-green-700'
              : 'border border-red-200 bg-red-50/50 text-red-700'
          )}
          style={{ fontSize: '13px' }}
        >
          {message.text}
        </div>
      )}

      {/* User Info Card */}
      <div className="border border-[var(--border)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <span className="subheading" style={{ fontSize: '11px' }}>Account</span>
            <h2 className="heading-editorial text-lg text-[var(--foreground)]">Personal Information</h2>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  loading={saving}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button variant="ghost" size="sm" icon={X} onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User size={18} strokeWidth={1.5} className="mt-0.5 text-[var(--accent)]" />
                <div>
                  <p className="uppercase tracking-wide text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    Name
                  </p>
                  <p className="mt-0.5 text-[var(--foreground)]" style={{ fontSize: '13px' }}>
                    {session?.user?.name || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} strokeWidth={1.5} className="mt-0.5 text-[var(--accent)]" />
                <div>
                  <p className="uppercase tracking-wide text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    Email
                  </p>
                  <p className="mt-0.5 text-[var(--foreground)]" style={{ fontSize: '13px' }}>{session?.user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} strokeWidth={1.5} className="mt-0.5 text-[var(--accent)]" />
                <div>
                  <p className="uppercase tracking-wide text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    Phone
                  </p>
                  <p className="mt-0.5 text-[var(--foreground)]" style={{ fontSize: '13px' }}>Not set</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} strokeWidth={1.5} className="mt-0.5 text-[var(--accent)]" />
                <div>
                  <p className="uppercase tracking-wide text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                    Member Since
                  </p>
                  <p className="mt-0.5 text-[var(--foreground)]" style={{ fontSize: '13px' }}>
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <span className="subheading" style={{ fontSize: '11px' }}>Navigate</span>
        <h2 className="heading-editorial mb-4 text-lg text-[var(--foreground)]">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover-lift group flex items-center gap-4 border border-[var(--border)] bg-white p-5 transition-all hover:border-[var(--accent)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--muted)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                <link.icon size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]" style={{ fontSize: '13px' }}>{link.label}</p>
                <p className="text-[var(--muted-foreground)]" style={{ fontSize: '11px' }}>{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
