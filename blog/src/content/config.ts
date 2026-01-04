import { defineCollection, z } from 'astro:content'

export const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.string().or(z.date()),
    hero: z.string().optional(),
    tags: z.array(z.string()).optional(),
    canonical: z.string().url().optional(),
    draft: z.boolean().optional().default(false),
    icon: z.string().optional(),
  }),
})

export const collections = { posts }
