# DATABASE.md — aftertone

> Status: MVP data architecture  
> Scope: content model, MDX frontmatter, relationships, validation, and future persistence options  
> Primary source of truth: version-controlled content files in Git  
> Runtime database: none in the MVP

## 1. Purpose

This document defines how aftertone stores, validates, relates, and publishes editorial music interpretations.

aftertone is a bilingual Indonesian–English music interpretation journal. Its primary records are editorial articles about songs, not song lyrics or streaming catalog data. The data model must support:

- Indonesian and English editions of an article.
- Song and artist metadata.
- Themes, genres, publication dates, and editorial summaries.
- Sources and research notes used to support an interpretation.
- Related articles and links between language editions.
- Static rendering and build-time validation in Astro.

This is a **content model**, not a requirement to provision a SQL database. For the MVP, MDX files are the database-like source of truth and Astro builds the public pages.

## 2. Architecture decision

### MVP: file-based content

| Concern | Decision |
|---|---|
| Content storage | MDX files in the Git repository |
| Content schema | Astro content collections / schema validation supported by the installed Astro version |
| Rendering | Astro static site generation |
| Hosting | Cloudflare Pages |
| Images and other media | Cloudflare R2, referenced by stable public URLs or configured asset paths |
| Search and filters | Build-time indexes and client-side filtering where needed |
| User accounts or submissions | Out of scope |
| Runtime database | None |

### Why this is the right default

- The site is editorial and read-heavy.
- Publishing should be reviewable through normal Git diffs and pull requests.
- Static output keeps hosting, security, and operational complexity low.
- Song articles and metadata do not currently require transactional writes.
- The model can later be migrated into a database without changing the conceptual entities.

Do not add a database merely to store content that is already well represented by version-controlled MDX.

## 3. Data modeling principles

1. **An article is an editorial interpretation.** A song is the subject of an article, not the article itself.
2. **Language editions are separate content records.** Indonesian and English prose may differ naturally; do not assume that one is a line-by-line translation of the other.
3. **Use stable identifiers for relationships.** Do not link records by title, artist display name, or translated slug.
4. **Keep display text separate from identifiers.** Slugs and IDs should remain stable even when titles change.
5. **Store only necessary metadata.** Do not reproduce lyrics, album notes, or other copyrighted source text.
6. **Validate at build time.** Broken references, invalid dates, missing language counterparts, and malformed metadata should be caught before deployment.
7. **Avoid premature normalization.** In the MVP, a compact MDX frontmatter schema is preferable to separate database tables for every entity.

## 4. Conceptual entities

### 4.1 Song

The publishable record and the single place for metadata that is the same in every language. One YAML file per song; its filename is the song's slug.

Key attributes:

- slug: the filename, stable, used in every URL and relation.
- `artist`: song metadata.
- `genre`, `themes`: controlled taxonomy values.
- `status`, `publishedAt`, `featured`: publication lifecycle, set once for all languages.
- `listenLinks`: optional streaming links.
- `relatedSongs`: slugs of other songs.

### 4.2 Article

One language edition of a song: the interpretation and the text that is written per language. Its path, `<lang>/<slug>`, is its identity, so it carries no id, language, or song key fields.

Key attributes:

- `title`, `summary`, optional `description`: display and discovery text.
- optional `songTitle`: localized song title, when it differs from `title`.
- `sources`: research references, with labels in this language.

Rules:

- A song is published or drafted as a whole; its articles follow its status.
- A published song must have both an `id` and an `en` article.
- Derived, never stored: reading time (from the article body) and catalog number (from publication order).

### 4.3 Taxonomy

Taxonomy values power filtering, labels, and related-content discovery.

- `genre`: one primary genre for the article in the MVP.
- `themes`: zero or more interpretation themes, such as `longing`, `memory`, `identity`, or `letting-go`.

Taxonomy identifiers are stable machine values; labels may be localized in the UI. Avoid inventing near-duplicate values such as `letting-go`, `letting_go`, and `moving-on` for the same concept.

### 4.4 Source

A source is a reference that supports research or context. Sources should point to external resources or official pages, not contain copied copyrighted text.

A source may include:

- `label`: human-readable source title.
- `url`: canonical URL.
- `publisher`: optional organization or publication.
- `accessedAt`: optional date checked.

Source data should be concise. Do not store full article text, lyrics, or scraped page content in frontmatter.

## 5. Proposed content directory

Adapt this layout to the repository if an existing Astro structure has already been established. Do not duplicate content under a second directory.

```text
src/
  content/
    songs/
      hatsukoi-butterfly.yaml     # shared metadata
    articles/
      id/
        hatsukoi-butterfly.mdx    # Indonesian edition
      en/
        hatsukoi-butterfly.mdx    # English edition
  data/
    genres.ts
    themes.ts
    articles.ts                   # joins songs with articles; all page queries
    validation.ts                 # build-time integrity rules
  content.config.ts
scripts/
  new-song.mjs                    # `npm run new:song` scaffold
```

File naming:

- Use lowercase kebab-case from the romanized song title. The same slug names all three files.
- Keep the slug stable after publication; it is the URL.
- The language is the article's folder.

## 6. Schema

Implemented in `src/content.config.ts`. The field-by-field authoring reference, with examples, is `docs/CONTENT_AUTHORING.md`.

### Song — `src/content/songs/<slug>.yaml`

| Field | Type | Required | Rules |
|---|---|---:|---|
| `artist` | string | Yes | Main artist / group display name |
| `genre` | string | Yes | Must match a registered genre ID |
| `themes` | string[] | Yes | At least one; every value must match a registered theme ID |
| `status` | enum | No | `draft` (default) or `published` |
| `publishedAt` | date | Conditional | Required when `status` is `published` |
| `featured` | boolean | No | Defaults to `false`; at most one published song |
| `listenLinks` | object | No | `spotify`, `appleMusic`, `youtube`; full URLs |
| `relatedSongs` | string[] | No | Slugs; each must resolve |

### Article — `src/content/articles/<lang>/<slug>.mdx`

| Field | Type | Required | Rules |
|---|---|---:|---|
| `title` | string | Yes | Essay title; no lyrics used as title unless legally appropriate |
| `songTitle` | string | No | Localized song title, shown when it differs from `title` |
| `summary` | string | Yes | Short editorial summary for cards and listings |
| `description` | string | No | SEO and social description; defaults to `summary` |
| `sources` | Source[] | No | Labels in this language; each needs a full URL |

Derived at build time and never stored: reading time (body word count at 200 wpm) and catalog number (`AT-001`, ... in publication order).

## 7. Stable identifiers and routing

- Song slug: `hatsukoi-butterfly`, the filename of the song and of both articles.
- Article id: `id/hatsukoi-butterfly`, `en/hatsukoi-butterfly`, its path, assigned by the loader.
- Genre ID: `idol-pop`. Theme ID: `first-love`.

Routes are `/<lang>/songs/<slug>/`, for example:

```text
/id/songs/hatsukoi-butterfly/
/en/songs/hatsukoi-butterfly/
```

Do not use a translated title as a relationship key; relations use slugs.

## 8. Genre and theme registries

Keep allowed values in a small registry, so filters and content validation use the same identifiers.

Example:

```ts
export const genres = [
  { id: "idol-pop", label: { id: "Idol Pop", en: "Idol Pop" } },
  { id: "j-pop", label: { id: "J-Pop", en: "J-Pop" } },
  { id: "rock", label: { id: "Rock", en: "Rock" } },
  { id: "indie", label: { id: "Indie", en: "Indie" } },
  { id: "r-and-b", label: { id: "R&B", en: "R&B" } },
  { id: "electronic", label: { id: "Elektronik", en: "Electronic" } },
] as const;
```

Example themes:

```ts
export const themes = [
  "first-love",
  "longing",
  "memory",
  "identity",
  "letting-go",
  "grief",
  "hope",
  "self-discovery",
  "distance",
  "belonging",
] as const;
```

These are starter values, not a mandatory exhaustive taxonomy. Add values only when they improve discovery. A theme should describe an interpretive lens, not merely repeat the genre or artist.

## 9. Relationships and integrity rules

### Relationship map

```text
Song (slug)
  ├── has one Genre (genre ID)
  ├── has many Themes (theme IDs)
  ├── relates to many Songs (relatedSongs)
  └── has one Article per Language (articles/<lang>/<slug>.mdx)
        └── cites many Sources
```

### Build-time validation

Field types, taxonomy IDs, URL formats, and `publishedAt` on published songs are enforced by the schema. `src/data/validation.ts` adds the cross-file rules, and the build fails listing every error:

1. An article not at `<id|en>/<slug>.mdx`, or with no matching song file.
2. A song slug that is not lowercase kebab-case.
3. A `relatedSongs` slug that does not exist, or that names the song itself.
4. More than one published `featured` song.
5. A published song missing its `id` or `en` article.
6. A published song with a source or listen link on a placeholder host (`example.com`).
7. A published song's article still containing `[bracketed]` placeholder text.

Drafts are excluded from builds, routes, and indexes, and listed only in `astro dev` for preview.

## 10. Query and index patterns

The MVP does not need a query server. Build pages and indexes from the content collection.

Expected query patterns:

- Home: newest published articles and a small set of featured articles.
- Explore: all published articles, with optional genre/theme filters.
- Article page: one article by route ID/slug.
- Language switcher: published counterpart matching `translationKey` and the other language.
- Related articles: resolve `relatedArticleIds`, excluding drafts and the current article.
- SEO: per-article title, description, canonical URL, and language alternate URLs.

Recommended behavior:

- Sort published lists by `publishedAt` descending unless a page explicitly uses editorial ordering.
- Do not depend on filesystem ordering.
- Keep client-side search limited to public metadata and summaries. Do not ship full article bodies to the browser solely for search.
- If content volume grows, generate a compact search index during the build.
- Use one canonical URL per language edition and configure `hreflang` only for published, real counterparts.

## 11. Asset references

For images stored in Cloudflare R2:

- Use a consistent public asset domain or a single centralized URL helper.
- Store stable asset paths/URLs in content metadata; do not hard-code different domains throughout components.
- Use versioned filenames when replacing assets, or apply a documented cache invalidation strategy.
- Keep image dimensions and alt text available to rendering components.
- Do not store private credentials, R2 access keys, or signed secrets in MDX or client-side code.
- Avoid storing the same image metadata in both frontmatter and a separate manifest unless the manifest is the single source of truth.

For decorative cover art, use meaningful alt text only if it conveys information; otherwise use empty alt text at the rendering layer.

## 12. Content integrity, editorial quality, and copyright

- Interpret songs in original prose; do not store full lyrics.
- Do not use lyrics as summaries, SEO descriptions, or social previews.
- Any brief quotation must be justified, attributed, and reviewed for applicable copyright rules.
- Keep source URLs and publisher attribution accurate.
- Distinguish verified facts (release details, credited artist) from interpretation (themes, narrative reading).
- Do not infer artist intent as fact unless a reliable source supports the claim.
- Keep `sources` as research references; they are not necessarily citations displayed inline in every paragraph.
- A published article should have a clear thesis, original analysis, and a distinction between textual evidence and personal interpretation.

## 13. Localized content strategy

Each language edition should be a first-class article file. Avoid placing both full article bodies in a single MDX file with conditional rendering.

- UI labels belong in shared localization dictionaries.
- Article prose belongs in the language-specific MDX file.
- `language` must match the content language.
- `translationKey` pairs corresponding editions.
- Titles and summaries may be independently written for each language.
- If a counterpart is absent, omit its language alternate link rather than pointing to a 404.

This separates UI localization from editorial translation and keeps content readable in code review.

## 14. Migration path if a database becomes necessary

Do not implement these tables in the MVP. This is a future mapping, not a current dependency.

| Future table/entity | Key fields | Notes |
|---|---|---|
| `articles` | `id`, `translation_key`, `language`, `slug`, `status`, timestamps | One row per language edition |
| `songs` | `id`, `title`, optional release metadata | Introduce only if multiple articles need shared song records |
| `artists` | `id`, `name`, optional canonical URL | Introduce only if artist metadata must be managed independently |
| `genres` | `id`, localized labels | Controlled vocabulary |
| `themes` | `id`, localized labels | Controlled vocabulary |
| `article_themes` | `article_id`, `theme_id` | Many-to-many join |
| `article_sources` | `article_id`, source fields | Could remain JSON if source querying is unnecessary |
| `article_relations` | `source_article_id`, `target_article_id` | Directed or undirected semantics must be chosen explicitly |

Potential migration triggers:

- Editors need a browser-based content management interface.
- Non-technical contributors must publish without Git.
- Content requires authenticated create/update/delete operations.
- Relationships or search require frequent runtime updates.
- The site needs user accounts, bookmarks, comments, or other user-generated data.

Before migrating, define export/import scripts and preserve stable article IDs and translation keys. MDX can remain the editorial body format even if metadata moves to a database, depending on the chosen CMS architecture.

## 15. Non-goals for the MVP

- No SQL schema or migrations.
- No database connection or runtime query layer.
- No user-generated content.
- No accounts, likes, comments, or bookmarks.
- No external music catalog synchronization.
- No scraping or storing full lyrics.
- No analytics event database.
- No separate song/artist tables unless the content model develops a real reuse requirement.

## 16. Implementation checklist

- [x] Confirm the installed Astro version (7.4) and use its content layer API.
- [x] Create the song and article collections and validate required fields.
- [x] Register genre and theme identifiers in one place.
- [x] Validate that each article belongs to a song and each published song has both languages.
- [x] Validate `relatedSongs` and reject placeholder URLs during build.
- [x] Filter drafts out of production routes and indexes.
- [x] Generate home, explore, article, and language-switch data from published content.
- [ ] Use stable asset URL conventions for R2.
- [x] Add tests for missing translations, unresolved relations, and placeholders.
- [x] Document the authoring flow (`docs/CONTENT_AUTHORING.md`).

## 17. Final rule

For the MVP, **Git + MDX is the source of truth; Astro validates and builds it; Cloudflare Pages serves the static output; R2 serves media**. Add a runtime database only when a concrete product requirement cannot be handled cleanly by this architecture.
