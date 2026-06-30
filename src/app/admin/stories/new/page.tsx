'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, Save, Image, Tags, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface StoryFormData {
  title: string
  excerpt: string
  content: string
  coverImage: string
  tags: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  published: boolean
}

export default function NewStoryPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<StoryFormData>({
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      published: false,
    },
  })

  const excerptValue = watch('excerpt')

  const onSubmit = async (data: StoryFormData) => {
    setSubmitting(true)
    try {
      const tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage || null,
          tags,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          seoKeywords: data.seoKeywords || null,
          published: data.published,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to create story')
      }

      toast.success('Story created successfully!')
      router.push('/admin/stories')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create story')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/stories">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">New Story</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Create a new blog post or brand story.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title & Excerpt */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Content
              </h2>
              <div className="space-y-4">
                <Input
                  label="Title"
                  placeholder="Enter story title"
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />

                <div className="w-full">
                  <label
                    htmlFor="excerpt"
                    className="subheading mb-2 block text-[var(--muted-foreground)]"
                  >
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    rows={3}
                    maxLength={300}
                    placeholder="Brief summary of the story (max 300 characters)"
                    className="w-full resize-none border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20"
                    {...register('excerpt', {
                      required: 'Excerpt is required',
                      maxLength: { value: 300, message: 'Excerpt must be 300 characters or less' },
                    })}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    {errors.excerpt ? (
                      <p className="text-xs text-red-600">{errors.excerpt.message}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {excerptValue?.length || 0}/300
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Body
              </h2>
              <div className="w-full">
                <label className="subheading mb-2 block text-[var(--muted-foreground)]">
                  Content
                </label>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'Content is required' }}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write your story content here..."
                      error={errors.content?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Publish
              </h2>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--accent)]"
                  {...register('published')}
                />
                <span className="text-sm text-[var(--foreground)]">
                  Publish this story
                </span>
              </label>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Draft stories are only visible to admins.
              </p>

              <div className="mt-4">
                <Button
                  type="submit"
                  icon={Save}
                  size="sm"
                  loading={submitting}
                  className="w-full"
                >
                  {submitting ? 'Creating...' : 'Create Story'}
                </Button>
              </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <Image size={14} strokeWidth={1.5} />
                Cover Image
              </h2>
              <Input
                placeholder="https://example.com/image.jpg"
                inputSize="sm"
                {...register('coverImage')}
              />
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                Enter the URL of the cover image.
              </p>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <Tags size={14} strokeWidth={1.5} />
                Tags
              </h2>
              <Input
                placeholder="fashion, streetwear, summer"
                inputSize="sm"
                {...register('tags')}
              />
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                Separate tags with commas.
              </p>
            </div>

            {/* SEO */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <Globe size={14} strokeWidth={1.5} />
                SEO
              </h2>
              <div className="space-y-4">
                <Input
                  label="SEO Title"
                  placeholder="Custom title for search engines"
                  inputSize="sm"
                  {...register('seoTitle')}
                />

                <div className="w-full">
                  <label
                    htmlFor="seoDescription"
                    className="subheading mb-2 block text-[var(--muted-foreground)]"
                  >
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={3}
                    placeholder="Meta description for search engines"
                    className="w-full resize-none border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20"
                    {...register('seoDescription')}
                  />
                </div>

                <Input
                  label="SEO Keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  inputSize="sm"
                  {...register('seoKeywords')}
                />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Separate keywords with commas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
