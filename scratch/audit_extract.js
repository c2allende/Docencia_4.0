const fs = require('fs');

function extractLayoutCSS(filename) {
    const html = fs.readFileSync('docencia-4.0/' + filename, 'utf8');
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
    if (!cssMatch) return {};
    
    const css = cssMatch[1];
    const rules = {};
    
    // Quick regex to capture basic selectors and rules
    const blockRegex = /([^{]+)\{([^}]+)\}/g;
    let match;
    while ((match = blockRegex.exec(css)) !== null) {
        let selector = match[1].trim();
        // Ignore media queries for this simple parsing or store them specially
        if (selector.startsWith('@media')) continue;
        
        let properties = match[2].trim().split(';').map(p => p.trim()).filter(p => p.length > 0);
        rules[selector] = properties;
    }
    
    return {
        body: rules['body'] || [],
        contentWrapper: rules['.content-wrapper'] || [],
        lessonCard: rules['.lesson-card'] || [],
        lessonCardGroup: rules['.lesson-card,\n        .interactive-app-wrapper'] || rules['.lesson-card,\n        .toolbox-card,\n        .completion-card,\n        .role-transfer-card,\n        .remember-card,\n        .lesson-summary-card,\n        .lesson-core-card'] || [],
    };
}

const audit = {
    leccion1_1: extractLayoutCSS('leccion1_1_dimensions_audit_prototype.html'),
    leccion2_1: extractLayoutCSS('leccion2_1_dimensions_audit_prototype.html'),
    leccion3_4: extractLayoutCSS('leccion3_4_dimensions_audit_prototype.html'),
};

fs.writeFileSync('docencia-4.0/QA_Auditoria_Dimensional_Lecciones.json', JSON.stringify(audit, null, 2));
console.log('Report saved to docencia-4.0/QA_Auditoria_Dimensional_Lecciones.json');
