const fs = require('fs');

const cssPath = 'docencia-4.0/styles/main.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCSS = `

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

if (!css.includes('/* FIX CONCEPTOS A REPASAR */')) {
    css += newCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Added CSS for Conceptos a Repasar.');
}
