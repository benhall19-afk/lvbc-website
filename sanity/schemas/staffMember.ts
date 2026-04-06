import { defineField, defineType } from 'sanity'

export const staffMember = defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'role', title: 'Role / Title', type: 'string' }),
    defineField({ name: 'bio', title: 'Biography', type: 'text', rows: 10 }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'originalUrl', title: 'Original URL', type: 'url' }),
    defineField({ name: 'wpId', title: 'WordPress ID', type: 'number', hidden: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
