# Content Authoring Guide — aftertone

How to add, write, and publish a song interpretation in **aftertone**.

---

## 1. Adding a song in three steps

```bash
# 1. Scaffold the song (creates three draft files)
npm run new:song <slug> -- --title "<Song title>" --artist "<Artist>" --genre <genre> --themes <theme>,<theme>

# 2. Write both articles, previewing as you go
npm run dev        # open /id/songs/<slug>/ and /en/songs/<slug>/

# 3. Publish: in src/content/songs/<slug>.yaml set
#      status: published
#      publishedAt: YYYY-MM-DD
npm run build      # fails with a list of anything still missing
```

Optional scaffold flags: `--related <slug,slug>`, `--spotify <url>`, `--apple-music <url>`, `--youtube <url>`, `--featured`. Run `npm run new:song` with no arguments to list the allowed genres and themes.

Drafts appear in `npm run dev` so you can preview them, and are never included in a build.

---

## 2. Where everything lives

A song is one shared file plus one article per language. The slug (lowercase kebab-case from the romanized title) is the filename everywhere, and becomes the URL `/<lang>/songs/<slug>/`.

```text
src/content/
  songs/
    <slug>.yaml        shared: artist, genre, themes, status, links
  articles/
    id/<slug>.mdx      Indonesian: title, summary, sources, prose
    en/<slug>.mdx      English: title, summary, sources, prose
```

Nothing is typed twice. The article's language comes from its folder and its song from its filename. Reading time is computed from the prose, and the catalog number (`AT-001`, `AT-002`, ...) follows publication order.

### Song file — `src/content/songs/<slug>.yaml`

The values below are from the real song `yuuhi-wo-miteiruka`:

```yaml
artist: "JKT48"
genre: idol-pop              # from src/data/genres.ts
themes:                      # from src/data/themes.ts, at least one
  - hope
  - self-discovery
  - identity
  - belonging
status: draft                # draft | published
publishedAt: YYYY-MM-DD      # required once published
featured: false              # at most one published song may be featured (home page gatefold)
relatedSongs: []             # slugs of other songs
# listenLinks:               # optional
#   spotify: "<full URL>"
#   youtube: "<full URL>"
```

### Article — `src/content/articles/<lang>/<slug>.mdx`

The frontmatter below is the Indonesian article for `yuuhi-wo-miteiruka`:

```yaml
---
title: "Yuuhi wo Miteiruka: Seni Menghargai Diri di Penghujung Hari"   # essay headline
summary: "<2-3 sentence editorial summary for cards and the gatefold>"
description: "<optional SEO and social description>"                 # optional, defaults to summary
sources:                                                              # labels in this article's language
  - label: "Diskografi Resmi AKB48 — Kredit Lagu"
    url: "https://www.akb48.co.jp/about/discography/detail_cd/?media_id=43"
    publisher: "AKB48 Official Website"
    accessedAt: "2026-10-22"
---

## What Lies Beneath — ...
```

Need a new theme? Run `npm run new:theme <theme-id> -- --en "<English label>" --id "<Indonesian label>"`. It adds the theme to `src/data/themes.ts`, and the theme then works in `--themes`, the song schema, and the explore filters. For a new genre, add it with both labels to `src/data/genres.ts`. Those two files are the only lists of allowed values.

---

## 3. What the build checks

Content is checked whenever the site loads it (`npm run dev`, `npm run build`). Any error stops the build and names the file to fix.

| Check | Applies to |
|---|---|
| Fields have the right type; genre and themes are registered; URLs are full URLs | every song and article |
| `publishedAt` is set when `status: published` | every song |
| Every article sits at `articles/<id\|en>/<slug>.mdx` and has a matching song file | every article |
| Every `relatedSongs` slug exists and is not the song itself | every song |
| At most one song is `featured` | published songs |
| Both `id` and `en` articles exist | published songs |
| No `[bracketed]` placeholder text remains (Markdown links are fine) | published songs |
| No source or listen link points at a placeholder host (`example.com`) | published songs |

`npm test` runs these rules against sample data, so it covers the checks themselves rather than your new song. Use `npm run build` for that.

---

## 4. Editorial prose architecture

Every essay follows the same structure, which the scaffold writes for you:

1. **The song, in a minute.** The `summary` field, shown in the abstract callout.
2. **What Lies Beneath.** The underlying thesis, stripping away the surface production, ending with a pull quote.
3. **Following the Feeling.** The narrative and musical arc in three movements (`###` headings).
4. **Symbols & Metaphors.** A bulleted list of recurring motifs and what they do.
5. **An Alternative Reading.** One unconventional but plausible interpretation.
6. **The Aftertone.** The closing reflection on what lingers after the final chord.
