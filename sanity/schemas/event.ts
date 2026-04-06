import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Event Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'startDate', title: 'Start Date & Time', type: 'datetime' }),
    defineField({ name: 'endDate', title: 'End Date & Time', type: 'datetime' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 8 }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'originalUrl', title: 'Original URL', type: 'url' }),
    defineField({ name: 'wpId', title: 'WordPress ID', type: 'number', hidden: true }),
  ],
  preview: {
    select: { title: 'title', startDate: 'startDate' },
    prepare({ title, startDate }) {
      return { title, subtitle: startDate ? new Date(startDate).toLocaleDateString() : '' }
    },
  },
})
