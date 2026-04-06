import type { Metadata } from 'next'
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
