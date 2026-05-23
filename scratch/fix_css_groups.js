const fs = require('fs');
let css = fs.readFileSync('docencia-4.0/styles/main.css', 'utf8');

css = css.replace(/\.lesson-summary-card,\s*\.lesson-core-callout\s*\{\s*border-left:\s*var\(--border-width-6\)\s*solid\s*var\(--color-brand-secondary\);\s*\}/, 
`.lesson-summary-card {
  border-left: var(--border-width-6) solid var(--color-brand-primary);
}

.lesson-core-callout {
  border-left: var(--border-width-6) solid var(--color-brand-secondary);
}`);

fs.writeFileSync('docencia-4.0/styles/main.css', css, 'utf8');
console.log('Fixed grouped rules');
