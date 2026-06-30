import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ChevronLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate, parseJsonField } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Stories - Fashion Tips, Style Guides & Behind the Scenes',
  description:
    'Explore Harungtan Stories — style guides, fashion tips, behind-the-scenes looks, and the latest trends in premium t-shirt fashion.',
  openGraph: {
    title: 'Stories | Harungtan',
    description: 'Style guides, fashion tips, and brand stories from Harungtan.',
    type: 'website',
  },
}

const POSTS_PER_PAGE = 9

interface Props {
  searchParams: Promise<{ page?: string; tag?: string }>
}

export default async function StoriesPage({ searchParams }: Props) {
  const { page: pageParam, tag } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))

  // Build where clause
  const where: Record<string, unknown> = { published: true }
  if (tag) {
    where.tags = { contains: tag }
  }

  // Fetch posts and count in parallel
  const [posts, totalCount, allPublishedPosts] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
    prisma.post.findMany({
      where: { published: true },
      select: { tags: true },
    }),
  ])

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  // Extract unique tags from all published posts
  const allTags = Array.from(
    new Set(
      allPublishedPosts.flatMap((post) => parseJsonField(post.tags))
    )
  ).sort()

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Harungtan Stories',
    description:
      'Style guides, fashion tips, behind-the-scenes looks, and the latest trends in premium t-shirt fashion.',
    url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/stories`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Harungtan',
      url: process.env.NEXT_PUBLIC_APP_URL || '',
    },
    mainEntity: {
      '@type': 'Blog',
      name: 'Harungtan Stories',
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/stories/${post.slug}`,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        image: post.coverImage || undefined,
        author: {
          '@type': 'Person',
          name: post.author.name || 'Harungtan',
        },
      })),
    },
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
              Home
            </Link>
            <ChevronRight size={14} strokeWidth={1.5} />
            <span className="font-medium text-[var(--foreground)]">Stories</span>
          </nav>

          <div className="max-w-2xl">
            <p className="subheading mb-4">The Journal</p>
            <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl text-[var(--foreground)]">
              Stories
            </h1>
            <div className="divider-accent mt-6" />
            <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)]">
              Style guides, fashion insights, and behind-the-scenes glimpses into the world of Harungtan.
              Explore the stories behind the brand.
            </p>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
                Filter:
              </span>
              <Link
                href="/stories"
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all ${
                  !tag
                    ? 'bg-[var(--foreground)] text-white'
                    : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                All
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/stories?tag=${encodeURIComponent(t)}`}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all ${
                    tag === t
                      ? 'bg-[var(--foreground)] text-white'
                      : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stories Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {posts.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const tags = parseJsonField(post.tags)
                return (
                  <article
                    key={post.id}
                    className="group border border-[var(--border)] bg-white transition-all hover-lift"
                  >
                    {/* Cover Image */}
                    <Link href={`/stories/${post.slug}`} className="block">
                      <div className="image-reveal aspect-[16/10] w-full overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={600}
                            height={375}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--muted)] via-[var(--border)] to-[var(--muted)]">
                            <span className="text-3xl font-bold tracking-widest text-[var(--muted-foreground)]/30">
                              H
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {tags.slice(0, 3).map((t) => (
                            <Link
                              key={t}
                              href={`/stories?tag=${encodeURIComponent(t)}`}
                              className="text-[10px] font-medium uppercase tracking-widest text-[var(--accent)] transition-colors hover:text-[var(--warm-dark)]"
                            >
                              {t}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <Link href={`/stories/${post.slug}`}>
                        <h2 className="heading-editorial text-xl leading-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} strokeWidth={1.5} />
                            {formatDate(post.createdAt)}
                          </span>
                          {post.readTime > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} strokeWidth={1.5} />
                              {post.readTime} min read
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/stories/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                        >
                          Read
                          <ArrowRight size={12} strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Stories pagination"
                className="mt-16 flex items-center justify-center gap-1"
              >
                {currentPage > 1 && (
                  <Link
                    href={`/stories?page=${currentPage - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/stories?page=${p}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className={`inline-flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                    }`}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/stories?page=${currentPage + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center bg-[var(--muted)]">
              <Calendar size={32} strokeWidth={1} className="text-[var(--muted-foreground)]" />
            </div>
            <h2 className="heading-editorial text-2xl text-[var(--foreground)]">
              {tag ? 'No stories found' : 'Coming Soon'}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
              {tag
                ? `No stories tagged with "${tag}" yet. Try a different tag or browse all stories.`
                : 'We are working on our first stories. Check back soon for style guides, fashion tips, and behind-the-scenes content.'}
            </p>
            {tag && (
              <Link
                href="/stories"
                className="btn-outline mt-6 inline-flex items-center"
              >
                View All Stories
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
