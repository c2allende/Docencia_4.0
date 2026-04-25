---
name: frontend-design
description: Create distinctive, production-grade web pages aligned with the established brand system (teal/salmon/amber palette, Plus Jakarta Sans + Manrope typography). Use this skill when the user asks to build a website, landing page, marketing page, portfolio, or any full-page web interface. Covers HTML/CSS/JS and React-based pages. Generates creative, polished code that respects the brand tokens defined in `tokens.css` while avoiding generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade web pages that respect the established brand system while avoiding generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides web page requirements: a landing page, marketing page, portfolio, documentation page, or other full-page interface to build. They may include context about the purpose, audience, or technical constraints.

## Brand System (Required)

The project has an established design system. **Always import `tokens.css` and use the design tokens — do not invent new colors, fonts, radii, or shadows.** Creativity lives in *composition, motion, layout, and detail* — not in replacing the brand.

## Design Thinking

Before coding, decide what this specific page brings to the brand. The system is fixed; the *expression* is not.

- **Purpose**: What is this page for? Who lands here, and what should they do, feel, or remember when they leave?
- **Tonal register within the brand**: The brand can flex — *editorial-quiet* (lots of white, large Plus Jakarta headings, restrained use of teal), *confident-corporate* (teal-dominant, structured grid), or *warm-energetic* (salmon/amber forward, gradients, motion). Pick one register per page and commit.
- **Constraints**: Framework, performance budget, accessibility (WCAG AA contrast — verify combinations like teal on white and salmon on white), responsive breakpoints, SEO, browser support.
- **Differentiation**: What is the one moment, image, or interaction someone will describe to a friend? Within a fixed brand, the memorable moment usually comes from *composition or motion*, not color novelty.

**CRITICAL**: Within the brand system, intentionality is everything. A page with three sections each shouting in a different brand color reads as a template; a page that lets one color dominate and uses the others as punctuation reads as designed.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional across modern browsers
- Visually striking and memorable within brand constraints
- Cohesive from hero to footer
- Responsive across breakpoints without losing personality
- Semantically correct (proper landmarks, heading hierarchy, alt text)
- Meticulously refined in every detail

## Page Architecture

A web page is a journey, not a collection of sections.

- **Above the fold**: Communicate the core idea instantly. Avoid the generic "headline + subheadline + CTA on white" template. The hero is the brand's strongest statement — use `--gradient-primary` backdrops, oversized Plus Jakarta display type, asymmetric composition, or a single salmon CTA against a teal field.
- **Scroll rhythm**: Vary section heights, density, and surface color so scrolling feels composed, not list-like. Alternate `--surface` → `--surface-container-low` → `--surface-container` → a full-bleed primary section. Heavy → light → dense → spacious.
- **Transitions between sections**: Avoid hard horizontal lines between every section. Use color shifts within the brand surfaces, overlapping cards (`--shadow-ambient`), large rounded section corners (`--radius-xl`), or full-bleed imagery to make sections feel connected.
- **CTA placement**: The salmon `.btn-cta` is the page's primary action. Use it once or twice per page max — its power comes from scarcity. Secondary actions use `.btn-outlined` or `.btn-secondary`.
- **Footer**: Treat the footer as the last impression. It can sit on a deep navy/teal field with white type, or a quiet white field with a single brand accent — but it should not feel like a dump.

## Frontend Aesthetics Guidelines

Within the brand system, focus on:

- **Typography expression**: With fonts fixed, *typographic composition* is where personality lives. Oversized Plus Jakarta headings that crop at the edge, mixed weights within a single phrase (e.g., 800 + 600 italic), tight kerning on displays, generous tracking on small caps labels, vertical or rotated type for section markers. Treat headings as design elements, not just text.
- **Color as composition**: Dominant color per section, not balanced. A teal-dominant hero followed by a near-white content section followed by an amber-warm closing band reads as designed. Three sections each using teal + salmon + amber equally reads as a swatch demo.
- **Motion**: Prioritize CSS-only solutions for HTML; use the Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions. Use scroll-triggering (IntersectionObserver, `scroll-timeline`) and hover states that surprise. Use `--ease-spring` on the CTA hover for a small, deliberate overshoot.
- **Spatial composition**: Asymmetry. Overlap. Diagonal flow. Grid-breaking elements that escape their container. Generous negative space on editorial pages, controlled density on dashboard-like pages. Use the `--radius-xl` corners on full-bleed sections to create the system's signature soft-geometric feel.
- **Backgrounds & visual details**: The brand's `--gradient-primary` and `--gradient-hero` are atmospheric — use them for hero backdrops, not button fills. Layer subtle noise textures, soft tinted shadows (already encoded in the shadow tokens), `.glass` overlays on top of gradient sections, and decorative geometric shapes in `--primary-container` or `--tertiary` at low opacity.
- **Responsive behavior**: Mobile is not a fallback. Decide deliberately what scales, what reflows, what disappears, and what gets *replaced* on smaller viewports. Display headings should usually shrink one or two steps in the scale (e.g., `--text-5xl` → `--text-3xl`) rather than wrapping awkwardly.

## What to avoid

- Inventing colors, fonts, radii, or shadows outside the token system.
- Using teal `.btn-primary` as the main conversion CTA when the salmon `.btn-cta` exists for that purpose.
- Stacking multiple gradients or all three brand colors at full saturation in the same viewport.
- Generic AI patterns: purple gradients (the brand has its own identity), centered hero with three feature cards below, "trusted by" logo strip as second section, identical card grids repeated for every content type.
- Sharp 4–8px radii on cards mixed with 32–48px radii elsewhere — pick a radius register per section and stay there.
- Body copy in the display font, or headings in Manrope. The pairing is the voice; swapping it breaks it.

**IMPORTANT**: Match implementation complexity to the page's tonal register. Editorial-quiet pages need restraint, precision, and attention to spacing and typographic detail. Warm-energetic pages need elaborate motion, layered backgrounds, and visible craft. Both must respect the same tokens.

Remember: Claude is capable of extraordinary creative work. The brand system is a constraint, not a ceiling. Don't hold back — show what can truly be created when committing fully to a distinctive vision *within* a coherent identity.