'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/about-us', label: 'About' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/service-archive', label: 'Sermons' },
  { href: '/changed-lives', label: 'Changed Lives' },
  { href: '/know-god', label: 'Know God' },
  { href: '/free-bible-study-offer', label: 'Bible Study' },
  { href: '/espanol-spanish', label: 'Español' },
  { href: '/contact-us', label: 'Contact' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span
          className="block w-6 h-0.5 rounded-full transition-all duration-300"
          style={{
            background: 'var(--lvbc-primary)',
            transform: open ? 'translateY(4px) rotate(45deg)' : 'none',
          }}
        />
        <span
          className="block w-6 h-0.5 rounded-full transition-all duration-300"
          style={{
            background: 'var(--lvbc-primary)',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block w-6 h-0.5 rounded-full transition-all duration-300"
          style={{
            background: 'var(--lvbc-primary)',
            transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none',
          }}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ top: '64px' }}
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav
            className="relative glass rounded-b-2xl mx-4 mt-2 p-6 shadow-xl"
            style={{ animation: 'slideDown 0.2s ease-out' }}
          >
            <ul className="space-y-1">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-3 px-4 rounded-xl text-base font-medium transition-colors"
                    style={{
                      color: pathname === href ? 'white' : 'var(--text)',
                      background: pathname === href ? 'var(--lvbc-primary)' : 'transparent',
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
