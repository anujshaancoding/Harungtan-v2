'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, GripVertical, Film, ImageIcon, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  mediaUrl: string
  mediaType: string
  ctaText: string | null
  ctaLink: string | null
  ctaText2: string | null
  ctaLink2: string | null
  sortOrder: number
  active: boolean
}

const emptyBanner = {
  title: '',
  subtitle: '',
  description: '',
  mediaUrl: '',
  mediaType: 'image',
  ctaText: '',
  ctaLink: '',
  ctaText2: '',
  ctaLink2: '',
  sortOrder: 0,
  active: true,
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyBanner)

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      setBanners(data.banners || [])
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBanners() }, [fetchBanners])

  function openNew() {
    setForm({ ...emptyBanner, sortOrder: banners.length })
    setEditing(null)
    setIsNew(true)
  }

  function openEdit(banner: Banner) {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      mediaUrl: banner.mediaUrl,
      mediaType: banner.mediaType,
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      ctaText2: banner.ctaText2 || '',
      ctaLink2: banner.ctaLink2 || '',
      sortOrder: banner.sortOrder,
      active: banner.active,
    })
    setEditing(banner)
    setIsNew(false)
  }

  async function handleSave() {
    if (!form.title || !form.mediaUrl) return
    setSaving(true)

    try {
      const url = isNew ? '/api/admin/banners' : `/api/admin/banners/${editing!.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        await fetchBanners()
        setEditing(null)
        setIsNew(false)
      }
    } catch (error) {
      console.error('Failed to save banner:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return
    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      await fetchBanners()
    } catch (error) {
      console.error('Failed to delete banner:', error)
    }
  }

  async function toggleActive(banner: Banner) {
    try {
      await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, active: !banner.active }),
      })
      await fetchBanners()
    } catch (error) {
      console.error('Failed to toggle banner:', error)
    }
  }

  const showForm = isNew || editing

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Hero Banners</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your homepage hero carousel slides. Supports images and videos.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--warm-dark)]"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold text-[var(--foreground)]">
            {isNew ? 'New Banner' : 'Edit Banner'}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Wear What Defines You"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. Spring/Summer 2026"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Media Type *</label>
              <select
                value={form.mediaType}
                onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Media URL * <span className="font-normal text-[var(--muted-foreground)]">({form.mediaType === 'video' ? 'MP4/WebM URL' : 'Image URL'})</span>
              </label>
              <input
                type="url"
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                placeholder={form.mediaType === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description shown below the title"
                rows={2}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">CTA Button 1 Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="e.g. Shop Now"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">CTA Button 1 Link</label>
              <input
                type="text"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="e.g. /products?newArrival=true"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">CTA Button 2 Text</label>
              <input
                type="text"
                value={form.ctaText2}
                onChange={(e) => setForm({ ...form, ctaText2: e.target.value })}
                placeholder="e.g. Explore All"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">CTA Button 2 Link</label>
              <input
                type="text"
                value={form.ctaLink2}
                onChange={(e) => setForm({ ...form, ctaLink2: e.target.value })}
                placeholder="e.g. /products"
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-sm font-medium text-[var(--foreground)]">Active</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.mediaUrl && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-[var(--foreground)]">Preview</p>
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {form.mediaType === 'video' ? (
                  <video src={form.mediaUrl} className="h-full w-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.mediaUrl}
              className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--warm-dark)] disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Create Banner' : 'Update Banner'}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false) }}
              className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banner List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-[var(--muted-foreground)]">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white">
          <ImageIcon size={32} className="mb-3 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">No banners yet. Add your first hero banner.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={cn(
                'flex items-center gap-4 rounded-xl border bg-white p-4 transition-colors',
                banner.active ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-60'
              )}
            >
              <GripVertical size={18} className="text-[var(--muted-foreground)] shrink-0" />

              {/* Thumbnail */}
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {banner.mediaType === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <Film size={24} className="text-white/60" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={banner.mediaUrl} alt={banner.title} className="h-full w-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--foreground)] truncate">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-[var(--muted-foreground)] truncate">{banner.subtitle}</p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    banner.mediaType === 'video'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  )}>
                    {banner.mediaType === 'video' ? <Film size={10} /> : <ImageIcon size={10} />}
                    {banner.mediaType}
                  </span>
                  <span className="text-[11px] text-[var(--muted-foreground)]">Order: {banner.sortOrder}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(banner)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  title={banner.active ? 'Deactivate' : 'Activate'}
                >
                  {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openEdit(banner)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
