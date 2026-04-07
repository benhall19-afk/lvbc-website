#!/usr/bin/env node
/**
 * Import extracted WordPress content into Sanity CMS.
 * Usage: node scripts/import-content.mjs [--type testimonies|sermons|pages|all]
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const EXTRACTED_DIR = '/Users/benhpro/Benjamins Apps/lvbc-website/extracted'

const client = createClient({
  projectId: 'uni6i3mv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Load taxonomies for sermon lookup
function loadTaxonomies() {
  const raw = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'taxonomies.json'), 'utf8'))
  const byId = {}
  for (const [key, items] of Object.entries(raw)) {
    byId[key] = {}
    for (const item of items) {
      byId[key][item.id] = item.name
    }
  }
  return byId
}

function stripHtmlToText(html) {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x20;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function importTestimonies() {
  const data = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'testimonies.json'), 'utf8'))
  console.log(`Importing ${data.length} testimonies...`)

  let success = 0, skipped = 0
  const transaction = client.transaction()

  for (const t of data) {
    const doc = {
      _id: `testimony-${t.id}`,
      _type: 'testimony',
      title: t.title,
      slug: { _type: 'slug', current: t.slug },
      originalUrl: t.url,
      content: t.content || stripHtmlToText(t.contentHtml),
      contentHtml: t.contentHtml || undefined,
      language: t.language || 'en',
      publishedDate: t.date || undefined,
      wpId: t.id,
    }
    transaction.createOrReplace(doc)
    success++
  }

  await transaction.commit()
  console.log(`  Testimonies: ${success} imported, ${skipped} skipped`)
}

async function importSermons() {
  const data = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'sermons.json'), 'utf8'))
  const tax = loadTaxonomies()
  console.log(`Importing ${data.length} sermons...`)

  // Batch in groups of 100 for large datasets
  const batchSize = 100
  let success = 0

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const transaction = client.transaction()

    for (const s of batch) {
      // Resolve taxonomy IDs to names
      const speaker = s.preacherIds?.length
        ? s.preacherIds.map(id => tax.preachers?.[id] || '').filter(Boolean).join(', ')
        : undefined
      const series = s.seriesIds?.length
        ? s.seriesIds.map(id => tax.sermonSeries?.[id] || '').filter(Boolean).join(', ')
        : undefined
      const topics = s.topicIds?.length
        ? s.topicIds.map(id => tax.sermonTopics?.[id] || '').filter(Boolean)
        : undefined
      const bibleBooks = s.bibleBookIds?.length
        ? s.bibleBookIds.map(id => tax.bibleBooks?.[id] || '').filter(Boolean)
        : undefined
      const serviceType = s.serviceTypeIds?.length
        ? s.serviceTypeIds.map(id => tax.serviceTypes?.[id] || '').filter(Boolean).join(', ')
        : undefined

      const doc = {
        _id: `sermon-${s.id}`,
        _type: 'sermon',
        title: s.title,
        slug: { _type: 'slug', current: s.slug },
        originalUrl: s.url,
        date: s.sermonDate || (s.date ? s.date.split('T')[0] : undefined),
        speaker,
        series,
        topics,
        biblePassage: s.biblePassage || undefined,
        bibleBooks,
        serviceType,
        audioUrl: s.audioUrl || undefined,
        videoUrl: s.videoUrl || undefined,
        description: s.content || s.excerpt || undefined,
        wpId: s.id,
      }
      transaction.createOrReplace(doc)
      success++
    }

    await transaction.commit()
    console.log(`  Sermons batch ${Math.floor(i / batchSize) + 1}: ${batch.length} imported`)
  }

  console.log(`  Sermons total: ${success} imported`)
}

async function importPages() {
  const data = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'pages.json'), 'utf8'))
  console.log(`Importing ${data.length} pages...`)

  const batchSize = 100
  let success = 0

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const transaction = client.transaction()

    for (const p of batch) {
      // Determine language from URL or content
      const isSpanish = p.url?.includes('/es/') || p.url?.includes('/espanol') || p.slug?.startsWith('es-')

      const doc = {
        _id: `page-${p.id}`,
        _type: 'page',
        title: p.title,
        slug: { _type: 'slug', current: p.slug },
        originalUrl: p.url,
        pageType: p.type || 'page',
        language: isSpanish ? 'es' : 'en',
        content: p.content || stripHtmlToText(p.contentHtml),
        contentHtml: p.contentHtml || undefined,
        publishedDate: p.date || undefined,
        wpId: p.id,
      }
      transaction.createOrReplace(doc)
      success++
    }

    await transaction.commit()
    console.log(`  Pages batch ${Math.floor(i / batchSize) + 1}: ${batch.length} imported`)
  }

  console.log(`  Pages total: ${success} imported`)
}

// Also import posts that might be Bible studies
async function importBibleStudies() {
  const posts = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'posts.json'), 'utf8'))

  // Filter for Bible study content
  const bibleStudyKeywords = ['bible study', 'free bible', 'correspondence course', 'practical bible', 'scripture by scripture', 'emmaus', 'fbs', 'lesson']
  const bibleStudies = posts.filter(p => {
    const titleLower = (p.title || '').toLowerCase()
    const slugLower = (p.slug || '').toLowerCase()
    return bibleStudyKeywords.some(kw => titleLower.includes(kw) || slugLower.includes(kw))
  })

  if (bibleStudies.length === 0) {
    console.log('  No Bible studies found in posts.json — checking pages...')
    // Try pages too
    const pages = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, 'pages.json'), 'utf8'))
    const fromPages = pages.filter(p => {
      const titleLower = (p.title || '').toLowerCase()
      const slugLower = (p.slug || '').toLowerCase()
      return bibleStudyKeywords.some(kw => titleLower.includes(kw) || slugLower.includes(kw))
    })
    if (fromPages.length === 0) {
      console.log('  No Bible studies found in pages either. Skipping.')
      return
    }
    bibleStudies.push(...fromPages)
  }

  console.log(`Importing ${bibleStudies.length} Bible studies...`)
  const transaction = client.transaction()
  let success = 0

  for (const bs of bibleStudies) {
    // Try to detect course type
    const titleLower = (bs.title || '').toLowerCase()
    const slugLower = (bs.slug || '').toLowerCase()
    let course = 'Other'
    if (titleLower.includes('free bible') || slugLower.includes('fbs') || slugLower.includes('free-bible')) course = 'FBS'
    else if (titleLower.includes('correspondence') || slugLower.includes('correspondence')) course = 'CC'
    else if (titleLower.includes('practical bible') || slugLower.includes('pbc')) course = 'PBC'
    else if (titleLower.includes('scripture by scripture') || slugLower.includes('sbb')) course = 'SBB'
    else if (titleLower.includes('emmaus')) course = 'Emmaus'

    // Try to extract lesson number
    const lessonMatch = (bs.title || '').match(/lesson\s*(\d+)/i) || (bs.slug || '').match(/lesson-?(\d+)/i)
    const lessonNumber = lessonMatch ? parseInt(lessonMatch[1]) : undefined

    const doc = {
      _id: `biblestudy-${bs.id}`,
      _type: 'bibleStudy',
      title: bs.title,
      slug: { _type: 'slug', current: bs.slug },
      originalUrl: bs.url,
      course,
      lessonNumber,
      language: 'en',
      content: bs.content || stripHtmlToText(bs.contentHtml),
      contentHtml: bs.contentHtml || undefined,
      wpId: bs.id,
    }
    transaction.createOrReplace(doc)
    success++
  }

  if (success > 0) {
    await transaction.commit()
  }
  console.log(`  Bible studies: ${success} imported`)
}

async function main() {
  const typeArg = process.argv.find(a => a.startsWith('--type='))?.split('=')[1] || 'all'

  console.log('LVBC Content Import to Sanity')
  console.log('============================')

  if (typeArg === 'all' || typeArg === 'testimonies') await importTestimonies()
  if (typeArg === 'all' || typeArg === 'sermons') await importSermons()
  if (typeArg === 'all' || typeArg === 'pages') await importPages()
  if (typeArg === 'all' || typeArg === 'biblestudies') await importBibleStudies()

  console.log('\nDone!')
}

main().catch(err => {
  console.error('Import failed:', err)
  process.exit(1)
})
