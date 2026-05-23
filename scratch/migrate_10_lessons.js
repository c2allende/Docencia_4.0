const fs = require('fs');
const path = require('path');

const filesToMigrate = [
    'docencia-4.0/leccion1_1.html',
    'docencia-4.0/leccion1_2.html',
    'docencia-4.0/leccion1_3.html',
    'docencia-4.0/leccion2_1.html',
    'docencia-4.0/leccion2_2.html',
    'docencia-4.0/leccion2_3.html',
    'docencia-4.0/leccion3_1.html',
    'docencia-4.0/leccion3_2.html',
    'docencia-4.0/leccion3_3.html',
    'docencia-4.0/leccion3_4.html'
];

const cssToAppend = `

/* --- NORMALIZACIÓN DIMENSIONAL DE LECCIONES --- */
.content-wrapper.lesson-page-wrapper {
  max-width: 1040px;
  margin: var(--spacing-12) auto var(--spacing-16);
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

function prepareMigration() {
    console.log("== PREPARANDO MIGRACIÓN (MODO DRY-RUN) ==");
    
    // 1. Check main.css
    const mainCssPath = 'docencia-4.0/styles/main.css';
    let mainCss = fs.readFileSync(mainCssPath, 'utf8');
    if (!mainCss.includes('NORMALIZACIÓN DIMENSIONAL DE LECCIONES')) {
        console.log("[READY] main.css will be appended with the approved CSS.");
    } else {
        console.log("[SKIP] main.css already has the CSS block.");
    }
    
    // 2. Check HTML files
    filesToMigrate.forEach(file => {
        if (!fs.existsSync(file)) {
            console.log(`[ERROR] File not found: ${file}`);
            return;
        }
        
        let html = fs.readFileSync(file, 'utf8');
        let modifications = [];
        
        // Add class
        if (html.includes('<main class="content-wrapper">')) {
            modifications.push('Add .lesson-page-wrapper class');
        }
        
        // Remove local .content-wrapper dimensions
        if (html.includes('.content-wrapper {')) {
            modifications.push('Remove local .content-wrapper block');
        }
        
        if (html.includes('padding: var(--spacing-16);') && html.indexOf('.lesson-card') !== -1) {
            modifications.push('Remove local .lesson-card padding');
        }
        
        console.log(`[READY] ${file}: ${modifications.join(', ')}`);
    });
}

function executeMigration() {
    console.log("== EJECUTANDO MIGRACIÓN ==");
    
    // 1. Append main.css
    const mainCssPath = 'docencia-4.0/styles/main.css';
    let mainCss = fs.readFileSync(mainCssPath, 'utf8');
    if (!mainCss.includes('NORMALIZACIÓN DIMENSIONAL DE LECCIONES')) {
        mainCss += cssToAppend;
        fs.writeFileSync(mainCssPath, mainCss, 'utf8');
        console.log("Updated main.css");
    }
    
    // 2. Process HTML files
    filesToMigrate.forEach(file => {
        let html = fs.readFileSync(file, 'utf8');
        
        // 2a. Inject class
        html = html.replace('<main class="content-wrapper">', '<main class="content-wrapper lesson-page-wrapper">');
        
        // 2b. Clean local CSS using targeted string replacements for safety
        // This is a naive regex approach tailored to the specific formatting in these files
        
        // Remove .content-wrapper block
        html = html.replace(/\s*\.content-wrapper\s*\{[^}]+\}/g, (match) => {
            console.log(`  Removed .content-wrapper block in ${file}`);
            return '';
        });
        
        // Remove padding from .lesson-card
        html = html.replace(/(\.lesson-card\s*\{[^}]*?)padding:\s*var\(--spacing-(?:16|xl)\);([^}]*\})/g, (match, p1, p2) => {
            console.log(`  Removed padding from .lesson-card in ${file}`);
            return p1 + p2;
        });

        // Also clean up any media queries that target .content-wrapper or .lesson-card padding
        // (This is tricky with regex, we do a best effort or leave them since the new CSS has higher specificity)
        
        fs.writeFileSync(file, html, 'utf8');
        console.log(`Migrated ${file}`);
    });
}

const arg = process.argv[2];
if (arg === '--execute') {
    executeMigration();
} else {
    prepareMigration();
    console.log("\nTo execute, run: node scratch/migrate_10_lessons.js --execute");
}
