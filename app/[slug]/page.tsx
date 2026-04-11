import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/sanity'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!client) return []
  const [testimonies, pages, studies] = await Promise.all([
    client.fetch(`*[_type == "testimony"]{"slug": slug.current}`),
    client.fetch(`*[_type == "page"]{"slug": slug.current}`),
    client.fetch(`*[_type == "bibleStudy"]{"slug": slug.current}`),
  ])
  return [...testimonies, ...pages, ...studies]
    .filter((d: any) => d.slug)
    .map((d: any) => ({ slug: d.slug }))
}

async function getDocument(slug: string) {
  if (!client) return null
  try {
    const testimony = await client.fetch(
      `*[_type == "testimony" && slug.current == $slug][0]{
        _id, title, slug, author, content, contentHtml, language, publishedDate, originalUrl
      }`, { slug }
    )
    if (testimony) return { ...testimony, _docType: 'testimony' }

    const page = await client.fetch(
      `*[_type == "page" && slug.current == $slug][0]{
        _id, title, slug, pageType, content, contentHtml, seoDescription, originalUrl
      }`, { slug }
    )
    if (page) return { ...page, _docType: 'page' }

    const bibleStudy = await client.fetch(
      `*[_type == "bibleStudy" && slug.current == $slug][0]{
        _id, title, slug, course, lessonNumber, content, contentHtml, originalUrl
      }`, { slug }
    )
    if (bibleStudy) return { ...bibleStudy, _docType: 'bibleStudy' }

    const sermon = await client.fetch(
      `*[_type == "sermon" && slug.current == $slug][0]{
        _id, title, slug, date, speaker, series, biblePassage, audioUrl, videoUrl, description, content, contentHtml, originalUrl
      }`, { slug }
    )
    if (sermon) return { ...sermon, _docType: 'sermon' }

    return null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await getDocument(slug)
  if (!doc) return { title: 'Not Found' }

  const description = doc.seoDescription
    || (doc._docType === 'testimony' ? `A personal testimony by ${doc.author || 'a member of LVBC'}` : '')
    || (doc._docType === 'sermon' ? `${doc.speaker ? `By ${doc.speaker}` : 'Sermon'} — ${doc.biblePassage || ''}` : '')
    || `${doc.title} — Lehigh Valley Baptist Church`

  const url = `https://lvbaptist.org/${slug}`
  const ogType = doc._docType === 'testimony' || doc._docType === 'sermon' ? 'article' : 'website'

  return {
    title: doc.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: doc.title,
      description,
      url,
      type: ogType,
      ...(doc.publishedDate && { publishedTime: doc.publishedDate }),
      ...(doc.author && { authors: [doc.author] }),
    },
    twitter: {
      card: 'summary',
      title: doc.title,
      description,
    },
  }
}

function renderContent(doc: any) {
  if (doc.contentHtml) {
    return (
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
      />
    )
  }

  const text = doc.content
  if (!text) return <p style={{ color: 'var(--text-muted)' }}>Content coming soon.</p>

  return (
    <div className="prose-content">
      {text.split('\n\n').map((paragraph: string, i: number) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return null
        return <p key={i}>{trimmed}</p>
      })}
    </div>
  )
}

function getJsonLd(doc: any) {
  if (doc._docType === 'testimony') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: doc.title,
      author: { '@type': 'Person', name: doc.author || 'Anonymous' },
      datePublished: doc.publishedDate || undefined,
      publisher: { '@type': 'Organization', name: 'Lehigh Valley Baptist Church' },
      url: `https://lvbaptist.org/${doc.slug?.current}`,
    }
  }
  if (doc._docType === 'sermon') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: doc.title,
      author: doc.speaker ? { '@type': 'Person', name: doc.speaker } : undefined,
      datePublished: doc.date || undefined,
      about: doc.biblePassage || undefined,
      url: `https://lvbaptist.org/sermons/${doc.slug?.current}`,
    }
  }
  return null
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const doc = await getDocument(slug)

  if (!doc) {
    notFound()
  }

  const jsonLd = getJsonLd(doc)

  if (doc._docType === 'testimony') {
    return (
      <>
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
        <div
          className="py-16 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-mint))' }}
        >
          <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Changed Lives</p>
          <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{doc.title}</h1>
          {doc.author && <p className="mt-3 opacity-90">By {doc.author}</p>}
        </div>
        <article className="max-w-3xl mx-auto px-4 py-16">
          <div className="glass rounded-2xl p-4 mb-8 flex items-center gap-3">
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
            {doc.language === 'es' && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>
                Español
              </span>
            )}
          </div>
          {renderContent(doc)}
        </article>
      </>
    )
  }

  if (doc._docType === 'sermon') {
    return (
      <>
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
        <div
          className="py-16 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-primary-light))' }}
        >
          <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Sermon</p>
          <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{doc.title}</h1>
          <div className="mt-3 opacity-90 space-x-3">
            {doc.speaker && <span>{doc.speaker}</span>}
            {doc.date && <span>· {new Date(doc.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          </div>
        </div>
        <article className="max-w-3xl mx-auto px-4 py-16">
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {doc.biblePassage && <div><strong>Scripture:</strong> {doc.biblePassage}</div>}
              {doc.series && <div><strong>Series:</strong> {doc.series}</div>}
            </div>
            {doc.audioUrl && (
              <div className="mt-4">
                <audio controls className="w-full" preload="none">
                  <source src={doc.audioUrl} />
                </audio>
              </div>
            )}
            {doc.videoUrl && (
              <div className="mt-4">
                <a
                  href={doc.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold"
                  style={{ background: 'var(--lvbc-accent)' }}
                >
                  Watch Video
                </a>
              </div>
            )}
          </div>
          {(doc.content || doc.description) && renderContent({ content: doc.content || doc.description })}
        </article>
      </>
    )
  }

  if (doc._docType === 'bibleStudy') {
    return (
      <>
        <div
          className="py-16 text-center text-white"
          style={{ background: 'linear-gradient(135deg, var(--lvbc-mint), var(--lvbc-primary))' }}
        >
          <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Bible Study</p>
          <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{doc.title}</h1>
          {doc.course && <p className="mt-3 opacity-90">{doc.course} Course</p>}
        </div>
        <article className="max-w-3xl mx-auto px-4 py-16">
          {renderContent(doc)}
          <div className="mt-8 text-center">
            <Link
              href="/free-bible-study-offer"
              className="inline-block px-6 py-3 rounded-full text-white font-semibold"
              style={{ background: 'var(--lvbc-mint)' }}
            >
              View All Bible Studies
            </Link>
          </div>
        </article>
      </>
    )
  }

  // Generic page
  return (
    <>
      <div
        className="py-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-primary-light))' }}
      >
        <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{doc.title}</h1>
      </div>
      <article className="max-w-3xl mx-auto px-4 py-16">
        {renderContent(doc)}
      </article>
    </>
  )
}
