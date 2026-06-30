'use client'

import { useState, useEffect } from 'react'
import { Check, Plus, Star, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPhone, unformatPhone, formatPincode, unformatPincode } from '@/lib/formatters'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Address } from '@/types'

export interface AddressFormData {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

interface AddressSelectorProps {
  onAddressSelect: (address: AddressFormData) => void
  initialAddress?: AddressFormData | null
}

export function AddressSelector({ onAddressSelect, initialAddress }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saveAddress, setSaveAddress] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [form, setForm] = useState<AddressFormData>({
    fullName: initialAddress?.fullName || '',
    phone: initialAddress?.phone || '',
    addressLine1: initialAddress?.addressLine1 || '',
    addressLine2: initialAddress?.addressLine2 || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    pincode: initialAddress?.pincode || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses')
      if (res.ok) {
        const data = await res.json()
        const list: Address[] = data.addresses || data || []
        setAddresses(list)

        // Pre-select the default address
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0]
          setSelectedId(defaultAddr.id)
        } else {
          setShowForm(true)
        }
      } else {
        setShowForm(true)
      }
    } catch {
      setShowForm(true)
    } finally {
      setLoading(false)
    }
  }

  const mapAddressToFormData = (address: Address): AddressFormData => ({
    fullName: address.name,
    phone: address.phone,
    addressLine1: address.street,
    addressLine2: '',
    city: address.city,
    state: address.state,
    pincode: address.zipCode,
  })

  const handleSelectCard = (address: Address) => {
    setSelectedId(address.id)
  }

  const handleConfirmSelection = () => {
    const selected = addresses.find((a) => a.id === selectedId)
    if (selected) {
      onAddressSelect(mapAddressToFormData(selected))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}

    if (!form.fullName || form.fullName.length < 2) {
      newErrors.fullName = 'Full name is required'
    }
    if (!form.phone || unformatPhone(form.phone).length < 10) {
      newErrors.phone = 'Valid phone number is required'
    }
    if (!form.addressLine1 || form.addressLine1.length < 5) {
      newErrors.addressLine1 = 'Address is required'
    }
    if (!form.city || form.city.length < 2) {
      newErrors.city = 'City is required'
    }
    if (!form.state || form.state.length < 2) {
      newErrors.state = 'State is required'
    }
    const rawPincode = unformatPincode(form.pincode)
    if (!rawPincode || rawPincode.length < 6) {
      newErrors.pincode = 'Valid pincode is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const rawPhone = unformatPhone(form.phone)
    const rawPincode = unformatPincode(form.pincode)

    const formData: AddressFormData = {
      ...form,
      phone: rawPhone,
      pincode: rawPincode,
    }

    // Save address to backend if checkbox is checked
    if (saveAddress) {
      setSaving(true)
      try {
        await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            phone: formData.phone,
            street: formData.addressLine1 + (formData.addressLine2 ? ', ' + formData.addressLine2 : ''),
            city: formData.city,
            state: formData.state,
            zipCode: formData.pincode,
            country: 'India',
            isDefault: addresses.length === 0,
          }),
        })
      } catch {
        // Continue even if save fails
      } finally {
        setSaving(false)
      }
    }

    onAddressSelect(formData)
  }

  if (loading) {
    return (
      <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
        <h2 className="heading-editorial mb-1 text-xl text-[var(--foreground)]">
          Shipping Address
        </h2>
        <p className="subheading mb-6 text-[var(--muted-foreground)]">Delivery details</p>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-[var(--muted)]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
      <h2 className="heading-editorial mb-1 text-xl text-[var(--foreground)]">
        Shipping Address
      </h2>
      <p className="subheading mb-6 text-[var(--muted-foreground)]">
        {showForm ? 'Enter delivery details' : 'Select a delivery address'}
      </p>

      {/* Saved addresses view */}
      {!showForm && addresses.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => {
              const isSelected = selectedId === address.id
              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => handleSelectCard(address)}
                  className={cn(
                    'relative border p-5 text-left transition-all',
                    isSelected
                      ? 'border-[var(--foreground)] bg-[var(--muted)]'
                      : 'border-[var(--border)] hover:border-[var(--foreground)]/40'
                  )}
                >
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      'absolute right-3 top-3 flex h-5 w-5 items-center justify-center border transition-colors',
                      isSelected
                        ? 'border-[var(--foreground)] bg-[var(--foreground)]'
                        : 'border-[var(--border)] bg-white'
                    )}
                  >
                    {isSelected && <Check size={12} strokeWidth={2} className="text-white" />}
                  </div>

                  <div className="pr-8">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {address.name}
                      </p>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-[var(--foreground)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                          <Star size={8} strokeWidth={1.5} /> Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                      {address.phone}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {address.street}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {address.city}, {address.state} - {address.zipCode}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)] transition-colors hover:text-[var(--foreground)]"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add New Address
          </button>

          <div className="flex justify-end pt-6">
            <Button
              type="button"
              size="lg"
              iconRight={ChevronRight}
              onClick={handleConfirmSelection}
              disabled={!selectedId}
            >
              Continue to Review
            </Button>
          </div>
        </>
      )}

      {/* Address form view */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.fullName}
              onChange={(e) => {
                setForm({ ...form, fullName: e.target.value })
                if (errors.fullName) setErrors({ ...errors, fullName: undefined })
              }}
              error={errors.fullName}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="98765 43210"
              value={formatPhone(form.phone)}
              onChange={(e) => {
                const raw = unformatPhone(e.target.value)
                setForm({ ...form, phone: raw })
                if (errors.phone) setErrors({ ...errors, phone: undefined })
              }}
              error={errors.phone}
            />
          </div>

          <Input
            label="Address Line 1"
            placeholder="House no., Street name"
            value={form.addressLine1}
            onChange={(e) => {
              setForm({ ...form, addressLine1: e.target.value })
              if (errors.addressLine1) setErrors({ ...errors, addressLine1: undefined })
            }}
            error={errors.addressLine1}
          />

          <Input
            label="Address Line 2 (Optional)"
            placeholder="Apartment, floor, landmark"
            value={form.addressLine2 || ''}
            onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="City"
              placeholder="Mumbai"
              value={form.city}
              onChange={(e) => {
                setForm({ ...form, city: e.target.value })
                if (errors.city) setErrors({ ...errors, city: undefined })
              }}
              error={errors.city}
            />
            <Input
              label="State"
              placeholder="Maharashtra"
              value={form.state}
              onChange={(e) => {
                setForm({ ...form, state: e.target.value })
                if (errors.state) setErrors({ ...errors, state: undefined })
              }}
              error={errors.state}
            />
            <Input
              label="Pincode"
              placeholder="400 001"
              value={formatPincode(form.pincode)}
              onChange={(e) => {
                const raw = unformatPincode(e.target.value)
                setForm({ ...form, pincode: raw })
                if (errors.pincode) setErrors({ ...errors, pincode: undefined })
              }}
              error={errors.pincode}
            />
          </div>

          {/* Save address checkbox */}
          <label className="flex items-center gap-3 text-sm text-[var(--foreground)] cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-5 w-5 border border-[var(--border)] bg-white transition-colors peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] flex items-center justify-center">
                {saveAddress && <Check size={12} strokeWidth={2} className="text-white" />}
              </div>
            </div>
            Save this address for future orders
          </label>

          <div className="flex items-center justify-between pt-4">
            {addresses.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
                icon={X}
              >
                Cancel
              </Button>
            )}
            <div className={addresses.length === 0 ? 'ml-auto' : ''}>
              <Button type="submit" size="lg" iconRight={ChevronRight} loading={saving}>
                Continue to Review
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddressSelector
