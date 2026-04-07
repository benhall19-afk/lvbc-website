import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lehigh Valley Baptist Church',
    template: '%s | Lehigh Valley Baptist Church',
  },
  description: 'A gospel-preaching, Bible-believing church in the Lehigh Valley, Pennsylvania.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lvbaptist.org',
    siteName: 'Lehigh Valley Baptist Church',
  },
}

function Header() {
  return (
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
  )
}

function Footer() {
  return (
    <footer className="py-12 px-4 text-sm" style={{ background: '#0f2035', color: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <p className="font-semibold text-white">Lehigh Valley Baptist Church</p>
        <p>4100 Dorney Park Road, Allentown, PA 18104</p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/about-us" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/service-archive" className="hover:text-white transition-colors">Sermons</Link>
          <Link href="/changed-lives" className="hover:text-white transition-colors">Changed Lives</Link>
          <Link href="/espanol-spanish" className="hover:text-white transition-colors">Español</Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} Lehigh Valley Baptist Church. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
