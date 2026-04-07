import { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Changed Lives',
  description: 'Personal testimonies of lives changed by the gospel of Jesus Christ at Lehigh Valley Baptist Church.',
}

async function getTestimonies() {
  if (!client) return []
  try {
    return await client.fetch(
      `*[_type == "testimony"] | order(publishedDate desc){
        _id, title, slug, author, language, publishedDate
      }`
    )
  } catch {
    return []
  }
}

export default async function ChangedLivesPage() {
  const testimonies = await getTestimonies()
  const english = testimonies.filter((t: any) => t.language !== 'es')
  const spanish = testimonies.filter((t: any) => t.language === 'es')

  return (
    <>
      <div
        className="py-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary), var(--lvbc-mint))' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Changed Lives</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto px-4">
          Real people. Real stories. {testimonies.length} lives transformed by the power of the gospel.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {testimonies.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <p className="text-lg">Testimonies coming soon — content migration in progress.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {english.map((t: any) => (
                <Link
                  key={t._id}
                  href={`/${t.slug.current}`}
                  className="glass rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'var(--lvbc-mint)' }}
                    >
                      {(t.author || t.title)?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                      {t.author || 'Anonymous'}
                    </span>
                  </div>
                  <h2 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>{t.title}</h2>
                </Link>
              ))}
            </div>

            {spanish.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--lvbc-primary)' }}>
                  Testimonios en Español
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spanish.map((t: any) => (
                    <Link
                      key={t._id}
                      href={`/${t.slug.current}`}
                      className="glass rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all block"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'var(--lvbc-accent)' }}
                        >
                          {(t.author || t.title)?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                          {t.author || 'Anonymous'}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>
                          ES
                        </span>
                      </div>
                      <h2 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text)' }}>{t.title}</h2>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
