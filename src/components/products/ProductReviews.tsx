'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { Review } from '@/types'

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  productId: string
  isLoggedIn?: boolean
}

const REVIEWS_PER_PAGE = 5

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span
        className="w-6 text-right font-medium"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {star}
      </span>
      <Star size={10} strokeWidth={1.5} className="fill-amber-400 text-amber-400" />
      <div
        className="h-[3px] flex-1 overflow-hidden"
        style={{ backgroundColor: 'var(--border)' }}
      >
        <div
          className="h-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: 'var(--accent)' }}
        />
      </div>
      <span
        className="w-6 text-right"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {count}
      </span>
    </div>
  )
}

function ReviewStarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i + 1)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i + 1)}
          className="p-0.5"
        >
          <Star
            size={20}
            strokeWidth={1.5}
            className={cn(
              'transition-colors',
              (hover || value) > i
                ? 'fill-amber-400 text-amber-400'
                : 'text-[var(--border)]'
            )}
            style={(hover || value) <= i ? { fill: 'var(--border)' } : undefined}
          />
        </button>
      ))}
    </div>
  )
}

export function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  productId,
  isLoggedIn = false,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [formRating, setFormRating] = useState(0)
  const [formTitle, setFormTitle] = useState('')
  const [formComment, setFormComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  const paginatedReviews = reviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  )

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.floor(r.rating) === star).length
  )

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        strokeWidth={1.5}
        className={cn(
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-[var(--border)]'
        )}
        style={i >= Math.floor(rating) ? { fill: 'var(--border)' } : undefined}
      />
    ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formRating === 0) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: formRating,
          title: formTitle || null,
          comment: formComment || null,
        }),
      })

      if (res.ok) {
        setShowForm(false)
        setFormRating(0)
        setFormTitle('')
        setFormComment('')
        // Ideally refresh reviews via revalidation
        window.location.reload()
      }
    } catch {
      // Handle error silently
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      className="mt-12 border-t pt-12 lg:mt-16 lg:pt-16"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Section label */}
      <p
        className="subheading mb-3 text-[11px] font-medium tracking-[0.2em] uppercase"
        style={{ color: 'var(--accent)' }}
      >
        What Our Customers Say
      </p>
      <h2
        className="heading-editorial mb-10 text-xl font-normal sm:text-2xl lg:text-[1.75rem]"
        style={{ color: 'var(--foreground)' }}
      >
        Customer Reviews
      </h2>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        {/* Summary */}
        <div>
          <div className="mb-6 text-center lg:text-left">
            <div
              className="heading-editorial mb-1 text-5xl font-normal"
              style={{ color: 'var(--foreground)' }}
            >
              {averageRating.toFixed(1)}
            </div>
            <div className="mb-2 flex items-center justify-center gap-0.5 lg:justify-start">
              {renderStars(averageRating)}
            </div>
            <p
              className="text-[11px] tracking-wide"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Based on {totalReviews} review{totalReviews !== 1 && 's'}
            </p>
          </div>

          {/* Rating breakdown - clean thin bars */}
          <div className="mb-6 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star, idx) => (
              <RatingBar
                key={star}
                star={star}
                count={ratingCounts[idx]}
                total={totalReviews}
              />
            ))}
          </div>

          {/* Write review button */}
          {isLoggedIn ? (
            <button
              className="btn-accent w-full h-10 text-[13px] font-medium tracking-[0.1em] uppercase border transition-all"
              style={{
                borderColor: 'var(--foreground)',
                backgroundColor: showForm ? 'var(--foreground)' : 'transparent',
                color: showForm ? 'var(--background)' : 'var(--foreground)',
              }}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          ) : (
            <p
              className="text-center text-[11px] tracking-wide lg:text-left"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <a
                href="/login"
                className="hover-underline font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                Sign in
              </a>{' '}
              to write a review
            </p>
          )}
        </div>

        {/* Reviews list */}
        <div>
          {/* Review form */}
          {showForm && isLoggedIn && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 border p-6"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
            >
              <h3
                className="mb-5 text-[13px] font-medium tracking-[0.1em] uppercase"
                style={{ color: 'var(--foreground)' }}
              >
                Write Your Review
              </h3>

              <div className="mb-5">
                <label
                  className="mb-2 block text-[11px] font-medium tracking-[0.15em] uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Rating *
                </label>
                <ReviewStarInput value={formRating} onChange={setFormRating} />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="review-title"
                  className="mb-2 block text-[11px] font-medium tracking-[0.15em] uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Title (optional)
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full border px-4 py-2.5 text-[13px] focus:outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-[11px] font-medium tracking-[0.15em] uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Review (optional)
                </label>
                <textarea
                  id="review-comment"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  rows={4}
                  placeholder="Share your thoughts about this product..."
                  className="w-full resize-none border px-4 py-2.5 text-[13px] focus:outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={formRating === 0}
                className="btn-primary h-10 px-6 text-[13px] font-medium tracking-[0.1em] uppercase transition-all disabled:opacity-40"
                style={{
                  backgroundColor: 'var(--foreground)',
                  color: 'var(--background)',
                  border: 'none',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Review items */}
          {paginatedReviews.length > 0 ? (
            <div>
              {paginatedReviews.map((review, idx) => (
                <div
                  key={review.id}
                  className={cn(
                    'py-6',
                    idx !== 0 && 'border-t'
                  )}
                  style={idx !== 0 ? { borderColor: 'var(--border)' } : undefined}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1.5 flex items-center gap-2.5">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        {review.verified && (
                          <span
                            className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                            style={{
                              backgroundColor: 'var(--muted)',
                              color: 'var(--accent)',
                            }}
                          >
                            Verified
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4
                          className="text-[13px] font-medium"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {review.title}
                        </h4>
                      )}
                    </div>
                    <span
                      className="text-[11px] tracking-wide"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {review.comment && (
                    <p
                      className="mb-3 text-[13px] leading-[1.8]"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {review.comment}
                    </p>
                  )}

                  <p
                    className="text-[11px] font-medium tracking-wide uppercase"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {review.user.name || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p
                className="text-[13px] tracking-wide"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No reviews yet. Be the first to review this product.
              </p>
            </div>
          )}

          {/* Pagination - sharp edges */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center border transition-colors disabled:opacity-30"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className="flex h-9 w-9 items-center justify-center text-[13px] font-medium transition-all"
                  style={{
                    border: page === i + 1 ? 'none' : '1px solid var(--border)',
                    backgroundColor: page === i + 1 ? 'var(--foreground)' : 'transparent',
                    color: page === i + 1 ? 'var(--background)' : 'var(--foreground)',
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center border transition-colors disabled:opacity-30"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
