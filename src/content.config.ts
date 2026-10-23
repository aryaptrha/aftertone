import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { genreIds } from './data/genres';
import { themeIds } from './data/themes';

// One file per song: src/content/songs/<slug>.yaml. The filename is the slug.
// Holds only what is the same in every language.
const songs = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './src/content/songs',
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
  }),
  schema: z
    .object({
      artist: z.string(),
      genre: z.enum(genreIds),
      themes: z.array(z.enum(themeIds)).min(1),
      status: z.enum(['draft', 'published']).default('draft'),
      publishedAt: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      listenLinks: z
        .object({
          spotify: z.string().url().optional(),
          appleMusic: z.string().url().optional(),
          youtube: z.string().url().optional(),
        })
        .optional(),
      // Slugs of other songs (the filename without .yaml).
      relatedSongs: z.array(z.string()).default([]),
    })
    .refine((data) => data.status !== 'published' || !!data.publishedAt, {
      message: 'publishedAt is required when status is "published"',
      path: ['publishedAt'],
    }),
});

// One file per song per language: src/content/articles/<lang>/<slug>.mdx.
// The entry id is "<lang>/<slug>", so the language and the song come from the path.
// Holds the text written in that language, including its own sources and labels.
const articles = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    songTitle: z.string().optional(),
    summary: z.string(),
    description: z.string().optional(),
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
          publisher: z.string().optional(),
          accessedAt: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { songs, articles };
