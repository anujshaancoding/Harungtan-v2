import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, Calendar, ArrowLeft, ArrowRight, User } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate, parseJsonField } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      createdAt: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
    },
  })

  if (!post) {
    return { title: 'Story Not Found | Harungtan' }
  }

  const tags = parseJsonField(post.tags)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  return {
    title: post.seoTitle || `${post.title} | Harungtan Stories`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || tags.join(', '),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      tags,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : undefined,
      url: `${appUrl}/stories/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

function renderContent(content: string) {
  // Content is stored as HTML from the rich text editor
  const hasHtml = /<[a-z][\s\S]*>/i.test(content)

  if (hasHtml) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  // Fallback for plain text content (legacy posts)
  const blocks = content.split(/\n\n+/)
  return blocks.map((block, index) => {
    const trimmed = block.trim()
    if (!trimmed) return null
    const lines = trimmed.split('\n')
    return (
      <p key={index}>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    )
  })
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, image: true, role: true } },
    },
  })

  if (!post) {
    notFound()
  }

  const tags = parseJsonField(post.tags)

  // Fetch related posts (same tags, exclude current)
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Sort by tag relevance: posts sharing more tags come first
  const scoredRelated = relatedPosts
    .map((rp) => {
      const rpTags = parseJsonField(rp.tags)
      const sharedTags = rpTags.filter((t) => tags.includes(t)).length
      return { ...rp, score: sharedTags }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${appUrl}/stories/${post.slug}`,
    author: {
      '@type': 'Person',
      name: post.author.name || 'Harungtan',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Harungtan',
      url: appUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${appUrl}/stories/${post.slug}`,
    },
    keywords: post.seoKeywords || tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
              Home
            </Link>
            <ChevronRight size={14} strokeWidth={1.5} />
            <Link href="/stories" className="hover-underline transition-colors hover:text-[var(--foreground)]">
              Stories
            </Link>
            <ChevronRight size={14} strokeWidth={1.5} />
            <span className="font-medium text-[var(--foreground)] line-clamp-1">{post.title}</span>
          </nav>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-3">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/stories?tag=${encodeURIComponent(t)}`}
                  className="text-[11px] font-medium uppercase tracking-widest text-[var(--accent)] transition-colors hover:text-[var(--warm-dark)]"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="heading-editorial text-3xl sm:text-4xl lg:text-5xl text-[var(--foreground)]">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted-foreground)]">
            {post.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-6">
            <div className="flex items-center gap-3">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center bg-[var(--muted)] rounded-full">
                  <User size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {post.author.name || 'Harungtan'}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {post.author.role === 'admin' ? 'Editor' : 'Contributor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} strokeWidth={1.5} />
                {formatDate(post.createdAt)}
              </span>
              {post.readTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} strokeWidth={1.5} />
                  {post.readTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-0 aspect-[21/9] w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="prose max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Tags at bottom */}
        {tags.length > 0 && (
          <div className="mt-12 border-t border-[var(--border)] pt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Tagged in
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/stories?tag=${encodeURIComponent(t)}`}
                  className="inline-flex items-center border border-[var(--border)] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Author Card */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5 border border-[var(--border)] bg-white p-6 sm:p-8">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name || 'Author'}
                width={64}
                height={64}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center bg-[var(--muted)] rounded-full">
                <User size={24} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
                Written by
              </p>
              <p className="mt-1 font-display text-lg text-[var(--foreground)]">
                {post.author.name || 'Harungtan'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Sharing stories about fashion, style, and the craftsmanship behind every Harungtan piece.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      {scoredRelated.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--muted)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-10 text-center">
              <p className="subheading mb-3">Keep Reading</p>
              <h2 className="heading-editorial text-2xl sm:text-3xl text-[var(--foreground)]">
                Related Stories
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {scoredRelated.map((relatedPost) => {
                const relatedTags = parseJsonField(relatedPost.tags)
                return (
                  <article
                    key={relatedPost.id}
                    className="group border border-[var(--border)] bg-white transition-all hover-lift"
                  >
                    <Link href={`/stories/${relatedPost.slug}`} className="block">
                      <div className="image-reveal aspect-[16/10] w-full overflow-hidden">
                        {relatedPost.coverImage ? (
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            width={400}
                            height={250}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--muted)] via-[var(--border)] to-[var(--muted)]">
                            <span className="text-2xl font-bold tracking-widest text-[var(--muted-foreground)]/30">
                              H
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-5">
                      {relatedTags.length > 0 && (
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-[var(--accent)]">
                          {relatedTags[0]}
                        </p>
                      )}
                      <Link href={`/stories/${relatedPost.slug}`}>
                        <h3 className="heading-editorial text-lg leading-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span>{formatDate(relatedPost.createdAt)}</span>
                        {relatedPost.readTime > 0 && (
                          <span>{relatedPost.readTime} min read</span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Back to Stories */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              All Stories
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            >
              Shop Now
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
