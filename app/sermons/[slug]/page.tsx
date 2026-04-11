import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!client) return []
  const sermons = await client.fetch(`*[_type == "sermon"]{"slug": slug.current}`)
  return sermons.filter((s: any) => s.slug).map((s: any) => ({ slug: s.slug }))
}

async function getSermon(slug: string) {
  if (!client) return null
  try {
    return await client.fetch(
      `*[_type == "sermon" && slug.current == $slug][0]{
        _id, title, slug, date, speaker, series, topics, biblePassage,
        serviceType, audioUrl, videoUrl, description, content, contentHtml, originalUrl
      }`, { slug }
    )
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sermon = await getSermon(slug)
  if (!sermon) return { title: 'Sermon Not Found' }
  const desc = [sermon.speaker, sermon.biblePassage, sermon.series].filter(Boolean).join(' — ')
  const description = desc || 'Sermon from Lehigh Valley Baptist Church'
  const url = `https://lvbaptist.org/sermons/${slug}`
  return {
    title: sermon.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: sermon.title,
      description,
      url,
      type: 'article',
      ...(sermon.date && { publishedTime: sermon.date }),
      ...(sermon.speaker && { authors: [sermon.speaker] }),
    },
    twitter: {
      card: 'summary',
      title: sermon.title,
      description,
    },
  }
}

export default async function SermonPage({ params }: Props) {
  const { slug } = await params
  const sermon = await getSermon(slug)

  if (!sermon) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: sermon.title,
    author: sermon.speaker ? { '@type': 'Person', name: sermon.speaker } : undefined,
    datePublished: sermon.date || undefined,
    about: sermon.biblePassage || undefined,
    url: `https://lvbaptist.org/sermons/${slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="py-16 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-primary-light))' }}
      >
        <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Sermon</p>
        <h1 className="text-3xl md:text-4xl font-bold px-4 max-w-3xl mx-auto">{sermon.title}</h1>
        <div className="mt-3 opacity-90 flex items-center justify-center gap-3 flex-wrap">
          {sermon.speaker && <span>{sermon.speaker}</span>}
          {sermon.date && (
            <span>· {new Date(sermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          )}
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            {sermon.biblePassage && <div><strong>Scripture:</strong> {sermon.biblePassage}</div>}
            {sermon.series && <div><strong>Series:</strong> {sermon.series}</div>}
            {sermon.serviceType && <div><strong>Service:</strong> {sermon.serviceType}</div>}
          </div>

          {sermon.audioUrl && (
            <div className="mt-4">
              <audio controls className="w-full" preload="none">
                <source src={sermon.audioUrl} />
              </audio>
            </div>
          )}

          {sermon.videoUrl && (
            <div className="mt-4">
              <a
                href={sermon.videoUrl}
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

        {(sermon.contentHtml || sermon.content || sermon.description) && (
          sermon.contentHtml ? (
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: sermon.contentHtml }} />
          ) : (
            <div className="prose-content">
              {(sermon.content || sermon.description).split('\n\n').map((p: string, i: number) => {
                const trimmed = p.trim()
                if (!trimmed) return null
                return <p key={i}>{trimmed}</p>
              })}
            </div>
          )
        )}
      </article>
    </>
  )
}
