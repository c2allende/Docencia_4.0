---
name: ux-cognitive-load-edu-modules
description: Audit and reorganize long LMS pages for UX/UI, instructional design, and cognitive load reduction in the Docencia 4.0 project.
risk: low
source: local
date_added: 2026-05-14
---

# UX & Cognitive Load for Educational Modules

This skill is designed to audit and reorganize long pages within the Learning Management System (LMS) from a UX/UI, instructional design, and cognitive load theory perspective. It complements the `ui-ux-pedagogico-avanzado` skill by focusing on content structure, scannability, and information architecture.

## 🛑 Strict Project Rules (Docencia 4.0 DNA)

As an agent of Docencia 4.0, you **MUST** strictly obey these core principles:

1.  **Content Immutability**: Educational text, rubrics, and data are sacred. **DO NOT** summarize, reword, paraphrase, or interpret academic content. You are authorized to reorganize visually, but never to alter the pedagogical message.
2.  **"Human in the Loop"**: The cooperating teacher or human director is the final validator of any output or pedagogical sequence.
3.  **Design System Adherence**: Exclusively use established tokens (`var(--primary)`, `.glass`, `var(--radius-xl)`) from `main.css`. Never hardcode generic styles.
4.  **Bilingual Protocol**: Internal reasoning and code must be in English. User-facing text and LMS content must be in professional Spanish using institutional terminology (e.g., "modelos de lenguaje de gran tamaño").

## ⚖️ Skill Hierarchy

When working on Docencia 4.0 pages, apply this order of precedence:

1.  `main.css` is the primary visual source of truth.
2.  `ui-ux-pedagogico-avanzado` defines institutional identity, tokens, accessibility, and DUA.
3.  `ux-cognitive-load-edu-modules` is used for auditing cognitive load, scanning, chunking, and instructional structure.
4.  **Content Preservation**: In case of conflict between "chunking" and preserving content, **preservation of academic content always wins**.

## 📖 Operational Guidelines

### What you CAN do:
*   **Reorganize Visually**: Use grids, cards, or columns to distribute content.
*   **Divide Blocks**: Split long text blocks into logical subsections with informative headings.
*   **Progressive Disclosure**: Use accordions, tabs, or "Read more" links for secondary details or long citations.
*   **Improve Hierarchy**: Use clear visual levels: Title > Subtitle > Summary > Body > Support.
*   **Encapsulated CSS**: Propose local CSS namespaces in prototypes (e.g., `.leccion1-2-prototype`) to extend the design system without touching `main.css`.
*   **Adjust Rhythm**: Optimize image and interactive placement to improve the reading flow.

### What you CANNOT do (Strictly Forbidden):
*   **NO Summaries**: Do not summarize academic text.
*   **NO Deletion**: Do not remove citations, references, or bibliography.
*   **NO Modification**: Do not alter the dynamic glossary or knowledge checkpoints.
*   **NO Resizing/Altering Content**: Do not replace professional text with "shorter" versions without explicit approval.

## 🛠️ Audit Criteria & Policies

Interpret these as quality benchmarks, not mandates to delete content. If content is too long, use **segmentation** and **progressive disclosure**.

### Layout Policies
*   **Scannability**: Prioritize scanning over reading.
*   **Chunking**: Aim for one main idea per block/screen.
*   **Paragraphs**: Ideally max 5 lines (approx. 450 characters).
*   **Inverted Pyramid**: Start sections with a key takeaway or conclusion.

### Highlighting Rules
*   **Boldness**: Max 15% of visible text. Use for keywords and takeaways only.
*   **Callouts**: Use for definitions, reminders, or warnings (max 3 per screen).

### UI Patterns
*   **Summary + Detail**: Recommended for long articles (Summary block > Detail sections).
*   **Accordions**: Recommended for FAQs, secondary technical details, or long citations.
*   **Keyword-First Lists**: Structure sequences as `KEYWORD: Explanation`.

## 📋 QA Checklist

Every intervention must produce a QA report confirming:
1.  **No Production Modification**: Changes only applied to prototypes.
2.  **No `main.css` Modification**: Local CSS used only when authorized.
3.  **No Content Summarization**: Academic text preserved 100%.
4.  **Preservation**: Citations, references, glossary, and checkpoints remain intact.
5.  **Responsiveness**: Validated for Desktop, Tablet, and Mobile (no horizontal scroll).
6.  **Functional Integrity**: Zoom, interactives, and navigation buttons work correctly.

## 🖥️ Prototyping Rules

Always work on a prototype file:
*   `leccion1_2_ux_carga_cognitiva_prototype.html`
*   `actividad1_1_ux_carga_cognitiva_prototype.html`

Use a local CSS namespace:
```css
.leccionX-X-prototype .lesson-editorial-section { ... }
```
