import type { CollectionEntry } from 'astro:content';

export type SongEntry = CollectionEntry<'songs'>;
export type ArticleEntry = CollectionEntry<'articles'>;

export interface ValidationError {
  rule: string;
  songId?: string;
  message: string;
}

// Languages every published song must be written in.
export const requiredLanguages = ['id', 'en'] as const;

// Hosts the scaffold writes as placeholders. A published song must not still point at them.
const placeholderHosts = ['example.com'];

// Text in [square brackets] that is not a Markdown link, e.g. "[Opening paragraph...]".
const bracketPlaceholder = /\[[^\]\n]+\](?!\()/;

// Splits an article id of the form "<lang>/<slug>".
export function parseArticleId(id: string): { lang: string; slug: string } | null {
  const match = /^([a-z]{2})\/([a-z0-9-]+)$/.exec(id);
  return match ? { lang: match[1], slug: match[2] } : null;
}

function isPlaceholderUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return placeholderHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return true;
  }
}

export function validateSongs(songs: SongEntry[], articles: ArticleEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const songIds = new Set(songs.map((s) => s.id));
  const articlesBySong = new Map<string, ArticleEntry[]>();

  // Articles must sit at <lang>/<slug> and belong to an existing song.
  for (const article of articles) {
    const parsed = parseArticleId(article.id);
    if (!parsed || !(requiredLanguages as readonly string[]).includes(parsed.lang)) {
      errors.push({
        rule: 'invalid-article-path',
        message: `Article "${article.id}" must be at src/content/articles/<${requiredLanguages.join('|')}>/<slug>.mdx.`,
      });
      continue;
    }
    if (!songIds.has(parsed.slug)) {
      errors.push({
        rule: 'orphan-article',
        songId: parsed.slug,
        message: `Article "${article.id}" has no song file. Create src/content/songs/${parsed.slug}.yaml.`,
      });
      continue;
    }
    const list = articlesBySong.get(parsed.slug) ?? [];
    list.push(article);
    articlesBySong.set(parsed.slug, list);
  }

  const featured = songs.filter((s) => s.data.status === 'published' && s.data.featured);
  if (featured.length > 1) {
    errors.push({
      rule: 'multiple-featured',
      message: `Only one published song can be featured, found: ${featured.map((s) => s.id).join(', ')}.`,
    });
  }

  for (const song of songs) {
    const { id } = song;

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
      errors.push({
        rule: 'invalid-slug',
        songId: id,
        message: `Song file "${id}.yaml" must be named in lowercase-kebab-case.`,
      });
    }

    for (const related of song.data.relatedSongs) {
      if (related === id) {
        errors.push({ rule: 'self-relation', songId: id, message: `Song "${id}" lists itself in relatedSongs.` });
      } else if (!songIds.has(related)) {
        errors.push({
          rule: 'unresolved-relation',
          songId: id,
          message: `Song "${id}" has relatedSongs entry "${related}", but there is no src/content/songs/${related}.yaml.`,
        });
      }
    }

    // The remaining checks only block publishing; drafts may be incomplete.
    if (song.data.status !== 'published') continue;

    const written = articlesBySong.get(id) ?? [];
    for (const lang of requiredLanguages) {
      if (!written.some((a) => a.id === `${lang}/${id}`)) {
        errors.push({
          rule: 'missing-translation',
          songId: id,
          message: `Published song "${id}" has no ${lang} article. Create src/content/articles/${lang}/${id}.mdx.`,
        });
      }
    }

    for (const [name, url] of Object.entries(song.data.listenLinks ?? {})) {
      if (url && isPlaceholderUrl(url)) {
        errors.push({
          rule: 'placeholder-link',
          songId: id,
          message: `Published song "${id}" still has a placeholder ${name} link: ${url}`,
        });
      }
    }

    for (const article of written) {
      for (const source of article.data.sources) {
        if (isPlaceholderUrl(source.url)) {
          errors.push({
            rule: 'placeholder-source',
            songId: id,
            message: `Article "${article.id}" source "${source.label}" still points at a placeholder URL: ${source.url}`,
          });
        }
      }

      const text = [article.data.title, article.data.summary, article.data.description ?? '', article.body ?? ''].join('\n');
      const leftover = bracketPlaceholder.exec(text);
      if (leftover) {
        errors.push({
          rule: 'unfilled-placeholder',
          songId: id,
          message: `Article "${article.id}" still contains the placeholder "${leftover[0]}".`,
        });
      }
    }
  }

  return errors;
}

export function assertValidSongs(songs: SongEntry[], articles: ArticleEntry[]): void {
  const errors = validateSongs(songs, articles);
  if (errors.length > 0) {
    const formatted = errors.map((e) => `[${e.rule}] ${e.message}`).join('\n');
    throw new Error(`Build-time Content Integrity Validation Failed:\n${formatted}`);
  }
}
