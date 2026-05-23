const fs = require('fs');

let css = fs.readFileSync('docencia-4.0/styles/main.css', 'utf8');

// Fix border colors for .lesson-core-callout
css = css.replace(/\.lesson-core-callout\s*\{\s*border-left:\s*var\(--border-width-6\)\s*solid\s*var\(--color-brand-primary\);\s*\}/g, 
`.lesson-core-callout {
  border-left: var(--border-width-6) solid var(--color-brand-secondary);
}`);

// Fix grouped border color definitions
css = css.replace(/\.lesson-core-callout,\s*\.lesson-remember-card\s*\{\s*border-left:\s*var\(--border-width-6\)\s*solid\s*var\(--color-brand-primary\);\s*\}/g,
`.lesson-remember-card {
    border-left: var(--border-width-6) solid var(--color-brand-primary);
}

.lesson-core-callout {
    border-left: var(--border-width-6) solid var(--color-brand-secondary);
}`);

// Fix label colors for .lesson-core-callout__label (make all of them secondary)
css = css.replace(/\.lesson-core-callout__label\s*\{\s*margin:\s*0\s*0\s*var\(--spacing-sm\);\s*color:\s*var\(--color-brand-primary\);\s*\}/g,
`.lesson-core-callout__label {
  margin: 0 0 var(--spacing-sm);
  color: var(--color-brand-secondary);
}`);

fs.writeFileSync('docencia-4.0/styles/main.css', css, 'utf8');
console.log('Fixed main.css border and label colors');
