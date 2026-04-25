---
name: web-artifacts-builder
description: Build elaborate, multi-component claude.ai HTML artifacts using React + TypeScript + Vite + Tailwind + shadcn/ui, aligned with the project's brand system. Use for complex artifacts requiring state management, routing, or shadcn/ui components — not for simple single-file HTML/JSX artifacts. For all visual design decisions (composition, motion, color emphasis, typographic register), defer to the `frontend-design` skill; this skill handles scaffolding, brand-system bootstrap, and bundling.
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder

To build powerful frontend claude.ai artifacts, follow these steps:

1. Initialize the frontend repo using `scripts/init-artifact.sh`
2. **Apply the brand system** (see Step 2) — required before any UI work
3. Develop your artifact, deferring all visual decisions to the `frontend-design` skill
4. Bundle all code into a single HTML file using `scripts/bundle-artifact.sh`
5. Display artifact to user
6. (Optional) Test the artifact

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Brand Alignment (Required)

This skill is **scaffolding and bundling** — it does not make design decisions. For all aesthetic choices (palette emphasis per section, typographic composition, motion, layout, register), follow the `frontend-design` skill. Its `tokens.css` is the source of truth for colors, typography, spacing, radii, and shadows.

The `init-artifact.sh` script ships shadcn's default theming (slate base color, neutral HSL variables, Inter as fallback font, 8px radius). **This conflicts with the brand system.** Step 2 below overrides that defaults so shadcn components inherit the brand instead of fighting it.

Do not skip Step 2. Skipping it produces output that looks generic-shadcn, not brand-aligned, even if `tokens.css` is imported.

## Quick Start

### Step 1: Initialize Project

```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

This creates a fully configured React + Vite project with Tailwind, 40+ shadcn/ui components, path aliases, and Parcel bundling. See script output for full inventory.

### Step 2: Apply Brand System (Required)

After init, apply the brand system. This step has four parts:

**2a. Drop in brand tokens**

Copy the project's `tokens.css` into `src/styles/tokens.css`, then import it in `src/main.tsx` *before* `index.css`:

```ts
import './styles/tokens.css'
import './index.css'
```

**2b. Map shadcn variables to brand colors**

shadcn's components consume HSL variables (`--primary`, `--background`, etc.) defined in `src/index.css`. Replace that file's `:root` block with the brand colors expressed in HSL (the format shadcn expects — three space-separated numbers, no `hsl()` wrapper):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Surfaces */
    --background: 210 60% 98%;        /* --surface #f6fafe */
    --foreground: 210 13% 11%;        /* --on-surface #171c1f */
    --card: 0 0% 100%;                /* --surface-container-lowest */
    --card-foreground: 210 13% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 13% 11%;

    /* Brand primary — teal */
    --primary: 194 100% 27%;          /* #006688 */
    --primary-foreground: 0 0% 100%;

    /* Brand secondary — used for surfaces, NOT for the main CTA.
       The salmon CTA lives on .btn-cta, not on shadcn's <Button variant="default">. */
    --secondary: 210 25% 94%;         /* surface-container */
    --secondary-foreground: 210 13% 11%;

    --muted: 210 25% 94%;
    --muted-foreground: 210 12% 39%;  /* --on-surface-variant */
    --accent: 17 100% 68%;            /* salmon #FF8D5C — for shadcn accent slots */
    --accent-foreground: 19 74% 25%;  /* --on-secondary-container */

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 210 16% 78%;            /* --outline-variant */
    --input: 210 16% 78%;
    --ring: 194 100% 50%;             /* --primary-container */

    --radius: 1.5rem;                 /* 24px — middle of the brand scale */
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
}
```

The brand's full radius scale (`--radius-lg` 32px, `--radius-xl` 48px, `--radius-full` pill) is still available via `tokens.css`. shadcn's `--radius` is set to 24px so its components feel pillowy enough to coexist, without locking everything to the largest brand radius.

**2c. Install brand fonts and extend Tailwind**

Plus Jakarta Sans + Manrope are imported through `tokens.css`'s `@import` of Google Fonts — no install needed. Extend `tailwind.config.js` to expose the brand fonts and any brand utilities the artifact will use frequently:

```js
// tailwind.config.js — inside theme.extend
fontFamily: {
  display: ['Plus Jakarta Sans', 'sans-serif'],
  body: ['Manrope', 'sans-serif'],
  sans: ['Manrope', 'sans-serif'], // override Tailwind default
},
borderRadius: {
  // keep shadcn's lg/md/sm derived from --radius
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)',
  // expose brand-specific radii
  'brand-lg': 'var(--radius-lg)',  // 32px — cards
  'brand-xl': 'var(--radius-xl)',  // 48px — hero/section
},
boxShadow: {
  ambient: 'var(--shadow-ambient)',
  'brand-md': 'var(--shadow-md)',
  'brand-lg': 'var(--shadow-lg)',
},
```

**2d. Update `components.json`**

Change `baseColor` so any future `npx shadcn add` doesn't pull slate:

```json
{ "tailwind": { "baseColor": "neutral", ... } }
```

After Step 2, shadcn's `<Button>`, `<Card>`, `<Dialog>`, etc. will render in brand teal/salmon/neutrals automatically. The brand utility classes from `tokens.css` (`.btn-cta`, `.card`, `.glass`, `.gradient-text`, etc.) are also available for non-shadcn elements.

### Step 3: Develop Your Artifact

For all visual design decisions, **follow the `frontend-design` skill**. Specifically:

- The salmon `.btn-cta` is the page's primary conversion button — not shadcn's `<Button variant="default">`, which is teal and structural.
- Pick one tonal register per artifact (editorial-quiet, confident-corporate, or warm-energetic) and commit.
- Use `font-display` Tailwind class for headings, default body inherits Manrope from the body rule.
- Heading color is `--on-primary-fixed` (dark navy), not the teal primary, so set `text-[color:var(--on-primary-fixed)]` or use a custom heading class.

Do not re-derive design choices in this skill — they live in `frontend-design`.

### Step 4: Bundle to Single HTML File

```bash
bash scripts/bundle-artifact.sh
```

This creates `bundle.html` — a self-contained artifact with all JavaScript, CSS, and dependencies inlined. The Google Fonts `@import` in `tokens.css` is preserved in the bundle and resolves at runtime.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:
- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 5: Share Artifact with User

Share the bundled HTML file in conversation with the user so they can view it as an artifact.

### Step 6: Testing/Visualizing the Artifact (Optional)

Only perform if necessary or requested. Use available tools (other Skills, Playwright, Puppeteer). Avoid testing upfront — it adds latency between request and visible artifact. Test later, after presenting, if requested or if issues arise.

## Anti-patterns to avoid

- Skipping Step 2 and trusting that importing `tokens.css` alone is enough — it isn't. shadcn components will still render in slate/neutral.
- Using `<Button variant="default">` for the main page CTA. The brand CTA is salmon and lives on `.btn-cta` (a non-shadcn class from `tokens.css`).
- Mixing the brand radius register inside a single section (sharp shadcn defaults next to 32–48px brand corners reads as broken).
- Re-introducing Inter, system fonts, or generic purple gradients — they conflict with the brand even if shadcn allows them.
- Treating this skill as a design guide. It is not. `frontend-design` is.

## Reference

- **frontend-design skill** — source of truth for all visual decisions
- **`tokens.css`** — brand colors, typography, spacing, radii, shadows, utility classes
- **shadcn/ui components**: https://ui.shadcn.com/docs/components