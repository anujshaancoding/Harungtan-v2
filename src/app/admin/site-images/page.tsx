'use client'

import { useEffect, useState, useCallback } from 'react'
import { Pencil, ImageIcon, Save, X, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SiteImage {
  id: string
  section: string
  key: string
  label: string
  imageUrl: string
  link: string | null
  sortOrder: number
  active: boolean
}

// Default entries for each section (used for "Initialize with Defaults")
const SECTION_DEFAULTS: Record<string, { key: string; label: string; imageUrl: string; link?: string }[]> = {
  category: [
    { key: 'round-neck', label: 'Round Neck', imageUrl: 'https://picsum.photos/seed/cat-roundneck/800/1000', link: '/products?category=round-neck' },
    { key: 'v-neck', label: 'V-Neck', imageUrl: 'https://picsum.photos/seed/cat-vneck/600/800', link: '/products?category=v-neck' },
    { key: 'polo', label: 'Polo', imageUrl: 'https://picsum.photos/seed/cat-polo/600/800', link: '/products?category=polo' },
    { key: 'henley', label: 'Henley', imageUrl: 'https://picsum.photos/seed/cat-henley/800/1000', link: '/products?category=henley' },
    { key: 'oversized', label: 'Oversized', imageUrl: 'https://picsum.photos/seed/cat-oversized/800/1000', link: '/products?category=oversized' },
    { key: 'graphic-tees', label: 'Graphic Tees', imageUrl: 'https://picsum.photos/seed/cat-graphic/600/800', link: '/products?category=graphic-tees' },
  ],
  editorial: [
    { key: 'editorial-main', label: 'Editorial / Craftsmanship', imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=960&h=1200&fit=crop&q=80' },
  ],
  lifestyle: [
    { key: 'lifestyle-banner', label: 'Lifestyle Banner', imageUrl: 'https://picsum.photos/seed/harungtan-lifestyle/1920/1080' },
  ],
  'why-choose-us': [
    { key: 'premium-cotton', label: 'Premium Cotton', imageUrl: 'https://picsum.photos/seed/harungtan-cotton/800/800' },
    { key: 'perfect-fit', label: 'Perfect Fit', imageUrl: 'https://picsum.photos/seed/harungtan-fit/800/800' },
    { key: 'built-to-last', label: 'Built to Last', imageUrl: 'https://picsum.photos/seed/harungtan-durability/800/800' },
  ],
  instagram: [
    { key: 'ig-1', label: 'Instagram 1', imageUrl: 'https://picsum.photos/seed/harungtan-ig-1/600/600' },
    { key: 'ig-2', label: 'Instagram 2', imageUrl: 'https://picsum.photos/seed/harungtan-ig-2/600/600' },
    { key: 'ig-3', label: 'Instagram 3', imageUrl: 'https://picsum.photos/seed/harungtan-ig-3/600/600' },
    { key: 'ig-4', label: 'Instagram 4', imageUrl: 'https://picsum.photos/seed/harungtan-ig-4/600/600' },
    { key: 'ig-5', label: 'Instagram 5', imageUrl: 'https://picsum.photos/seed/harungtan-ig-5/600/600' },
    { key: 'ig-6', label: 'Instagram 6', imageUrl: 'https://picsum.photos/seed/harungtan-ig-6/600/600' },
  ],
  newsletter: [
    { key: 'newsletter-bg', label: 'Newsletter Background', imageUrl: 'https://picsum.photos/seed/newsletter-harungtan/1200/800' },
  ],
}

const TABS = [
  { key: 'category', label: 'Shop by Style' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'lifestyle', label: 'Lifestyle Banner' },
  { key: 'why-choose-us', label: 'The Craft' },
  { key: 'instagram', label: 'Instagram Feed' },
  { key: 'newsletter', label: 'Join the Club' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function SiteImagesPage() {
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('category')

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/site-images')
      const data = await res.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Failed to fetch site images:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  const sectionImages = images.filter((i) => i.section === activeTab)
  const defaults = SECTION_DEFAULTS[activeTab] || []

  async function handleSaveUrl(image: SiteImage) {
    setSaving(true)
    try {
      await fetch(`/api/admin/site-images/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...image, imageUrl: editUrl }),
      })
      await fetchImages()
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update image:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleInitAll() {
    setSaving(true)
    try {
      for (let i = 0; i < defaults.length; i++) {
        const d = defaults[i]
        await fetch('/api/admin/site-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: activeTab,
            key: d.key,
            label: d.label,
            imageUrl: d.imageUrl,
            link: d.link || null,
            sortOrder: i,
          }),
        })
      }
      await fetchImages()
    } catch (error) {
      console.error('Failed to init defaults:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return
    try {
      await fetch(`/api/admin/site-images/${id}`, { method: 'DELETE' })
      await fetchImages()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Site Images</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage all images used across the homepage sections. Changes reflect immediately on the storefront.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-lg bg-[var(--muted)] p-1 w-fit">
        {TABS.map((tab) => {
          const count = images.filter((i) => i.section === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditingId(null) }}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-white text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {tab.label} {count > 0 && <span className="text-[11px] opacity-60">({count})</span>}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-[var(--muted-foreground)]">Loading...</div>
      ) : sectionImages.length === 0 ? (
        /* Empty state — offer to initialize with defaults */
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white">
          <ImageIcon size={32} className="mb-3 text-[var(--muted-foreground)]" />
          <p className="mb-1 text-sm font-medium text-[var(--foreground)]">
            No images for &ldquo;{TABS.find((t) => t.key === activeTab)?.label}&rdquo;
          </p>
          <p className="mb-4 text-xs text-[var(--muted-foreground)]">
            Initialize with placeholder images, then replace with your own.
          </p>
          <button
            onClick={handleInitAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--warm-dark)] disabled:opacity-50"
          >
            <Plus size={14} />
            {saving ? 'Initializing...' : `Initialize ${defaults.length} Image${defaults.length > 1 ? 's' : ''}`}
          </button>
        </div>
      ) : (
        /* Image grid */
        <div className={cn(
          'grid gap-4',
          sectionImages.length === 1 ? 'max-w-xl' : 'sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {sectionImages.map((img) => {
            const isEditing = editingId === img.id
            return (
              <div key={img.id} className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
                {/* Image preview */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt={img.label} className="h-full w-full object-cover" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-[var(--foreground)]">{img.label}</h3>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{img.section} / {img.key}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Image URL"
                        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleSaveUrl(img)}
                          disabled={saving || !editUrl}
                          className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--warm-dark)] disabled:opacity-50"
                        >
                          <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{img.imageUrl}</p>
                      <button
                        onClick={() => { setEditingId(img.id); setEditUrl(img.imageUrl) }}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:text-[var(--warm-dark)]"
                      >
                        <Pencil size={12} /> Change Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
