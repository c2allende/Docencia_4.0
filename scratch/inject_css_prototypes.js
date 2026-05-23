const fs = require('fs');

const files = [
    'docencia-4.0/leccion1_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion2_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion3_4_dimensions_audit_prototype.html'
];

const cssToInject = `
/* --- NORMALIZACIÓN DIMENSIONAL DE LECCIONES — PROTOTIPO QA --- */
.lesson-page-wrapper {
    max-width: 1100px;
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

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    // Inject the CSS just before </style>
    if (!html.includes('/* --- NORMALIZACIÓN DIMENSIONAL DE LECCIONES — PROTOTIPO QA --- */')) {
        html = html.replace('</style>', cssToInject + '\n    </style>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Injected CSS into ' + file);
    } else {
        console.log('CSS already injected in ' + file);
    }
});
