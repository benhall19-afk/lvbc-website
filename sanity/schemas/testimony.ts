import { defineField, defineType } from 'sanity'

export const testimony = defineType({
  name: 'testimony',
  title: 'Testimony',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL — must match original)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original URL',
      type: 'url',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content (Word-for-word — Do Not Modify)',
      type: 'text',
      rows: 20,
      description: '⚠️ This is a personal testimony. Do NOT edit, paraphrase, or correct.',
    }),
    defineField({
      name: 'contentHtml',
      title: 'Original HTML',
      type: 'text',
      hidden: true,
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Spanish / Español', value: 'es' },
        ],
      },
      initialValue: 'en',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wpId',
      title: 'WordPress ID',
      type: 'number',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'author', language: 'language' },
    prepare({ title, subtitle, language }) {
      return { title, subtitle: `${subtitle || 'Anonymous'} (${language || 'en'})` }
    },
  },
})
