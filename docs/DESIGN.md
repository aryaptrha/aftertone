# aftertone — Design System & UI Specification

**File:** `docs/DESIGN.md`\
**Version:** 2.0 (Artistic Revamp)\
**Status:** Canonical Implementation Specification\
**Product:** aftertone — Cyber-Physical Liner Notes & Vinyl Sleeve Archive\
**Stack:** Astro, MDX, Cloudflare Pages, Cloudflare R2\
**Languages:** Indonesian (`id`) and English (`en`)

---

## 1. Vision & Purpose

### 1.1 Product direction: The Cyber-Physical Liner Notes Archive
**aftertone** is not a news website, a tech blog, or a generic content portal. It is an **artistic, cyber-physical music interpretation archive**—a tactile digital sanctuary exploring the emotional resonance, narrative symbolism, and psychological architecture behind songs across genres.

The interface evokes the sacred sensory experience of physical music media: unboxing a collector's Japanese gatefold vinyl record, sliding a minidisc cartridge from its translucent case, or unfolding textured album liner-notes booklets with stamped catalog numbers, lyric annotations, and intimate commentary.

It marries the liquid optimism, specular gloss, and iridescent light of **Frutiger Aero** with the precision typography, tactile mechanical rivets, and obi-strip editorial discipline of **Japanese graphic design and DORFic aesthetics**.

### 1.2 Anti-News Manifesto (What We Explicitly Ban)
To ensure aftertone never feels like a news site or mundane text blog:
1. **NO White Card Boxes on Gray Backgrounds:** Content must not live inside generic white floating rectangles with standard drop shadows.
2. **NO Predictable 12-Column Thumbnail Grids:** Music is sensory and rhythmic; collections must be presented through tactile "Crate Digging" sleeve racks, gatefold displays, or archival catalog matrices.
3. **NO Journalistic Bylines:** Eliminate standard news metadata strings (*"By Author • March 15, 2026 • 6 min read"*). Instead, metadata is stamped as archival catalog telemetry: Track matrix, catalog code (`AT-0026`), acoustic tone, and emotional frequency coordinates.
4. **NO Monolithic Single-Column Blog Posts:** Reading song interpretations must feel like exploring liner notes: a **Dual-Track layout** where lyrical excerpts, musical stems, and hermeneutic essays communicate side-by-side.
5. **NO Generic Top Sticky Navbars:** Replace the typical corporate navbar with an architectural **Japanese Obi-Spine / Tactile Dock**.

### 1.3 Core Design Principles
1. **Physicality in the Digital Medium:** Interfaces should feel tangible—gatefold sleeves that unfold, vinyl discs with grooves, tactile foil hot-stamps, and translucent frosted sleeves.
2. **Luminous Light, Specular Glass & Liquid Chrome:** Surfaces play with light refractions, iridescent gradient stops, top-edge specular highlights, and prismatic glass overlays.
3. **Dual-Track Editorial Hermeneutics:** Lyrics and interpretive prose are intimately intertwined, never separated into disconnected worlds.
4. **Archival Precision (DORFic Discipline):** Counterbalance dreamy Frutiger Aero atmospheres with micro-stamped serial numbers, catalog codes, and crisp monospace telemetry.
5. **Genre-Agnostic Emotional Truth:** The design system accommodates idol pop, ambient shoegaze, progressive rock, and classical without imposing single-genre stereotypes.
6. **Bilingual Parity:** Indonesian (`id`) and English (`en`) editions share identical artisanal craft, typography balance, and tactile depth.
7. **Static-First Engineering & Accessibility:** All rich tactile effects must be achieved via pure semantic HTML and high-performance CSS, maintaining WCAG 2.2 AA accessibility and instantaneous page loads.

---

## 2. Visual Identity & Design Tokens

### 2.1 Color Palette: Luminous Aqua & Amber Chrome
The atmospheric world is built upon aquatic light, iridescent cyan, and reflective glass, accented by warm amber and radiant persimmon action signals.

| Token | Hex Value | Role & Sensory Character |
|---|---|---|
| `--color-aqua-50` | `#EEFCFD` | Pale luminous tint, frosted glass backdrop |
| `--color-aqua-100` | `#DDF8FA` | Ethereal aqua surface, subtle paper sheen |
| `--color-aqua-200` | `#B8F0F4` | Specular gradient stop, liquid light highlight |
| `--color-aqua-300` | `#8BE8F2` | Radiant aqua atmosphere, atmospheric aura |
| `--color-aqua-500` | `#38C8D9` | High-vibrancy accent, jewel glass, disc rim |
| `--color-blue-700` | `#167DB5` | Deep cyan ink, interactive hover states |
| `--color-blue-900` | `#103B52` | Archival navy, primary display headings |
| `--color-amber-400`| `#FFA86A` | Warm tube-glow highlight, holographic shimmer |
| `--color-amber-500`| `#FF7B39` | Radiant action signal, obi-strip marker, record label dot |
| `--color-amber-700`| `#B83E14` | High-contrast persimmon text on light surfaces |
| `--color-mint-100` | `#DCF4EC` | Secondary chromatic refraction stop |
| `--color-canvas`   | `#F4F8F7` | Archival mist base (replaces sterile white/cloud) |
| `--color-sleeve`   | `#FFFFFF` | Gatefold sleeve surface with subtle inner bevel |
| `--color-sleeve-sub`| `#EDF5F5`| Recessed cartridge bay, unexposed liner surface |
| `--color-ink`      | `#1D2F3B` | High-legibility deep petrol ink for prose |
| `--color-ink-muted`| `#526A7A` | Archival metadata, annotations, lyrical stems |
| `--color-border`   | `#D0E2E5` | Fine sleeve border, physical die-cut line |
| `--color-groove`   | `rgb(16 59 82 / 8%)` | Concentric vinyl record groove lines |
| `--color-focus`    | `#0F74E0` | Visible accessible focus indicator ring |

### 2.2 Typography: The Tri-System Harmony
To escape the monotony of standard corporate websites, aftertone pairs three distinct typographic voices:

1. **Display & Expressive Titles:** Sculptural, high-character humanist/geometric sans-serif (`"Plus Jakarta Sans"`, `"Outfit"`, or fallback `"Source Sans 3"`, `system-ui`) with tight tracking and optical elegance.
2. **Archival Telemetry & Metadata:** Tactile technical monospace (`"JetBrains Mono"`, `"SF Mono"`, `"Consolas"`, `monospace`) used for catalog codes (`[AT-0026]`), timecodes, BPM/key, and track indexes.
3. **Hermeneutic Reading Prose:** Warm, legible humanist body typeface (`"Source Sans 3"`, `"Segoe UI"`, `sans-serif`) with generous line-height (`1.75`) for contemplative long-form reading.

### 2.3 CSS Tokens (`src/styles/tokens.css`)

```css
:root {
  color-scheme: light;

  /* Color Scale */
  --color-aqua-50: #EEFCFD;
  --color-aqua-100: #DDF8FA;
  --color-aqua-200: #B8F0F4;
  --color-aqua-300: #8BE8F2;
  --color-aqua-500: #38C8D9;
  --color-blue-700: #167DB5;
  --color-blue-900: #103B52;
  --color-amber-400: #FFA86A;
  --color-amber-500: #FF7B39;
  --color-amber-700: #B83E14;
  --color-mint-100: #DCF4EC;
  --color-canvas: #F4F8F7;
  --color-sleeve: #FFFFFF;
  --color-sleeve-sub: #EDF5F5;
  --color-ink: #1D2F3B;
  --color-ink-muted: #526A7A;
  --color-border: #D0E2E5;
  --color-groove: rgb(16 59 82 / 7%);
  --color-focus: #0F74E0;

  /* Typography Stacks */
  --font-display: "Plus Jakarta Sans", "Source Sans 3", -apple-system, sans-serif;
  --font-prose: "Source Sans 3", "Segoe UI", -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Consolas, monospace;

  /* Type Scale */
  --text-2xs: 0.6875rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-2xl: clamp(1.75rem, 3.2vw, 2.75rem);
  --text-3xl: clamp(2.5rem, 5.5vw, 4.5rem);

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Tactile Physical Geometry (Sharp precision with subtle die-cut radius) */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 18px;
  --radius-disc: 50%;

  /* Tactile Physical Media Shadows & Insets */
  --shadow-sleeve:
    0 16px 36px -8px rgb(16 59 82 / 12%),
    0 4px 12px rgb(16 59 82 / 6%),
    inset 0 1px 0 rgb(255 255 255 / 90%);
  --shadow-gatefold-hover:
    0 24px 48px -12px rgb(16 59 82 / 18%),
    0 6px 16px rgb(56 200 217 / 15%),
    inset 0 1px 0 rgb(255 255 255 / 100%);
  --shadow-pressed:
    inset 0 2px 6px rgb(16 59 82 / 14%),
    0 1px 2px rgb(255 255 255 / 80%);
  --shadow-foil:
    0 0 20px rgb(56 200 217 / 35%),
    inset 0 1px 1px rgb(255 255 255 / 90%);

  /* Layout Metrics */
  --content-width: 76rem;
  --dual-track-width: 72rem;
  --obi-width: 5rem;
  --reading-width: 42rem;
  --page-gutter: clamp(1rem, 3.5vw, 2.5rem);

  /* Transitions */
  --ease-tactile: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-fast: 160ms;
  --motion-normal: 280ms;
  --motion-slow: 480ms;
}
```

---

## 3. Tactile Materiality & Physical Media Metaphors

### 3.1 The Gatefold Sleeve & Pull-Out Vinyl
Cards in aftertone represent physical 12-inch vinyl or 7-inch mini-disc sleeves:
- **Outer Jacket Surface:** Gloss-laminated card stock with subtle die-cut border radius (`--radius-md`), a hairline border (`1px solid var(--color-border)`), and top-edge specular illumination.
- **The Slide-Out Disc / Soundplate:** On hover or focus, a concentric-grooved acrylic vinyl disc or holographic cartridge emerges subtly from the right spine of the sleeve.
- **Archival Catalog Stamp:** Every release features an archival catalog serial stamp (e.g., `[AT-001]`), release matrix code, and language parity badge (`ID / EN`).

### 3.2 Holographic Foil & Specular Glass
- **Prismatic Foil Effect:** Primary CTAs and featured edition stamps feature a subtle linear gradient simulating holographic foil hot-stamping:
  ```css
  background:
    linear-gradient(135deg,
      rgb(255 255 255 / 95%) 0%,
      rgb(184 240 244 / 70%) 35%,
      rgb(255 168 106 / 60%) 70%,
      rgb(255 255 255 / 90%) 100%);
  ```
- **Specular Top Highlight:** All tactile controls and panels incorporate an inner 1px white highlight (`inset 0 1px 0 rgb(255 255 255 / 85%)`), evoking precision molded acrylic or glossy lacquer.

### 3.3 Concentric Grooves & Vinyl Lathe Aesthetics
- Soundplates, visual headers, and decorative medallions render micro-fine concentric circles representing vinyl micro-grooves (`repeating-radial-gradient`), signaling music at first glance without relying on clichéd note icons.

---

## 4. Architectural Shell & Navigation: The Obi-Spine

### 4.1 Concept: Japanese Obi-Strip Navigation
Instead of a horizontal corporate navigation bar sitting across the top of the viewport, aftertone uses an **Obi-Spine Dock**:

```
+------------------------------------------------------------------------+
| [OBI-SPINE]  |  [MAIN ARCHIVAL STAGE]                                  |
|              |                                                         |
|  アフター    |  HERO SOUNDPLATE                                        |
|  トーン      |  Asymmetric interactive turntable / cartridge           |
|              |                                                         |
|  aftertone   |  GATEFOLD FEATURE STAGE                                 |
|  CAT: AT-26  |  Open double-sleeve album exhibition                    |
|              |                                                         |
|  [01] VAULT  |  CRATE DIGGING ARCHIVE                                  |
|  [02] LINER  |  Tactile vinyl sleeve racks with slide-out stems        |
|  [03] ABOUT  |                                                         |
|              |  EMOTIONAL FREQUENCY MATRIX                             |
|  [ID | EN]   |  Chromatic mood tuner with resonance bars               |
|              |                                                         |
+------------------------------------------------------------------------+
```

### 4.2 Desktop Obi-Spine
- Positioned vertically on the left flank (or floating tactile rail on wider viewports).
- Displays vertical Japanese typography (`アフタートーン`), Latin logotype (`aftertone`), active catalog issue number (`ISSUE #04`), tactile rivets, navigation tabs with mono numbers (`01 // ARCHIVE`, `02 // EXPLORE`, `03 // ABOUT`), and a physical toggle switch for language (`ID / EN`).
- Remains accessible, keyboard navigable, and sticky as the user navigates the archive.

### 4.3 Mobile Sound-Console Dock
- On mobile viewports (`< 768px`), the Obi-Spine transforms into a floating physical bottom console dock:
  - Textured matte/gloss bar resting at bottom with touch-friendly hardware buttons.
  - Quick-switch tabs for Archive, Explore, Language, and Audio player controls.

---

## 5. Page Specifications

### 5.1 Home: The Curated Sound Exhibition (`/[lang]/`)

#### Goal
Engage the visitor not as an internet browser skimming headlines, but as a music connoisseur stepping into a rare audio archive and private listening room.

#### Structural Breakdown:
1. **The Asymmetric Soundplate Hero:**
   - **No standard text headline + button duo.**
   - Left side: Large expressive typographic identity stating the editorial thesis, accompanied by mono telemetry (`ARCHIVAL FREQUENCY // 432Hz EST. 2026`).
   - Right side: A 3D-feeling interactive **Soundplate Disc**—a tactile acrylic vinyl record with rotating grooves, album label center (`aftertone / TOKYO - JAKARTA`), and illuminated tone-arm indicator.
2. **The Gatefold Feature Stage:**
   - Features the primary featured interpretation inside an **open double-gatefold vinyl jacket**.
   - Left Panel: High-resolution artwork framed like a collector's album cover with holographic foil finish and catalog stamping.
   - Right Panel: The "Liner Insert"—song breakdown, key symbols, emotional thesis, and a direct "Open Liner Notes" tactile lever.
3. **The Crate-Digging Sleeve Rack (Recent Interpretations):**
   - Replaces the 2-column news grid.
   - Designed like a record store collector's crate or gallery exhibition rack: overlapping physical album sleeves with spine labels, release dates in stamp form, and interactive slide-out vinyl discs revealing the interpretation summary.
4. **The Emotional Frequency Matrix (Theme Explorer):**
   - Replaces the generic tag-cloud pills.
   - Presented as a **Chromatic Mood Tuner / Acoustic Spectrum**:
     - Visual spectrum bars ranging across emotions (e.g. `[480nm // LIMINAL NOSTALGIA]`, `[520nm // ELECTRIC DESIRE]`, `[610nm // EXISTENTIAL THAW]`).
     - Clicking a frequency filters the archive dynamically.
5. **The Archival Plaque (Manifesto):**
   - Presented as an engraved metallic or frosted acrylic studio badge, explaining aftertone’s dedication to song hermeneutics and slow listening.

---

### 5.2 Explore: The Physical Media Vault (`/[lang]/explore/`)

#### Goal
Provide a fast, tactile browsing experience that feels like flipping through a pristine vinyl archive rather than querying an e-commerce or news database.

#### Key Patterns:
1. **The Vault Control Deck:**
   - Search input styled like an archival matrix scanner with monospace cursor, clear button, and catalog query counter.
   - Filter switches styled as tactile hardware toggles (`[ALL]`, `[IDOL]`, `[INDIE]`, `[ROCK]`, `[AMBIENT]`).
2. **Dual Archive Views:**
   - **Crate View (Default):** Tactile vinyl/cartridge grid where cards have physical sleeve thickness, disc pull-outs, and fold-out summary sheets.
   - **Liner Index View:** Dense, high-fashion typographic index table featuring catalog numbers, artist, title, emotional frequency, and language indicator.
3. **Empty / Filter State:**
   - Displays a tactile "Empty Vinyl Sleeve" with an intuitive "Reset Archival Filters" lever.

---

### 5.3 Song Detail: The Dual-Track Liner-Notes (`/[lang]/songs/[slug]/`)

#### Goal
Completely banish the "blog post in a white box". Song interpretation is a deep dialogue between the song's musical/lyrical anatomy and the author's philosophical dissection.

#### The Dual-Track Architecture:

```
+------------------------------------------------------------------------+
| [BREADCRUMB CATALOG STAMP]                                             |
|                                                                        |
| +-----------------------------+  +-----------------------------------+ |
| | TRACK A: THE ANATOMICAL STEM|  | TRACK B: THE HERMENEUTIC ESSAY    | |
| | (Sticky Architectural Deck) |  | (Flowing Interpretive Prose)      | |
| |                             |  |                                   | |
| | • Revolving Soundplate      |  | § 01. The Tremor on the Branch   | |
| | • Catalog: AT-001           |  |      In-depth narrative analysis  | |
| | • Audio Stems & Motifs      |  |      unfolding with literary      | |
| | • Key Lyric Highlights:     |  |      depth...                     | |
| |   "The instant first love   |  |                                   | |
| |    alights is never..."     |  | § 02. Following the Feeling       | |
| | • Streaming Turntable Links |  |      The Emotional Arc...         | |
| |   [Spotify] [Apple] [YT]    |  |                                   | |
| | • Emotional Frequency Meter |  | § 03. Figurative Anatomy          | |
| +-----------------------------+  +-----------------------------------+ |
|                                                                        |
| [ARCHIVAL SOURCES & ATTRIBUTION STAMP]                                 |
| [RELATED SLEEVES]                                                      |
+------------------------------------------------------------------------+
```

#### Detailed Components:
1. **Track A (Anatomical Stem / Sticky Left Column):**
   - **Soundplate Disc:** Concentric-grooved vinyl disc with album artwork label.
   - **Anatomical Metadata Stamp:** Catalog number, key signature, tempo, release year, genre matrix.
   - **Lyric Stem Callouts:** Floating lyric quotes that light up or anchor to corresponding essay sections.
   - **Streaming Turntable Links:** Tactile pill levers connecting to Spotify, Apple Music, and YouTube.
2. **Track B (Hermeneutic Prose / Flowing Right Column):**
   - Printed on an archival paper surface with fine vertical margins.
   - Headings styled with section numbers (`§ 01`, `§ 02`) in mono telemetry.
   - **Tactile Marginalia:** Quotes and notes appear as stamped tabs or side annotations, not generic blockquotes.
3. **Archival Sources & Colophon:**
   - Styled as an authentic record release colophon (credits, lyricist, arranger, analytical sources) with verification stamps.

---

### 5.4 About & Manifesto: The Studio Colophon (`/[lang]/about/`)
- Styled like the colophon and technical blueprint of an independent record pressing lab and translation studio.
- Explains the hermeneutic method: how songs are selected, translated with poetic parity between Indonesian and English, and analyzed through cultural symbolism.

---

## 6. Component Inventory

| Component | File Path | New Artistic Identity |
|---|---|---|
| `ObiDock.astro` | `src/components/layout/ObiDock.astro` | Replaces `SiteHeader.astro`. Japanese Obi-strip spine navigation with vertical typography, catalog stamps, and language toggle switch. |
| `Soundplate.astro` | `src/components/song/Soundplate.astro` | Concentric-grooved vinyl record / acrylic disc with revolving label and specular glow. |
| `SleeveCard.astro` | `src/components/song/SleeveCard.astro` | Replaces `SongCard.astro`. Gatefold album sleeve with slide-out vinyl disc and stamped catalog metadata. |
| `GatefoldFeature.astro` | `src/components/song/GatefoldFeature.astro` | Replaces `FeaturedSongCard.astro`. Unfolded double-panel album exhibition with liner notes summary. |
| `DualTrackLayout.astro` | `src/layouts/DualTrackLayout.astro` | Replaces `ArticleLayout.astro`. Side-by-side stem & prose liner-notes reading architecture. |
| `FrequencyTuner.astro` | `src/components/ui/FrequencyTuner.astro` | Replaces generic theme pill tags with chromatic mood spectrum bars. |
| `TactileButton.astro` | `src/components/ui/TactileButton.astro` | Clean, sharp, minimalist tactile button system without glow or shimmer. |
| `ArchivalStamp.astro` | `src/components/ui/ArchivalStamp.astro` | Micro-stamped catalog codes (`[AT-0026]`) and technical telemetry markers. |
| `MarginaliaNote.astro`| `src/components/song/MarginaliaNote.astro`| Tactile margin note tab for quotes and figurative symbolism. |

---

## 7. Motion & Interaction Design: GSAP Kinetic Choreography

To ensure aftertone feels vibrant, organic, and deeply **ALIVE**—like an active listening room or high-end sound apparatus—the interface incorporates a progressive, GSAP-powered kinetic choreography system.

### 7.1 Motion Philosophy: Organic Mechanical Resonance
1. **Physical Inertia & Elasticity:** Hover states and transitions do not feel like digital easing curves; they carry subtle momentum, reminiscent of sliding heavy vinyl cardstock or releasing an analog damping mechanism (`power2.out` or `elastic.out(1, 0.75)`).
2. **Ambient Living Atmosphere:** The interface is never static. Vinyl soundplates rotate with gentle ambient RPM, background chromatic gradients breathe with low-frequency oscillation, and light refractions glide over surfaces.
3. **Scroll-Responsive Telemetry:** As the reader scrolls through an essay, the interface acts as a living playback machine: the turntable tone-arm tracks reading progress, and lyrical stems illuminate in synchronization with the analysis.

### 7.2 GSAP Kinetic System Architecture

#### 1. 3D Sleeve Magnetic Tilt & Specular Sweep
- Every `SleeveCard` and `GatefoldFeature` calculates mouse coordinates on hover.
- Using `gsap.quickTo()`, the sleeve subtly tilts in 3D perspective (`rotateX`, `rotateY`, `transformPerspective: 1000`) up to ±6 degrees.
- A specular holographic foil sheen follows the cursor angle across the sleeve laminate.

#### 2. Soundplate Turntable Physics (33⅓ RPM)
- The concentric-grooved vinyl `Soundplate` revolves continuously with a slow, hypnotic ambient rotation (45s per full loop, `ease: "none"`).
- On card hover or playback interaction, the disc accelerates smoothly to standard speed (12s per loop) while the tone-arm indicator pivots into groove contact (`rotate: 18deg`).

#### 3. Dual-Track ScrollTrigger Reading Needle
- On song interpretation pages, GSAP `ScrollTrigger` tracks the reader's scroll position down Track B (the hermeneutic prose).
- A micro-needle on Track A (the anatomical stem) moves down the track timecode, highlighting active musical themes and illuminating corresponding lyric excerpts as their discussion enters the viewport.

#### 4. Kinetic Typography Entrance
- Major section headings and hero thesis statements reveal through a staggered word/line mask reveal (`yPercent: 100` to `0`, `stagger: 0.04`, `ease: "power3.out"`), lending high-editorial gravitas.

### 7.3 Motion Tokens & Easing Curves
- `--motion-instant`: `120ms` (switches, tactile rivets)
- `--motion-fast`: `240ms` (button presses, hover foil shimmer)
- `--motion-normal`: `400ms` (sleeve slide-out, gatefold expand)
- `--motion-slow`: `800ms` (turntable acceleration, mood transitions)
- GSAP Default Easing: `power2.out` (tactile release)
- GSAP Elastic Easing: `elastic.out(1, 0.8)` (cartridge snap)

### 7.4 Accessibility & Reduced Motion (`prefers-reduced-motion`)
All GSAP timelines are wrapped inside `gsap.matchMedia()`:
```javascript
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  // Disable 3D tilt, rotations, and transform parallax
  // Maintain subtle opacity cross-fades only
});
```
The site remains fully functional, legible, and visually balanced even if JavaScript fails to load or motion is disabled.

---

## 8. Accessibility (WCAG 2.2 AA)

Even the most avant-garde, anti-mainstream UI must remain fully accessible:
1. **Contrast Standards:** Every text element must meet or exceed WCAG 2.2 AA (4.5:1 for body copy, 3:1 for large display text).
2. **Screen Reader Landmarks:** Full semantic structure (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`) regardless of visual layout positioning.
3. **Keyboard Operability:** The Obi-Spine, sleeve cards, and audio controls must feature prominent `:focus-visible` styling (`outline: 2px solid var(--color-focus); outline-offset: 3px`).
4. **Decorative Art Handling:** All decorative vinyl grooves, floating orbs, and specular overlays must be strictly `aria-hidden="true"`.

---

## 9. Performance & Static Architecture

1. **Static-First Delivery:** Zero client JavaScript frameworks. All layouts, sleeves, and typographic scales are computed at build time by Astro.
2. **Pure CSS Tactile Effects:** Vinyl grooves, holographic foil shimmers, and specular highlights use pure CSS gradients—zero heavy image textures or 3D canvas libraries.
3. **Cloudflare R2 for Album Artwork:** High-resolution album cover imagery is served optimized in WebP/AVIF format with explicit dimensions to ensure zero Cumulative Layout Shift (CLS = 0).

---

## 10. The Cardinal Rule of aftertone

> **"If it looks like a news website, a tech blog, or a generic content management feed, it does not belong in aftertone."**
>
> aftertone is a tactile digital music archive. Every page is a physical record unboxed, every essay is an intimate liner note unfolded, and every interaction carries the sensory weight of music discovery.
