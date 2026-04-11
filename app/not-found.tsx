import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div
          className="text-8xl font-bold mb-4"
          style={{ color: 'var(--lvbc-mint)', opacity: 0.3 }}
        >
          404
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--lvbc-primary)' }}>
          Page Not Found
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved during our website rebuild.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--lvbc-primary)' }}
          >
            Go Home
          </Link>
          <Link
            href="/changed-lives"
            className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 glass"
            style={{ color: 'var(--lvbc-primary)' }}
          >
            Read Testimonies
          </Link>
          <Link
            href="/service-archive"
            className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 glass"
            style={{ color: 'var(--lvbc-primary)' }}
          >
            Browse Sermons
          </Link>
        </div>
      </div>
    </div>
  )
}
