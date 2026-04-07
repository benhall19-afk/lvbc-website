import Link from 'next/link'
import { client } from '@/lib/sanity'

async function getFeaturedTestimonies() {
  if (!client) return []
  try {
    return await client.fetch(`*[_type == "testimony" && language != "es"] | order(publishedDate desc)[0...3]{ _id, title, slug, author }`)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const testimonies = await getFeaturedTestimonies()

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--lvbc-primary) 0%, var(--lvbc-primary-light) 50%, var(--lvbc-mint) 100%)' }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="glass rounded-3xl p-10 md:p-16 shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--lvbc-primary)' }}>
              Lehigh Valley Baptist Church
            </h1>
            <p className="text-lg md:text-2xl mb-8" style={{ color: 'var(--text-muted)' }}>
              A gospel-preaching, Bible-believing church serving the Lehigh Valley since 1956.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/new-to-lvbc"
                className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'var(--lvbc-accent)' }}
              >
                New Here? Start Here
              </Link>
              <Link
                href="/lvbc-live"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 glass border border-white/40"
                style={{ color: 'var(--lvbc-primary)' }}
              >
                Watch Live
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" style={{ fill: 'var(--bg)' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 px-4" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--lvbc-primary)' }}>
            Join Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { day: 'Sunday', times: ['9:45 AM Bible Study', '11:00 AM Morning Worship', '6:00 PM Evening Service'], icon: '☀️' },
              { day: 'Wednesday', times: ['7:00 PM Prayer & Bible Study'], icon: '📖' },
              { day: 'Online', times: ['Sermons streamed live', 'Archive available anytime'], icon: '📺' },
            ].map(({ day, times, icon }) => (
              <div key={day} className="glass rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--lvbc-primary)' }}>{day}</h3>
                <ul className="space-y-2">
                  {times.map(t => (
                    <li key={t} className="text-sm" style={{ color: 'var(--text-muted)' }}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonies */}
      {testimonies.length > 0 && (
        <section className="py-16 px-4" style={{ background: 'var(--bg-card)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3" style={{ color: 'var(--lvbc-primary)' }}>
              Changed Lives
            </h2>
            <p className="text-center mb-10" style={{ color: 'var(--text-muted)' }}>
              Real people. Real stories. Lives transformed by the gospel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonies.map((t: any) => (
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
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.title}</h3>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/changed-lives"
                className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{ background: 'var(--lvbc-mint)', color: 'white' }}
              >
                Read All Testimonies
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16 px-4" style={{ background: 'var(--lvbc-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Explore</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/service-archive', label: 'Sermon Archive', desc: '370+ messages' },
              { href: '/changed-lives', label: 'Changed Lives', desc: '130+ testimonies' },
              { href: '/free-bible-study-offer', label: 'Bible Study', desc: 'Free courses' },
              { href: '/know-god', label: 'Know God', desc: 'Gospel message' },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="glass rounded-xl p-5 text-center hover:scale-105 transition-transform block"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
