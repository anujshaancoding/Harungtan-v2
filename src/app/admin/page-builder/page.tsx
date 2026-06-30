'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'

interface Section {
  id: string
  type: string
  title: string | null
  sortOrder: number
  active: boolean
}

function SortableSectionCard({ section, onToggle }: { section: Section; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const typeLabels: Record<string, string> = {
    hero: 'Hero Banner',
    categories: 'Category Grid',
    editorial: 'Editorial Section',
    featured: 'Featured Products',
    bestsellers: 'Bestsellers',
    testimonials: 'Testimonials',
    instagram: 'Instagram Feed',
    recently_viewed: 'Recently Viewed',
    newsletter: 'Newsletter Signup',
    new_arrivals: 'New Arrivals',
    recommendations: 'AI Recommendations',
    flash_sale: 'Flash Sale Banner',
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderColor: 'var(--border)' }}
      className={cn(
        'flex items-center gap-4 border bg-white p-4 transition-shadow hover:shadow-sm',
        !section.active && 'opacity-50'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <GripVertical size={18} strokeWidth={1.5} />
      </button>

      <div className="flex-1">
        <p className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
          {typeLabels[section.type] || section.type}
        </p>
        {section.title && (
          <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
            {section.title}
          </p>
        )}
      </div>

      <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
        #{section.sortOrder}
      </span>

      <button
        onClick={() => onToggle(section.id)}
        className="p-2 transition-colors"
        style={{ color: section.active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
        title={section.active ? 'Hide section' : 'Show section'}
      >
        {section.active ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
      </button>
    </div>
  )
}

export default function PageBuilderPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/home-sections')
      if (res.ok) {
        const data = await res.json()
        let sects = data.sections || []

        // If no sections exist, create defaults
        if (sects.length === 0) {
          const defaults = [
            { type: 'hero', title: 'Hero Banner' },
            { type: 'categories', title: 'Shop by Category' },
            { type: 'editorial', title: 'Editorial' },
            { type: 'featured', title: 'Featured Products' },
            { type: 'bestsellers', title: 'Bestsellers' },
            { type: 'testimonials', title: 'Customer Reviews' },
            { type: 'instagram', title: 'Instagram' },
            { type: 'recently_viewed', title: 'Recently Viewed' },
            { type: 'newsletter', title: 'Newsletter' },
          ]

          for (let i = 0; i < defaults.length; i++) {
            await fetch('/api/admin/home-sections', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...defaults[i], config: {} }),
            })
          }
          // Re-fetch
          const res2 = await fetch('/api/admin/home-sections')
          if (res2.ok) {
            const data2 = await res2.json()
            sects = data2.sections || []
          }
        }

        setSections(sects)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSections((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleToggle = (id: string) => {
    setSections((items) =>
      items.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = sections.map((s, i) => ({
        id: s.id,
        sortOrder: i + 1,
        active: s.active,
      }))

      const res = await fetch('/api/admin/home-sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updates }),
      })

      if (res.ok) {
        showToast.success('Page layout saved')
      } else {
        showToast.error('Failed to save')
      }
    } catch {
      showToast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-editorial text-2xl" style={{ color: 'var(--foreground)' }}>Page Builder</h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
            Drag to reorder home page sections. Toggle visibility with the eye icon.
          </p>
          <div className="divider-accent mt-3" />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase disabled:opacity-50"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
        >
          {saving ? 'Saving...' : 'Save Layout'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sections.map((section) => (
                <SortableSectionCard key={section.id} section={section} onToggle={handleToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
