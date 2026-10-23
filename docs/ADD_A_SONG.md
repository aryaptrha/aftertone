# Add a Song

A simple, step-by-step guide to adding a song to aftertone.

---

## Step 1: Make the files

Run this command, replacing each `<...>` with your own words:

```bash
npm run new:song <slug> -- --title "<Song title>" --artist "<Artist>" --genre <genre> --themes <theme>,<theme>
```

- **`<slug>`** is the song's nickname. Use lowercase letters and dashes only. It becomes the web address.
- **`--genre`** must be one of: `idol-pop`, `j-pop`, `indie`, `rock`, `r-and-b`, `city-pop`, `electronic`.
- **`--themes`** is one or more of: `first-love`, `longing`, `memory`, `identity`, `letting-go`, `grief`, `hope`, `self-discovery`, `distance`, `belonging`. Separate them with commas and no spaces.

Need a theme that isn't on the list? Add it first, giving it an English and an Indonesian label:

```bash
npm run new:theme <theme-id> -- --en "<English label>" --id "<Indonesian label>"
```

After that you can use `<theme-id>` in `--themes` like any other theme.

The command creates three files:

| File | What it holds |
|---|---|
| `src/content/songs/<slug>.yaml` | The facts about the song |
| `src/content/articles/id/<slug>.mdx` | The Indonesian essay |
| `src/content/articles/en/<slug>.mdx` | The English essay |

---

## Step 2: Fill in the blanks

Open the two essay files. Replace everything inside `[square brackets]` with your own writing.

Add at least one real source link in each essay. Use the commented source template in the file: remove the `#` in front of the lines and fill them in.

To preview your work while you write, run:

```bash
npm run dev
```

Then open:

- `/id/songs/<slug>/` for the Indonesian essay
- `/en/songs/<slug>/` for the English essay

---

## Step 3: Publish

Open `src/content/songs/<slug>.yaml` and change these two lines:

```yaml
status: published
publishedAt: YYYY-MM-DD
```

Use today's date for `publishedAt`, in `YYYY-MM-DD` format.

Then run:

```bash
npm run build
```

If something is still missing, the build lists it and tells you which file to fix. When the build succeeds, the song is live.

---

## Rules to remember

- **Write both languages.** A published song needs both the Indonesian and the English essay.
- **Remove every `[bracket]`.** A published song cannot contain placeholder text.
- **Use real sources only.** Placeholder links fail the build.
- **Only one featured song.** Set `featured: true` on at most one published song. It appears on the home page.
- **Drafts are safe.** A song stays a draft until you set `status: published`. Drafts show up in `npm run dev` but never in a build.
