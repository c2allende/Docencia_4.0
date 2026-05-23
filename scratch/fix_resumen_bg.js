const fs = require('fs');

const cssPath = 'docencia-4.0/styles/main.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Find the block starting at line 5446:
// .lesson-summary-card,
// .lesson-objective-card,
// .lesson-progressive-card,
// .lesson-role-connection,
// .lesson-toolbox,
// .lesson-media-card,
// .checkpoint-card {
//   background: var(--color-background-surface);

css = css.replace(/\.lesson-summary-card,\s*\.lesson-objective-card,/g, '.lesson-objective-card,');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Fixed background override for .lesson-summary-card in main.css');
