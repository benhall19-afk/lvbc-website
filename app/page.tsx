import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--lvbc-primary)' }}
            >
              LVBC
            </div>
            <span className="font-semibold text-sm hidden sm:block" style={{ color: 'var(--lvbc-primary)' }}>
              Lehigh Valley Baptist Church
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            <Link href="/about-us" className="hover:text-lvbc-primary transition-colors hidden md:block">About</Link>
            <Link href="/ministries" className="hover:text-lvbc-primary transition-colors hidden md:block">Ministries</Link>
            <Link href="/service-archive" className="hover:text-lvbc-primary transition-colors hidden md:block">Sermons</Link>
            <Link href="/changed-lives" className="hover:text-lvbc-primary transition-colors hidden md:block">Changed Lives</Link>
            <Link href="/know-god" className="hover:text-lvbc-primary transition-colors hidden md:block">Know God</Link>
            <Link
              href="/contact-us"
              className="px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--lvbc-accent)' }}
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--lvbc-primary) 0%, var(--lvbc-primary-light) 50%, var(--lvbc-mint) 100%)' }}
        >
          {/* Glass overlay card */}
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

        {/* Quick Links */}
        <section className="py-16 px-4" style={{ background: 'var(--lvbc-primary)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Explore</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/service-archive', label: 'Sermon Archive', desc: '400+ messages' },
                { href: '/changed-lives', label: 'Changed Lives', desc: 'Testimonies' },
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
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 text-sm" style={{ background: '#0f2035', color: 'rgba(255,255,255,0.7)' }}>
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="font-semibold text-white">Lehigh Valley Baptist Church</p>
          <p>Allentown, PA · lvbaptist.org</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link href="/about-us" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/espanol-spanish" className="hover:text-white transition-colors">Español</Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Lehigh Valley Baptist Church. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
