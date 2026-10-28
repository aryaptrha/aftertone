import { getCollection } from 'astro:content';
import type { SupportedLanguage } from '../i18n/ui';
import { assertValidSongs, parseArticleId, type ArticleEntry, type SongEntry } from './validation';
import { getThemeLabel, type ThemeId } from './themes';
import { getGenreLabel, type GenreId } from './genres';
import { getAcousticFormat } from './formats';

// One song in one language: the shared song file joined with that language's article.
export interface Article {
  // "<lang>/<slug>", the same as the article entry id.
  id: string;
  // The MDX entry, for render().
  entry: ArticleEntry;
  data: {
    slug: string;
    language: SupportedLanguage;
    title: string;
    songTitle?: string;
    artist: string;
    summary: string;
    description: string;
    genre: GenreId;
    themes: ThemeId[];
    status: 'draft' | 'published';
    publishedAt?: Date;
    featured: boolean;
    readTimeMinutes: number;
    catalogCode: string;
    acousticSpeed: string;
    acousticLabel: string;
    rpm: number;
    discType: string;
    spineTag: string;
    sources: ArticleEntry['data']['sources'];
    relatedSongs: string[];
    listenLinks?: SongEntry['data']['listenLinks'];
  };
}

const WORDS_PER_MINUTE = 200;

function readTimeMinutes(body = ''): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

// Drafts are listed in `astro dev` so they can be previewed, and never in a build.
function isVisible(song: SongEntry): boolean {
  return song.data.status === 'published' || import.meta.env.DEV;
}

function byNewest(a: Article, b: Article): number {
  return (b.data.publishedAt?.getTime() ?? 0) - (a.data.publishedAt?.getTime() ?? 0);
}

let cachedArticles: Article[] | null = null;

export async function getAllArticles(): Promise<Article[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  const [songs, entries] = await Promise.all([getCollection('songs'), getCollection('articles')]);
  assertValidSongs(songs, entries);

  // Catalog numbers follow publication order, so a song keeps its number across languages.
  const catalogOrder = songs
    .filter((s) => s.data.status === 'published')
    .sort((a, b) => (a.data.publishedAt?.getTime() ?? 0) - (b.data.publishedAt?.getTime() ?? 0))
    .map((s) => s.id);
  const songsById = new Map(songs.map((s) => [s.id, s]));

  cachedArticles = entries.map((entry) => {
    const { lang, slug } = parseArticleId(entry.id)!;
    const song = songsById.get(slug)!;
    const catalogIndex = catalogOrder.indexOf(slug);
    const format = getAcousticFormat(slug, song.data.acousticSpeed);
    return {
      id: entry.id,
      entry,
      data: {
        ...song.data,
        ...entry.data,
        slug,
        language: lang as SupportedLanguage,
        description: entry.data.description ?? entry.data.summary,
        readTimeMinutes: readTimeMinutes(entry.body),
        catalogCode: catalogIndex === -1 ? 'AT-DRAFT' : `AT-${String(catalogIndex + 1).padStart(3, '0')}`,
        acousticSpeed: format.speed,
        acousticLabel: format.label,
        rpm: format.rpm,
        discType: format.discType,
        spineTag: format.spineTag,
      },
    };
  });
  return cachedArticles;
}

export async function getPublishedArticles(lang?: SupportedLanguage): Promise<Article[]> {
  const [all, songs] = await Promise.all([getAllArticles(), getCollection('songs')]);
  const visibleSlugs = new Set(songs.filter(isVisible).map((s) => s.id));
  return all
    .filter((a) => visibleSlugs.has(a.data.slug) && (!lang || a.data.language === lang))
    .sort(byNewest);
}

export async function getFeaturedArticle(lang: SupportedLanguage): Promise<Article | undefined> {
  const published = await getPublishedArticles(lang);
  return published.find((a) => a.data.featured) ?? published[0];
}

export async function getRecentArticles(
  lang: SupportedLanguage,
  featuredArticleId?: string
): Promise<Article[]> {
  const published = await getPublishedArticles(lang);
  if (!featuredArticleId) {
    return published.slice(1);
  }
  return published.filter((a) => a.id !== featuredArticleId);
}

export async function getArticleBySlug(
  lang: SupportedLanguage,
  slug: string
): Promise<Article | undefined> {
  const published = await getPublishedArticles(lang);
  return published.find((a) => a.data.slug === slug);
}

export async function getArticleCounterpart(article: Article): Promise<Article | undefined> {
  const oppositeLang: SupportedLanguage = article.data.language === 'id' ? 'en' : 'id';
  const published = await getPublishedArticles(oppositeLang);
  return published.find((a) => a.data.slug === article.data.slug);
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  const related = new Set(article.data.relatedSongs);
  if (related.size === 0) {
    return [];
  }
  const published = await getPublishedArticles(article.data.language);
  return published.filter((a) => related.has(a.data.slug));
}

export interface ThemeStat {
  id: ThemeId;
  label: string;
  count: number;
}

export async function getAvailableThemes(lang: SupportedLanguage): Promise<ThemeStat[]> {
  const published = await getPublishedArticles(lang);
  const counts = new Map<ThemeId, number>();

  for (const article of published) {
    for (const theme of article.data.themes) {
      counts.set(theme, (counts.get(theme) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      label: getThemeLabel(id, lang),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
