// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'; // Correct import for Astro 7

// Project Schema: Validates engineering portfolio items
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().max(200),
      role: z.string(),
      stack: z.array(z.string()),
      links: z.object({
        production: z.string().url().optional(),
        repository: z.string().url().optional(),
      }),
      status: z.enum(['development', 'production', 'archived']),
      dates: z.object({
        start: z.coerce.date(),
        end: z.coerce.date().nullable(),
      }),
      coverImage: image(),
      weight: z.number().int().default(0),
    }),
});

// Writing Schema: Validates technical notes and articles
const writing = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().max(250),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
