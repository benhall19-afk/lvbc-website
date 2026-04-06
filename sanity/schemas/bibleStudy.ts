import { defineField, defineType } from 'sanity'

export const bibleStudy = defineType({
  name: 'bibleStudy',
  title: 'Bible Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Lesson Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
    defineField({ name: 'originalUrl', title: 'Original URL', type: 'url' }),
    defineField({
      name: 'course',
      title: 'Course',
      type: 'string',
      options: {
        list: [
          { title: 'Free Bible Study (FBS)', value: 'FBS' },
          { title: 'Correspondence Course (CC)', value: 'CC' },
          { title: 'Practical Bible Course (PBC)', value: 'PBC' },
          { title: 'Scripture by Scripture (SBB)', value: 'SBB' },
          { title: 'Emmaus Baptist Academy', value: 'Emmaus' },
          { title: 'Other', value: 'Other' },
        ],
      },
    }),
    defineField({ name: 'lessonNumber', title: 'Lesson Number', type: 'number' }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [{ title: 'English', value: 'en' }, { title: 'Spanish', value: 'es' }] },
      initialValue: 'en',
    }),
    defineField({ name: 'content', title: 'Content', type: 'text', rows: 20 }),
    defineField({ name: 'contentHtml', title: 'Original HTML', type: 'text', hidden: true }),
    defineField({ name: 'wpId', title: 'WordPress ID', type: 'number', hidden: true }),
  ],
  preview: {
    select: { title: 'title', course: 'course', lessonNumber: 'lessonNumber' },
    prepare({ title, course, lessonNumber }) {
      return { title, subtitle: `${course || ''}${lessonNumber ? ` — Lesson ${lessonNumber}` : ''}` }
    },
  },
})
