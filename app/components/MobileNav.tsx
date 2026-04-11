'use client'

import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/about-us', label: 'About' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/service-archive', label: 'Sermons' },
  { href: '/changed-lives', label: 'Changed Lives' },
  { href: '/know-god', label: 'Know God' },
  { href: '/contact-us', label: 'Contact' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span
          className="block w-5 h-0.5 transition-all duration-300 origin-center"
          style={{
            background: 'var(--lvbc-primary)',
            transform: open ? 'rotate(45deg) translate(2px, 2px)' : 'none',
          }}
        />
        <span
          className="block w-5 h-0.5 transition-all duration-300"
          style={{
            background: 'var(--lvbc-primary)',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block w-5 h-0.5 transition-all duration-300 origin-center"
          style={{
            background: 'var(--lvbc-primary)',
            transform: open ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
          }}
        />
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 glass border-b border-white/20 md:hidden z-40">
          <nav className="flex flex-col py-4 px-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-white/10 last:border-0 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
