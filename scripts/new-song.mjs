#!/usr/bin/env node
// Scaffolds one song: the shared song file plus one draft article per language.
//   src/content/songs/<slug>.yaml          artist, genre, themes, links, status
//   src/content/articles/id/<slug>.mdx     Indonesian title, summary, sources, prose
//   src/content/articles/en/<slug>.mdx     English title, summary, sources, prose
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { genres, isValidGenre } from '../src/data/genres.ts';
import { themes, isValidTheme } from '../src/data/themes.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const usage = `
Usage:
  npm run new:song <slug> -- --title <title> --artist <artist> --genre <genre> --themes <a,b>

Required:
  --title <title>     Official song title
  --artist <artist>   Artist name
  --genre <genre>     One of: ${genres.map((g) => g.id).join(', ')}
  --themes <a,b>      Comma-separated, from: ${themes.map((t) => t.id).join(', ')}

Optional:
  --related <a,b>     Slugs of related songs
  --spotify <url>     --apple-music <url>     --youtube <url>
  --featured          Feature this song on the home page once published

`;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      title: { type: 'string' },
      artist: { type: 'string' },
      genre: { type: 'string' },
      themes: { type: 'string' },
      related: { type: 'string' },
      spotify: { type: 'string' },
      'apple-music': { type: 'string' },
      youtube: { type: 'string' },
      featured: { type: 'boolean', default: false },
    },
  });
} catch (error) {
  fail(`${error.message}\n${usage}`);
}

const { values, positionals } = parsed;
const slug = positionals[0];
if (!slug) {
  console.log(usage);
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  fail(`Slug "${slug}" must be lowercase-kebab-case (letters, digits and single dashes).`);
}

const missing = ['title', 'artist', 'genre', 'themes'].filter((key) => !values[key]);
if (missing.length > 0) {
  fail(`Missing ${missing.map((key) => `--${key}`).join(', ')}.\n${usage}`);
}

if (!isValidGenre(values.genre)) {
  fail(`Unknown genre "${values.genre}". Allowed: ${genres.map((g) => g.id).join(', ')}`);
}

const list = (value) => (value ?? '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
const songThemes = list(values.themes);
for (const theme of songThemes) {
  if (!isValidTheme(theme)) {
    fail(
      `Unknown theme "${theme}". Allowed: ${themes.map((t) => t.id).join(', ')}\n` +
        `To add it as a custom theme, run: npm run new:theme ${theme} -- --en "<English label>" --id "<Indonesian label>"`,
    );
  }
}

const songsDir = path.join(rootDir, 'src', 'content', 'songs');
const relatedSongs = list(values.related);
for (const related of relatedSongs) {
  if (!fs.existsSync(path.join(songsDir, `${related}.yaml`))) {
    fail(`Related song "${related}" does not exist (no src/content/songs/${related}.yaml).`);
  }
}

const listenLinks = { spotify: values.spotify, appleMusic: values['apple-music'], youtube: values.youtube };
for (const [name, url] of Object.entries(listenLinks)) {
  if (url && !URL.canParse(url)) fail(`--${name} must be a full URL, got "${url}".`);
}

const files = {
  song: path.join(songsDir, `${slug}.yaml`),
  id: path.join(rootDir, 'src', 'content', 'articles', 'id', `${slug}.mdx`),
  en: path.join(rootDir, 'src', 'content', 'articles', 'en', `${slug}.mdx`),
};
const existing = Object.values(files).filter((file) => fs.existsSync(file));
if (existing.length > 0) {
  fail(`Song "${slug}" already exists:\n${existing.map((file) => `  ${path.relative(rootDir, file)}`).join('\n')}`);
}

// JSON strings are valid YAML strings, which takes care of quotes and colons in titles.
const yamlString = (value) => JSON.stringify(value);
const yamlList = (items) => (items.length ? `\n${items.map((item) => `  - ${item}`).join('\n')}` : ' []');
const linkLines = Object.entries(listenLinks)
  .filter(([, url]) => url)
  .map(([name, url]) => `  ${name}: ${yamlString(url)}`);

const songYaml = `artist: ${yamlString(values.artist)}
genre: ${values.genre}
themes:${yamlList(songThemes)}
# Set to "published" and add publishedAt (YYYY-MM-DD) when both articles are written.
status: draft
featured: ${values.featured}
relatedSongs:${yamlList(relatedSongs)}
${linkLines.length ? `listenLinks:\n${linkLines.join('\n')}` : '# listenLinks:\n#   spotify: "https://open.spotify.com/track/..."\n#   youtube: "https://www.youtube.com/watch?v=..."'}
`;

const today = new Date().toISOString().slice(0, 10);

// Placeholders are in [square brackets]; the build refuses to publish while any remain.
const article = (text) => `---
title: ${yamlString(`${values.title}: ${text.headline}`)}
summary: ${yamlString(text.summary)}
# Sources for this language. Uncomment and fill in at least one before publishing.
sources: []
#  - label: ${yamlString(text.sourceLabel)}
#    url: "https://..."
#    publisher: "[Publisher]"
#    accessedAt: "${today}"
---

## What Lies Beneath — ${text.s1}

${text.s1Body}

> "${text.quote}"

## Following the Feeling — ${text.s2}

### 1. ${text.m1}
${text.m1Body}

### 2. ${text.m2}
${text.m2Body}

### 3. ${text.m3}
${text.m3Body}

## Symbols & Metaphors — ${text.s3}

- **${text.symbol1Label}:** ${text.symbol1}
- **${text.symbol2Label}:** ${text.symbol2}

## An Alternative Reading — ${text.s4}

${text.s4Body}

## The Aftertone — ${text.s5}

${text.s5Body}
`;

const idArticle = article({
  headline: '[Subjudul Esai Interpretasi]',
  summary: `[Intisari editorial 1-2 kalimat tentang ${values.title}.]`,
  sourceLabel: 'Kredit Lirik & Komposisi Resmi',
  s1: '[Subjudul Analisis Tema Utama]',
  s1Body: '[Paragraf pembuka: bedah apa yang sesungguhnya terjadi di balik aransemen dan melodi lagu ini.]',
  quote: '[Kalimat kunci yang merangkum tesis emosional utama artikel.]',
  s2: 'Mengikuti Arus Emosi',
  m1: '[Bagian Awal: Mengatur Suasana]',
  m1Body: '[Analisis bait awal, pengenalan narator, dan titik masuk emosional.]',
  m2: '[Bagian Tengah: Eskalasi & Turbulensi Batin]',
  m2Body: '[Analisis perkembangan ketegangan, pergulatan batin, atau pergeseran melodi.]',
  m3: '[Bagian Klimaks / Resolusi]',
  m3Body: '[Analisis reff/outro dan bagaimana konflik batin diselesaikan atau dibiarkan menggantung.]',
  s3: 'Simbolisme & Makna Figuratif',
  symbol1Label: '[Simbol 1]',
  symbol2Label: '[Simbol 2]',
  symbol1: '[Penjelasan simbol konkret dan fungsinya dalam narasi.]',
  symbol2: '[Penjelasan dimensi puitika atau elemen ruang/waktu.]',
  s4: 'Pembacaan Alternatif',
  s4Body: '[Sudut pandang alternatif: bagaimana lagu ini dapat dibaca di luar makna harfiahnya.]',
  s5: 'Gema yang Tersisa',
  s5Body: '[Refleksi penutup: pertanyaan emosional yang ditinggalkan lagu ini setelah nada terakhir memudar.]',
});

const enArticle = article({
  headline: '[Essay Headline]',
  summary: `[A 1-2 sentence editorial abstract about ${values.title}.]`,
  sourceLabel: 'Official Release Documentation',
  s1: '[Subtitle for the Core Thesis]',
  s1Body: "[Opening paragraphs: look past the production to the song's underlying emotional threshold.]",
  quote: "[A memorable line that states the song's central emotional truth.]",
  s2: 'Narrative & Musical Arc',
  m1: '[Movement I: Establishing the Atmosphere]',
  m1Body: "[The opening verses, the narrator's state of mind, and the emotional entry point.]",
  m2: '[Movement II: Inner Turbulence & Escalation]',
  m2Body: '[Harmonic tension, melodic shifts, and psychological conflict.]',
  m3: '[Movement III: Climax & Resolution]',
  m3Body: '[The chorus and outro, and whether the conflict resolves or is left hanging.]',
  s3: 'Figurative Anatomy',
  symbol1Label: '[Symbol 1]',
  symbol2Label: '[Symbol 2]',
  symbol1: '[A concrete motif and its function in the narrative.]',
  symbol2: '[An atmospheric or environmental metaphor.]',
  s4: 'The Lateral Perspective',
  s4Body: '[An unconventional angle: reading the song beyond its literal meaning.]',
  s5: 'What Remains',
  s5Body: '[Closing reflection: what stays with the listener after the final chord.]',
});

fs.mkdirSync(path.dirname(files.id), { recursive: true });
fs.mkdirSync(path.dirname(files.en), { recursive: true });
fs.mkdirSync(songsDir, { recursive: true });
fs.writeFileSync(files.song, songYaml, 'utf-8');
fs.writeFileSync(files.id, idArticle, 'utf-8');
fs.writeFileSync(files.en, enArticle, 'utf-8');

console.log(`
Created song "${slug}" as a draft:
  src/content/songs/${slug}.yaml        shared details (artist, genre, themes, links)
  src/content/articles/id/${slug}.mdx   Indonesian article
  src/content/articles/en/${slug}.mdx   English article

Next:
  1. Replace every [bracketed] placeholder in both articles and add their sources.
  2. Preview while writing: npm run dev, then open /id/songs/${slug}/ and /en/songs/${slug}/
  3. To publish, set status: published and publishedAt: ${today} in the song file, then run npm run build.
     The build lists anything still missing.
`);
