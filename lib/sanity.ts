import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Only create client if projectId is set (graceful fallback during build)
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null as any

export function urlFor(source: any) {
  if (!client) return { url: () => '' } as any
  return imageUrlBuilder(client).image(source)
}

// GROQ queries
export const testimonyQuery = `*[_type == "testimony" && slug.current == $slug][0]{
  _id, title, slug, author, content, language, publishedDate, featuredImage, originalUrl
}`

export const testimoniesQuery = `*[_type == "testimony"] | order(publishedDate desc){
  _id, title, slug, author, language, publishedDate, featuredImage
}`

export const sermonQuery = `*[_type == "sermon" && slug.current == $slug][0]{
  _id, title, slug, date, speaker, series, topics, biblePassage, serviceType, audioUrl, videoUrl, description, featuredImage
}`

export const sermonsQuery = `*[_type == "sermon"] | order(date desc){
  _id, title, slug, date, speaker, series, biblePassage, audioUrl, featuredImage
}`

export const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id, title, slug, pageType, language, content, contentHtml, featuredImage, seoDescription
}`
