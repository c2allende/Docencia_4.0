const fs = require('fs');

const files = [
    'docencia-4.0/leccion1_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion2_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion3_4_dimensions_audit_prototype.html'
];

const newCSS = `/* --- NORMALIZACIÓN DIMENSIONAL DE LECCIONES — PROTOTIPO QA --- */

.content-wrapper.lesson-page-wrapper {
  max-width: 1040px;
  margin: var(--spacing-xl) auto var(--spacing-16);
  padding: 0 var(--spacing-md);
}

.content-wrapper.lesson-page-wrapper .lesson-card {
  padding: var(--spacing-16);
}

.content-wrapper.lesson-page-wrapper .lesson-title {
  margin-bottom: var(--spacing-xl);
}

.content-wrapper.lesson-page-wrapper .audio-player-container,
.content-wrapper.lesson-page-wrapper .lesson-summary-card,
.content-wrapper.lesson-page-wrapper .lesson-core-callout {
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 900px) {
  .content-wrapper.lesson-page-wrapper {
    margin-top: var(--spacing-xl);
    padding: 0 var(--spacing-4);
  }

  .content-wrapper.lesson-page-wrapper .lesson-card {
    padding: var(--spacing-xl);
  }
}

@media (max-width: 520px) {
  .content-wrapper.lesson-page-wrapper .lesson-card {
    padding: var(--spacing-md);
  }
}
`;

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    // Check if the old block exists
    const startIndex = html.indexOf('/* --- NORMALIZACIÓN DIMENSIONAL DE LECCIONES — PROTOTIPO QA --- */');
    if (startIndex !== -1) {
        // Replace from startIndex to just before </style>
        const endIndex = html.indexOf('</style>', startIndex);
        if (endIndex !== -1) {
            html = html.substring(0, startIndex) + newCSS + '    ' + html.substring(endIndex);
            fs.writeFileSync(file, html, 'utf8');
            console.log('Replaced CSS in ' + file);
        }
    } else {
        console.log('CSS block not found in ' + file);
    }
});
