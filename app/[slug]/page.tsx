import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, testimonyQuery, pageQuery } from '@/lib/sanity'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await getDocument(slug)
  if (!doc) return { title: 'Not Found' }
  return {
    title: doc.title,
    description: doc.author ? `A testimony by ${doc.author}` : doc.seoDescription || '',
  }
}

async function getDocument(slug: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  try {
    // Try testimony first (most common short-slug content)
    const testimony = await client.fetch(testimonyQuery, { slug })
    if (testimony) return { ...testimony, _docType: 'testimony' }

    // Fall back to generic page
    const page = await client.fetch(pageQuery, { slug })
    if (page) return { ...page, _docType: 'page' }

    return null
  } catch {
    return null
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const doc = await getDocument(slug)

  if (!doc) {
    // During migration, show a placeholder instead of 404
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--lvbc-primary)' }}>
              Content Migration in Progress
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              This page will be available once content is imported from lvbaptist.org.
            </p>
          </div>
        </div>
      )
    }
    notFound()
  }

  const isTestimony = doc._docType === 'testimony'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="py-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-mint))' }}
      >
        {isTestimony && (
          <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Changed Lives</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{doc.title}</h1>
        {doc.author && (
          <p className="mt-3 opacity-90">By {doc.author}</p>
        )}
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        {isTestimony && (
          <div className="glass rounded-2xl p-2 mb-8 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--lvbc-mint)' }}
            >
              {(doc.author || doc.title)?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{doc.author || 'Anonymous'}</p>
              {doc.publishedDate && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(doc.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Text content — word-for-word for testimonies */}
        <div
          className="prose prose-lg max-w-none leading-relaxed"
          style={{ color: 'var(--text)', fontFamily: 'Georgia, serif' }}
        >
          {doc.content?.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}
