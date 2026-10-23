import { test, describe } from 'node:test';
import assert from 'node:assert';
import { genres, isValidGenre, getGenreLabel } from '../src/data/genres.ts';
import { themes, isValidTheme, getThemeLabel } from '../src/data/themes.ts';
import { validateSongs } from '../src/data/validation.ts';

describe('Taxonomy Registries', () => {
  test('genres have unique IDs and bilingual labels', () => {
    const ids = new Set();
    for (const genre of genres) {
      assert.ok(!ids.has(genre.id), `Duplicate genre ID: ${genre.id}`);
      ids.add(genre.id);
      assert.ok(genre.label.id, `Missing Indonesian label for ${genre.id}`);
      assert.ok(genre.label.en, `Missing English label for ${genre.id}`);
    }
  });

  test('themes have unique IDs and bilingual labels', () => {
    const ids = new Set();
    for (const theme of themes) {
      assert.ok(!ids.has(theme.id), `Duplicate theme ID: ${theme.id}`);
      ids.add(theme.id);
      assert.ok(theme.label.id, `Missing Indonesian label for ${theme.id}`);
      assert.ok(theme.label.en, `Missing English label for ${theme.id}`);
    }
  });

  test('label getters return localized strings or fallback', () => {
    assert.strictEqual(getGenreLabel('idol-pop', 'id'), 'Idol Pop');
    assert.strictEqual(getGenreLabel('electronic', 'id'), 'Elektronik');
    assert.strictEqual(getGenreLabel('electronic', 'en'), 'Electronic');
    assert.strictEqual(getThemeLabel('first-love', 'id'), 'Cinta Pertama');
    assert.strictEqual(getThemeLabel('first-love', 'en'), 'First Love');
  });
});

describe('Song integrity (validateSongs)', () => {
  const song = (id: string, overrides = {}) => ({
    id,
    data: {
      artist: 'Artist A',
      genre: 'idol-pop',
      themes: ['first-love'],
      status: 'published' as const,
      publishedAt: new Date('2026-03-15'),
      featured: false,
      relatedSongs: [] as string[],
      ...overrides,
    },
  });

  const article = (id: string, overrides = {}, body = 'Finished prose.') => ({
    id,
    body,
    data: {
      title: 'Title',
      summary: 'Summary',
      sources: [{ label: 'Official Release', url: 'https://label.jp/release' }],
      ...overrides,
    },
  });

  const bothLanguages = (slug: string) => [article(`id/${slug}`), article(`en/${slug}`)];
  const rules = (songs: unknown[], articles: unknown[]) =>
    validateSongs(songs as any, articles as any).map((e) => e.rule);

  test('a complete published song passes with zero errors', () => {
    assert.deepStrictEqual(rules([song('song-a')], bothLanguages('song-a')), []);
  });

  test('flags a published song missing a language', () => {
    assert.ok(rules([song('song-a')], [article('id/song-a')]).includes('missing-translation'));
  });

  test('allows a draft song with only one language and placeholders', () => {
    const draft = song('song-a', { status: 'draft' });
    assert.deepStrictEqual(rules([draft], [article('id/song-a', {}, '[Opening paragraph]')]), []);
  });

  test('flags an article with no song file', () => {
    assert.ok(rules([], [article('id/ghost')]).includes('orphan-article'));
  });

  test('flags an article outside <lang>/<slug>', () => {
    assert.ok(rules([song('song-a')], [...bothLanguages('song-a'), article('song-a')]).includes('invalid-article-path'));
  });

  test('flags more than one featured song', () => {
    const songs = [song('song-a', { featured: true }), song('song-b', { featured: true })];
    assert.ok(rules(songs, [...bothLanguages('song-a'), ...bothLanguages('song-b')]).includes('multiple-featured'));
  });

  test('flags related songs that do not exist, and self-relations', () => {
    const result = rules([song('song-a', { relatedSongs: ['ghost', 'song-a'] })], bothLanguages('song-a'));
    assert.ok(result.includes('unresolved-relation'));
    assert.ok(result.includes('self-relation'));
  });

  test('flags a slug that is not kebab-case', () => {
    assert.ok(rules([song('Song_A')], bothLanguages('Song_A')).includes('invalid-slug'));
  });

  test('flags placeholder source and listen URLs on a published song', () => {
    const songs = [song('song-a', { listenLinks: { spotify: 'https://example.com' } })];
    const articles = [article('id/song-a', { sources: [{ label: 'X', url: 'https://www.example.com/x' }] }), article('en/song-a')];
    const result = rules(songs, articles);
    assert.ok(result.includes('placeholder-source'));
    assert.ok(result.includes('placeholder-link'));
  });

  test('flags unfilled [bracket] placeholders but not Markdown links', () => {
    const withLink = [article('id/song-a', {}, 'See [the interview](https://label.jp/interview).'), article('en/song-a')];
    assert.deepStrictEqual(rules([song('song-a')], withLink), []);

    const withPlaceholder = [article('id/song-a', {}, '[Opening paragraph]'), article('en/song-a')];
    assert.ok(rules([song('song-a')], withPlaceholder).includes('unfilled-placeholder'));
  });
});
