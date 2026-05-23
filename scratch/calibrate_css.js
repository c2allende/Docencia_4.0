const fs = require('fs');

let css = fs.readFileSync('docencia-4.0/styles/main.css', 'utf8');

// The block we want to split looks like:
// .lesson-core-callout__label,
// .lesson-section-kicker {
//     margin: 0 0 var(--spacing-sm);
//     color: var(--color-brand-primary);
//     font-family: var(--font-family-heading);
//     font-weight: var(--font-weight-extrabold);
//     text-transform: uppercase;
//     letter-spacing: var(--letter-spacing-wide);
//     display: flex;
//     align-items: center;
//     gap: var(--spacing-xs);
// }

css = css.replace(/\.lesson-core-callout__label\s*,\s*\.lesson-section-kicker\s*\{([\s\S]*?)color:\s*var\(--color-brand-primary\);([\s\S]*?)\}/, 
`.lesson-section-kicker {
$1color: var(--color-brand-primary);$2}

.lesson-core-callout__label {
$1color: var(--color-brand-secondary);$2}`);

// Also fix the other appearance of .lesson-core-callout__label that we found earlier (line 4945):
// .lesson-core-callout__label {
//   margin: 0 0 var(--spacing-sm);
//   color: var(--color-brand-primary);
// }
css = css.replace(/\.lesson-core-callout__label\s*\{\s*margin:\s*0\s*0\s*var\(--spacing-sm\);\s*color:\s*var\(--color-brand-primary\);\s*\}/, 
`.lesson-core-callout__label {
  margin: 0 0 var(--spacing-sm);
  color: var(--color-brand-secondary);
}`);

fs.writeFileSync('docencia-4.0/styles/main.css', css, 'utf8');
console.log('CSS modified');
