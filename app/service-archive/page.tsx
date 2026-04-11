import { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Sermon Archive',
  description: 'Browse our complete archive of sermons and messages from Lehigh Valley Baptist Church.',
  alternates: { canonical: 'https://lvbaptist.org/service-archive' },
  openGraph: {
    title: 'Sermon Archive | Lehigh Valley Baptist Church',
    description: 'Browse our complete archive of sermons and messages from Lehigh Valley Baptist Church.',
    url: 'https://lvbaptist.org/service-archive',
  },
  twitter: {
    card: 'summary',
    title: 'Sermon Archive | Lehigh Valley Baptist Church',
    description: 'Browse our complete archive of sermons and messages.',
  },
}

async function getSermons() {
  if (!client) return []
  try {
    return await client.fetch(
      `*[_type == "sermon"] | order(date desc){
        _id, title, slug, date, speaker, series, biblePassage, audioUrl
      }`
    )
  } catch {
    return []
  }
}

export default async function ServiceArchivePage() {
  const sermons = await getSermons()

  return (
    <>
      <div
        className="py-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-primary-light))' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermon Archive</h1>
        <p className="text-lg opacity-90">{sermons.length}+ messages from Lehigh Valley Baptist Church</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {sermons.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p className="text-lg">Sermons coming soon — content migration in progress.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sermons.map((s: any) => (
              <Link
                key={s._id}
                href={`/sermons/${s.slug.current}`}
                className="glass rounded-xl p-5 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{s.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {s.date && (
                        <span>
                          {new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                      {s.speaker && <span>· {s.speaker}</span>}
                      {s.biblePassage && <span>· {s.biblePassage}</span>}
                    </div>
                    {s.series && (
                      <span
                        className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#eff6ff', color: 'var(--lvbc-primary)' }}
                      >
                        {s.series}
                      </span>
                    )}
                  </div>
                  {s.audioUrl && (
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ background: 'var(--lvbc-accent)' }}
                      aria-label="Has audio"
                    >
                      ▶
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
