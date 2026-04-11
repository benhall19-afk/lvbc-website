import type { Metadata } from 'next'
import Link from 'next/link'
import MobileNav from './components/MobileNav'
import GoogleAnalytics from './components/GoogleAnalytics'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://lvbaptist.org'),
  title: {
    default: 'Lehigh Valley Baptist Church',
    template: '%s | Lehigh Valley Baptist Church',
  },
  description: 'A gospel-preaching, Bible-believing church in the Lehigh Valley, Pennsylvania, serving the community since 1956.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lvbaptist.org',
    siteName: 'Lehigh Valley Baptist Church',
    title: 'Lehigh Valley Baptist Church',
    description: 'A gospel-preaching, Bible-believing church in the Lehigh Valley, Pennsylvania, serving the community since 1956.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lehigh Valley Baptist Church',
    description: 'A gospel-preaching, Bible-believing church in the Lehigh Valley, Pennsylvania.',
  },
  alternates: {
    canonical: 'https://lvbaptist.org',
  },
}

function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-sm focus:font-semibold" style={{ color: 'var(--lvbc-primary)' }}>
        Skip to content
      </a>
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
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
        <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          <Link href="/about-us" className="hover:text-lvbc-primary transition-colors">About</Link>
          <Link href="/ministries" className="hover:text-lvbc-primary transition-colors">Ministries</Link>
          <Link href="/service-archive" className="hover:text-lvbc-primary transition-colors">Sermons</Link>
          <Link href="/changed-lives" className="hover:text-lvbc-primary transition-colors">Changed Lives</Link>
          <Link href="/know-god" className="hover:text-lvbc-primary transition-colors">Know God</Link>
          <Link
            href="/contact-us"
            className="px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--lvbc-accent)' }}
          >
            Contact
          </Link>
        </div>
        <MobileNav />
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

const churchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'Lehigh Valley Baptist Church',
  url: 'https://lvbaptist.org',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4100 Dorney Park Road',
    addressLocality: 'Allentown',
    addressRegion: 'PA',
    postalCode: '18104',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.5737,
    longitude: -75.5349,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:45', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '19:00', closes: '20:30' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
