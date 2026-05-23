const fs = require('fs');

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
        if (html.includes('<main class="content-wrapper">')) {
            html = html.replace('<main class="content-wrapper">', '<main class="content-wrapper lesson-page-wrapper">');
        }
        
        // 2b. Clean local CSS safely: only remove specific lines that match competing dimensional rules
        // For .content-wrapper, it usually has max-width, margin, padding.
        
        // We find the <style> block to only process styles
        const styleStart = html.indexOf('<style>');
        const styleEnd = html.indexOf('</style>', styleStart);
        
        if (styleStart !== -1 && styleEnd !== -1) {
            let styleBlock = html.substring(styleStart, styleEnd);
            
            // Remove padding from .lesson-card in local style
            // We match .lesson-card { ... } specifically
            // We replace `padding: var(--spacing-16);` or `padding: var(--spacing-xl);` inside the block
            
            // A safer way is to just replace the whole .content-wrapper block if it ONLY contains dimensional things
            // Let's just remove the block if it's the exact known block
            const blockContentWrapper1 = \`        .content-wrapper {
            max-width: 1100px;
            margin: var(--spacing-xl) auto var(--spacing-16);
            padding: 0 var(--spacing-md);
        }\`;
            const blockContentWrapper2 = \`        .content-wrapper {
            padding: 0 var(--spacing-4);
        }\`;
            
            styleBlock = styleBlock.replace(blockContentWrapper1, '');
            styleBlock = styleBlock.replace(blockContentWrapper2, '');
            
            // For .lesson-card padding
            styleBlock = styleBlock.replace('padding: var(--spacing-xl);', '/* removed padding var(--spacing-xl) */');
            styleBlock = styleBlock.replace('padding: var(--spacing-16);', '/* removed padding var(--spacing-16) */');
            
            html = html.substring(0, styleStart) + styleBlock + html.substring(styleEnd);
        }
        
        fs.writeFileSync(file, html, 'utf8');
        console.log(\`Migrated \${file}\`);
    });
}

executeMigration();
