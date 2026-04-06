import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'originalUrl', title: 'Original URL', type: 'url' }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'homePage' },
          { title: 'About', value: 'aboutPage' },
          { title: 'Ministry', value: 'ministry' },
          { title: 'Evangelism / Know God', value: 'evangelism' },
          { title: 'Baptist History', value: 'history' },
          { title: 'Spanish Content', value: 'spanishContent' },
          { title: 'Members', value: 'membersPage' },
          { title: 'Livestream', value: 'livestream' },
          { title: 'Blog Post', value: 'blogPost' },
          { title: 'Generic', value: 'page' },
        ],
      },
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [{ title: 'English', value: 'en' }, { title: 'Spanish', value: 'es' }] },
      initialValue: 'en',
    }),
    defineField({ name: 'content', title: 'Content', type: 'text', rows: 20 }),
    defineField({ name: 'contentHtml', title: 'Original HTML', type: 'text', hidden: true }),
    defineField({ name: 'publishedDate', title: 'Published Date', type: 'datetime' }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3 }),
    defineField({ name: 'wpId', title: 'WordPress ID', type: 'number', hidden: true }),
  ],
  preview: {
    select: { title: 'title', pageType: 'pageType', language: 'language' },
    prepare({ title, pageType, language }) {
      return { title, subtitle: `${pageType || 'page'} (${language || 'en'})` }
    },
  },
})
