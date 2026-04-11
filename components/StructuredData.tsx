export function ChurchJsonLd() {
  const data = {
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
    description: 'A gospel-preaching, Bible-believing church in the Lehigh Valley, Pennsylvania, serving the community since 1956.',
    foundingDate: '1956',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function ArticleJsonLd({ title, author, date, url }: {
  title: string
  author?: string
  date?: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: author ? { '@type': 'Person', name: author } : undefined,
    datePublished: date,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Lehigh Valley Baptist Church',
      url: 'https://lvbaptist.org',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SermonJsonLd({ title, speaker, date, passage, url }: {
  title: string
  speaker?: string
  date?: string
  passage?: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    author: speaker ? { '@type': 'Person', name: speaker } : undefined,
    datePublished: date,
    about: passage,
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Lehigh Valley Baptist Church',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
