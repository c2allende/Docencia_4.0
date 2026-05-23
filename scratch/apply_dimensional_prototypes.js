const fs = require('fs');
const path = require('path');

const files = [
    'docencia-4.0/leccion1_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion2_1_dimensions_audit_prototype.html',
    'docencia-4.0/leccion3_4_dimensions_audit_prototype.html'
];

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace <main class="content-wrapper"> with <main class="content-wrapper lesson-page-wrapper">
    if (html.includes('<main class="content-wrapper">')) {
        html = html.replace('<main class="content-wrapper">', '<main class="content-wrapper lesson-page-wrapper">');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Injected class into ' + file);
    } else if (html.includes('lesson-page-wrapper')) {
        console.log('Class already in ' + file);
    } else {
        console.log('WARNING: Could not find <main class="content-wrapper"> in ' + file);
    }
});
