'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/types'

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
}

export default function AdminStoriesPage() {
  const [data, setData] = useState<PostsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/posts?${params}`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      const json: PostsResponse = await res.json()
      setData(json)
    } catch {
      toast.error('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      toast.success('Story deleted successfully')
      fetchPosts()
    } catch {
      toast.error('Failed to delete story')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">Stories</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your blog posts and brand stories.
          </p>
        </div>
        <Link href="/admin/stories/new">
          <Button icon={Plus} size="sm">
            New Story
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-sm">
        <Input
          type="search"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputSize="sm"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : !data || data.posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-foreground)]">
            <FileText size={40} strokeWidth={1} className="mb-3 opacity-50" />
            <p className="text-sm">
              {search ? 'No stories match your search.' : 'No stories yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Title</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="hidden px-4 py-3 font-medium text-[var(--muted-foreground)] md:table-cell">
                    Read Time
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-[var(--muted-foreground)] sm:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--muted)]/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{post.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.published
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--muted-foreground)] md:table-cell">
                      {post.readTime} min read
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--muted-foreground)] sm:table-cell">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/stories/${post.id}/edit`}>
                          <Button variant="ghost" size="sm" icon={Pencil}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          loading={deletingId === post.id}
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing {(data.page - 1) * 10 + 1} to{' '}
            {Math.min(data.page * 10, data.total)} of {data.total} stories
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-2 text-sm text-[var(--muted-foreground)]">
              Page {data.page} of {data.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              iconRight={ChevronRight}
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
