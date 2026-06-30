'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Lock,
  MapPin,
  Bell,
  Trash2,
  Plus,
  Edit3,
  Check,
  X,
  Star,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Address } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'

// ------- Change Password Section -------
function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to change password.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-[var(--border)] bg-white">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-5">
        <Lock size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
        <h2 className="heading-editorial text-lg text-[var(--foreground)]">Change Password</h2>
      </div>
      <form onSubmit={handleChangePassword} className="space-y-5 p-6">
        {message && (
          <div
            className={cn(
              'px-4 py-3 text-sm border',
              message.type === 'success'
                ? 'bg-green-50/50 text-green-700 border-green-200'
                : 'bg-red-50/50 text-red-700 border-red-200'
            )}
          >
            {message.text}
          </div>
        )}
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          hint="Minimum 8 characters"
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <Button type="submit" variant="primary" size="sm" loading={saving}>
          Update Password
        </Button>
      </form>
    </div>
  )
}

// ------- Address Management Section -------
function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false,
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (address: Address) => {
    setForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId
        ? `/api/user/addresses/${editingId}`
        : '/api/user/addresses'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        await fetchAddresses()
        resetForm()
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id))
      }
    } catch {
      // silently fail
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}/default`, {
        method: 'PATCH',
      })
      if (res.ok) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id }))
        )
      }
    } catch {
      // silently fail
    }
  }

  return (
    <div className="border border-[var(--border)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-center gap-3">
          <MapPin size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
          <h2 className="heading-editorial text-lg text-[var(--foreground)]">
            Manage Addresses
          </h2>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)] transition-colors hover:text-[var(--warm-dark)]"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add New
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Address Form */}
        {showForm && (
          <form onSubmit={handleSave} className="mb-6 space-y-5 border border-[var(--border)] bg-[var(--muted)] p-6">
            <h3 className="subheading text-[var(--foreground)]">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <Input
              label="Street Address"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <Input
                label="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                required
              />
              <Input
                label="PIN Code"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                required
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--foreground)] cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 border border-[var(--border)] bg-white transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] flex items-center justify-center">
                  {form.isDefault && <Check size={12} strokeWidth={2} className="text-white" />}
                </div>
              </div>
              Set as default address
            </label>
            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="sm" loading={saving}>
                {editingId ? 'Update Address' : 'Save Address'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse bg-[var(--muted)]"
              />
            ))}
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
            No addresses saved yet. Add your first delivery address.
          </p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={cn(
                  'border p-5 transition-colors',
                  address.isDefault
                    ? 'border-[var(--foreground)] bg-[var(--muted)]'
                    : 'border-[var(--border)]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {address.name}
                      </p>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-[var(--foreground)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          <Star size={10} strokeWidth={1.5} /> Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                      {address.street}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                      Phone: {address.phone}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        title="Set as default"
                      >
                        <Star size={14} strokeWidth={1.5} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ------- Newsletter Preferences Section -------
function NewsletterSection() {
  const [preferences, setPreferences] = useState({
    newArrivals: true,
    promotions: true,
    orderUpdates: true,
    newsletter: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  const options = [
    {
      key: 'orderUpdates',
      label: 'Order Updates',
      description: 'Shipping, delivery, and return notifications',
    },
    {
      key: 'newArrivals',
      label: 'New Arrivals',
      description: 'Be the first to know about new products',
    },
    {
      key: 'promotions',
      label: 'Promotions & Sales',
      description: 'Exclusive deals and discount offers',
    },
    {
      key: 'newsletter',
      label: 'Weekly Newsletter',
      description: 'Style tips, behind the scenes, and more',
    },
  ] as const

  return (
    <div className="border border-[var(--border)] bg-white">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-5">
        <Bell size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
        <h2 className="heading-editorial text-lg text-[var(--foreground)]">
          Notification Preferences
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          {options.map((option) => (
            <label
              key={option.key}
              className="flex items-start gap-4 cursor-pointer group"
            >
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={preferences[option.key]}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [option.key]: e.target.checked,
                    })
                  }
                  className="peer sr-only"
                />
                <div
                  className={cn(
                    'h-5 w-9 transition-colors cursor-pointer relative',
                    preferences[option.key]
                      ? 'bg-[var(--accent)]'
                      : 'bg-[var(--border)]'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 h-4 w-4 bg-white shadow-sm transition-transform',
                      preferences[option.key] ? 'translate-x-4.5 left-0' : 'left-0.5'
                    )}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{option.label}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-8">
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            onClick={handleSave}
          >
            {saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ------- Delete Account Section -------
function DeleteAccountSection() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return
    setDeleting(true)

    try {
      const res = await fetch('/api/user/account', { method: 'DELETE' })
      if (res.ok) {
        window.location.href = '/'
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="border border-red-200 bg-white">
      <div className="flex items-center gap-3 border-b border-red-100 px-6 py-5">
        <AlertTriangle size={18} strokeWidth={1.5} className="text-red-500" />
        <h2 className="heading-editorial text-lg text-red-700">Danger Zone</h2>
      </div>
      <div className="p-6">
        {!showConfirm ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Delete Account</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-red-200 bg-red-50/50 p-4">
              <p className="text-sm text-red-700">
                This will permanently delete your account, order history,
                addresses, and all personal data. This action{' '}
                <strong>cannot be undone</strong>.
              </p>
            </div>
            <Input
              label='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                size="sm"
                loading={deleting}
                disabled={confirmText !== 'DELETE'}
                onClick={handleDelete}
              >
                Permanently Delete Account
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ------- Settings Page -------
export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageBreadcrumb className="mb-2" />
      <div>
        <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Account Settings</h2>
        <div className="divider-accent mt-3" />
      </div>
      <ChangePasswordSection />
      <AddressSection />
      <NewsletterSection />
      <DeleteAccountSection />
    </div>
  )
}
