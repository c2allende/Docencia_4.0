const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'docencia-4.0', 'styles', 'main.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Sustituir tokens huérfanos
css = css.replace(/--color-text-body/g, '--color-text-secondary');
css = css.replace(/--color-surface-soft/g, '--color-background-surface-low');
css = css.replace(/--color-background-subtle/g, '--color-background-surface-low');
css = css.replace(/--font-family-code/g, '--font-family-body');
css = css.replace(/--color-background-base/g, '--color-white');
css = css.replace(/--radius-full/g, '--radius-pill');
css = css.replace(/--container-max-width/g, '--size-max-container');

// 2. Retirar concept-review y references-section de Componentes Reutilizables (líneas 5231-5246 aprox)
css = css.replace(/\.lesson-media-card,\s*\.concept-review,\s*\.checkpoint-card,\s*\.references-section\s*\{/g, '.lesson-media-card,\n.checkpoint-card {');

// 3. Añadir estilos base de la tarjeta a .concept-review en el bloque B1-B
// Buscar el inicio del bloque B1-B (línea 5539 "/* --- Summary principal")
css = css.replace(/\/\* --- Summary principal \(clickable header\) ---\ \*\//g, `.concept-review {
  background: var(--color-background-surface);
  border: var(--border-width-1) solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-flat);
}

/* --- Summary principal (clickable header) --- */`);

// 4. Migrar pseudo-elementos [open] y ::before al bloque B1-B (después de .concept-review__item)
css = css.replace(/\.concept-review__summary::-webkit-details-marker \{\s*display: none;\s*\}/g, `.concept-review__item[open] {
    border-color: var(--color-brand-primary);
}

.concept-review__summary::-webkit-details-marker {
    display: none;
}

.concept-review__summary::before {
    content: "▸";
    flex-shrink: 0;
    font-size: var(--font-size-xs);
    color: var(--color-text-disabled);
    transition: transform var(--motion-duration-instant);
}

.concept-review__item[open] > .concept-review__summary::before {
    transform: rotate(90deg);
}`);

// 5. Eliminar el bloque Alt E3 (desde /* === COMPONENT — CONCEPT REVIEW (Alt E3) === */ hasta /* === References Compact === */)
// El inicio es "/* ========================================================================== \n   COMPONENT — CONCEPT REVIEW (Alt E3)"
// El fin es "/* ==========================================================================\n   References Compact — Referencias"
const altE3StartIdx = css.indexOf('/* ==='); // Let's use regex to find the block
css = css.replace(/\/\* ==========================================================================\s*COMPONENT — CONCEPT REVIEW \(Alt E3\)(.|\n)*?(?=\/\* ==========================================================================\s*References Compact — Referencias)/, '');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Sanitation complete.');
