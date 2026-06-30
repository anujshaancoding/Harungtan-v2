'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, GripVertical, ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string
  index: number
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="group relative aspect-square overflow-hidden border border-[var(--border)] bg-[var(--muted)]"
    >
      <Image
        src={url}
        alt={`Upload ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1.5 cursor-grab rounded bg-white/90 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
      </button>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 rounded bg-white/90 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-50"
        aria-label="Remove image"
      >
        <X size={14} strokeWidth={1.5} className="text-[var(--muted-foreground)] hover:text-red-600" />
      </button>

      {/* Index badge */}
      {index === 0 && (
        <span className="absolute bottom-1.5 left-1.5 bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Main
        </span>
      )}
    </motion.div>
  )
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const remaining = maxImages - images.length
      if (remaining <= 0) return

      const fileArray = Array.from(files).slice(0, remaining)

      fileArray.forEach((file) => {
        if (!file.type.startsWith('image/')) return
        if (file.size > 5 * 1024 * 1024) return // 5MB limit

        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            onChange([...images, result])
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [images, maxImages, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleRemove = useCallback(
    (index: number) => {
      const next = images.filter((_, i) => i !== index)
      onChange(next)
    },
    [images, onChange]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = images.indexOf(active.id as string)
      const newIndex = images.indexOf(over.id as string)
      onChange(arrayMove(images, oldIndex, newIndex))
    },
    [images, onChange]
  )

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {canAddMore && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-8 transition-colors ${
            isDragOver
              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-[var(--border)] bg-[var(--muted)] hover:border-[var(--foreground)]/30'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center border border-[var(--border)] bg-[var(--background)]">
            {isDragOver ? (
              <ImageIcon size={24} strokeWidth={1.5} className="text-[var(--accent)]" />
            ) : (
              <Upload size={24} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Drop images here or click to browse
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              PNG, JPG, WebP up to 5MB each
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Image count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--muted-foreground)]">
          {images.length}/{maxImages} images
        </p>
        {images.length > 0 && (
          <p className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
            Drag to reorder &middot; First image is the main photo
          </p>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {images.map((url, index) => (
                  <SortableImage
                    key={url}
                    url={url}
                    index={index}
                    onRemove={() => handleRemove(index)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
