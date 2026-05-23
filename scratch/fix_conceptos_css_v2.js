const fs = require('fs');

const cssPath = 'docencia-4.0/styles/main.css';
let css = fs.readFileSync(cssPath, 'utf8');

const badCSS = `
/* FIX CONCEPTOS A REPASAR */
.concept-review > .concept-review__summary-main {
    display: block !important;
}
.concept-review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.concept-review-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}
.concept-review-title span:not(.concept-review-icon) {
    color: var(--color-brand-primary);
    font-family: var(--font-family-heading);
    font-weight: 700;
    font-size: var(--font-size-xl);
}
.concept-review-icon {
    font-size: var(--font-size-2xl);
    line-height: 1;
}
@media (max-width: 768px) {
    .concept-review-header {
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
}
`;

const goodCSS = `
/* FIX CONCEPTOS A REPASAR */
.concept-review-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: nowrap;
}
.concept-review-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}
.concept-review-title span:not(.concept-review-icon) {
    color: var(--color-brand-primary);
    font-family: var(--font-family-heading);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-xl);
    text-align: left;
}
.concept-review-icon {
    font-size: var(--font-size-2xl);
    line-height: 1;
}
.concept-review-toggle {
    white-space: nowrap;
    margin-left: var(--spacing-sm);
}
`;

if (css.includes('/* FIX CONCEPTOS A REPASAR */')) {
    // replace everything from the comment to the end
    const idx = css.indexOf('/* FIX CONCEPTOS A REPASAR */');
    css = css.substring(0, idx) + goodCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Fixed CSS in main.css');
}
