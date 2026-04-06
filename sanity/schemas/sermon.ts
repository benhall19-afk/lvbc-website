import { defineField, defineType } from 'sanity'

export const sermon = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'originalUrl', title: 'Original URL', type: 'url' }),
    defineField({ name: 'date', title: 'Sermon Date', type: 'date' }),
    defineField({ name: 'speaker', title: 'Speaker', type: 'string' }),
    defineField({ name: 'series', title: 'Series', type: 'string' }),
    defineField({ name: 'topics', title: 'Topics', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'biblePassage', title: 'Scripture Reference', type: 'string', description: 'e.g. John 3:16 or Romans 8:1-11' }),
    defineField({ name: 'bibleBooks', title: 'Bible Books', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'serviceType', title: 'Service Type', type: 'string' }),
    defineField({ name: 'audioUrl', title: 'Audio URL (MP3)', type: 'url' }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
    defineField({ name: 'featuredImage', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'wpId', title: 'WordPress ID', type: 'number', hidden: true }),
  ],
  orderings: [
    { title: 'Newest First', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Speaker A-Z', name: 'speakerAsc', by: [{ field: 'speaker', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', speaker: 'speaker', date: 'date', media: 'featuredImage' },
    prepare({ title, speaker, date, media }) {
      return { title, subtitle: `${speaker || 'Unknown'} — ${date || ''}`, media }
    },
  },
})
