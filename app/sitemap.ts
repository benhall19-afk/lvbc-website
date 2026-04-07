import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const BASE_URL = 'https://www.lvbaptist.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/changed-lives`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/service-archive`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/free-bible-study-offer`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  if (!client) return entries

  const [testimonies, sermons, pages, studies] = await Promise.all([
    client.fetch(`*[_type == "testimony"]{"slug": slug.current, "updated": _updatedAt}`),
    client.fetch(`*[_type == "sermon"]{"slug": slug.current, "updated": _updatedAt}`),
    client.fetch(`*[_type == "page"]{"slug": slug.current, "updated": _updatedAt}`),
    client.fetch(`*[_type == "bibleStudy"]{"slug": slug.current, "updated": _updatedAt}`),
  ])

  for (const t of testimonies) {
    if (t.slug) entries.push({ url: `${BASE_URL}/${t.slug}`, lastModified: t.updated, priority: 0.7 })
  }
  for (const s of sermons) {
    if (s.slug) entries.push({ url: `${BASE_URL}/sermons/${s.slug}`, lastModified: s.updated, priority: 0.6 })
  }
  for (const p of pages) {
    if (p.slug) entries.push({ url: `${BASE_URL}/${p.slug}`, lastModified: p.updated, priority: 0.5 })
  }
  for (const b of studies) {
    if (b.slug) entries.push({ url: `${BASE_URL}/${b.slug}`, lastModified: b.updated, priority: 0.6 })
  }

  return entries
}
