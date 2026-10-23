#!/usr/bin/env node
// Registers a custom theme in src/data/themes.ts, the single list of allowed themes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { themes, isValidTheme } from '../src/data/themes.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themesFile = path.join(rootDir, 'src', 'data', 'themes.ts');

const usage = `
Usage:
  npm run new:theme <theme-id> -- [--en <English label>] [--id <Indonesian label>]

  <theme-id>   lowercase-kebab-case, used in song files (themes: [<theme-id>])
  --en         English label; defaults to the theme id in Title Case
  --id         Indonesian label; defaults to the English label

Existing themes: ${themes.map((t) => t.id).join(', ')}
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
      en: { type: 'string' },
      id: { type: 'string' },
    },
  });
} catch (error) {
  fail(`${error.message}\n${usage}`);
}

const { values, positionals } = parsed;
const themeId = positionals[0]?.trim().toLowerCase();
if (!themeId) {
  console.log(usage);
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(themeId)) {
  fail(`Theme "${themeId}" must be lowercase-kebab-case (letters, digits and single dashes).`);
}
if (isValidTheme(themeId)) {
  fail(`Theme "${themeId}" already exists.`);
}

const titleCase = themeId.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
const enLabel = values.en?.trim() || titleCase;
const idLabel = values.id?.trim() || enLabel;

const quote = (value) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const entry = `  { id: ${quote(themeId)}, label: { id: ${quote(idLabel)}, en: ${quote(enLabel)} } },\n`;

const source = fs.readFileSync(themesFile, 'utf-8');
const listEnd = source.indexOf('] as const;', source.indexOf('export const themes = ['));
if (listEnd === -1) {
  fail('Could not find the themes list in src/data/themes.ts.');
}
fs.writeFileSync(themesFile, source.slice(0, listEnd) + entry + source.slice(listEnd), 'utf-8');

console.log(`
Added theme "${themeId}" to src/data/themes.ts:
  English label:    ${enLabel}
  Indonesian label: ${idLabel}${values.id ? '' : '   (same as English; pass --id to translate it)'}

Use it in a song:
  npm run new:song <slug> -- ... --themes ${themeId}
or add "- ${themeId}" under themes: in an existing src/content/songs/<slug>.yaml
`);
