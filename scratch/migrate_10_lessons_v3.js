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
        
        // 2b. Clean local CSS safely
        const styleStart = html.indexOf('<style>');
        const styleEnd = html.indexOf('</style>', styleStart);
        
        if (styleStart !== -1 && styleEnd !== -1) {
            let styleBlock = html.substring(styleStart, styleEnd);
            
            // Remove padding from .lesson-card inside <style>
            // We only remove the exact strings: 'padding: var(--spacing-16);' or 'padding: var(--spacing-xl);' or 'padding: var(--spacing-md);'
            // ONLY if they are inside the .lesson-card or @media query for .lesson-card
            // A simple regex that looks for .lesson-card { ... padding: ... }
            styleBlock = styleBlock.replace(/(\.lesson-card\s*\{[^}]*?)padding:\s*var\(--spacing-(?:16|xl|md)\);\s*/g, '$1/* removed padding */\n');
            
            // Remove exact .content-wrapper blocks
            // .content-wrapper { max-width: 1100px; margin: ... padding: ... }
            styleBlock = styleBlock.replace(/^[ \\t]*\.content-wrapper\s*\{[^}]+\}/gm, (match) => {
                // Check if it only has dimensional stuff
                if (match.includes('max-width') || match.includes('padding') || match.includes('margin')) {
                    return '/* removed local .content-wrapper */';
                }
                return match;
            });
            
            html = html.substring(0, styleStart) + styleBlock + html.substring(styleEnd);
        }
        
        fs.writeFileSync(file, html, 'utf8');
        console.log('Migrated ' + file);
    });
}

executeMigration();
