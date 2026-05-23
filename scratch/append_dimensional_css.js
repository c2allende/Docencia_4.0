const fs = require('fs');

const cssPath = 'docencia-4.0/styles/main.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCSS = `

/* --- NORMALIZACION DIMENSIONAL DE LECCIONES --- */
.lesson-page-wrapper {
    max-width: 1040px; 
    margin: var(--spacing-12) auto var(--spacing-16); 
    padding: 0 var(--spacing-md);
}

.lesson-page-wrapper .lesson-card {
    padding: var(--spacing-16); 
}

.lesson-page-wrapper .lesson-title {
    margin-bottom: var(--spacing-xl); 
}

.lesson-page-wrapper .audio-player-container,
.lesson-page-wrapper .lesson-summary-card,
.lesson-page-wrapper .lesson-core-callout {
    margin-bottom: var(--spacing-xl);
}

@media (max-width: 900px) {
    .lesson-page-wrapper {
        margin-top: var(--spacing-xl);
        padding: 0 var(--spacing-4);
    }
    .lesson-page-wrapper .lesson-card {
        padding: var(--spacing-xl);
    }
}

@media (max-width: 520px) {
    .lesson-page-wrapper .lesson-card {
        padding: var(--spacing-md);
    }
}
`;

if (!css.includes('/* --- NORMALIZACION DIMENSIONAL DE LECCIONES --- */')) {
    css += newCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Added .lesson-page-wrapper CSS to main.css');
} else {
    console.log('CSS already exists in main.css');
}
