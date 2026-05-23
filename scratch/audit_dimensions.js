const fs = require('fs');

function auditFile(file) {
    const html = fs.readFileSync('docencia-4.0/' + file, 'utf8');
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
    let localCSS = cssMatch ? cssMatch[1] : 'NONE';
    
    // Look for dimension properties
    const propertiesToFind = ['max-width', 'width', 'padding', 'margin', 'padding-top'];
    let findings = [];
    
    const lines = localCSS.split('\n');
    let currentRule = '';
    lines.forEach(line => {
        if (line.includes('{')) {
            currentRule = line.split('{')[0].trim();
        }
        propertiesToFind.forEach(prop => {
            if (line.includes(prop + ':')) {
                findings.push(`${currentRule} -> ${line.trim()}`);
            }
        });
    });
    
    return findings;
}

console.log("=== LECCION 2.1 (REFERENCE) ===");
console.log(auditFile('leccion2_1_dimensions_audit_prototype.html').join('\n'));
console.log("=== LECCION 1.1 ===");
console.log(auditFile('leccion1_1_dimensions_audit_prototype.html').join('\n'));
console.log("=== LECCION 3.4 ===");
console.log(auditFile('leccion3_4_dimensions_audit_prototype.html').join('\n'));
