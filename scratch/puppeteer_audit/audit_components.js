const fs = require('fs');
const path = require('path');

const targetPages = {
    m1: ['modulo1_intro.html', 'leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html', 'actividad1_1.html', 'actividad1_2.html', 'foro_modulo1.html', 'recursos_m1.html'],
    m2: ['modulo2_intro.html', 'leccion2_1.html', 'leccion2_2.html', 'leccion2_3.html', 'actividad2_1.html', 'foro_modulo2.html', 'recursos_m2.html'],
    m3: ['modulo3_intro.html', 'leccion3_1.html', 'leccion3_2.html', 'leccion3_3.html', 'leccion3_4.html', 'actividad3_1.html', 'foro_modulo3.html', 'recursos_m3.html']
};

const BASE_DIR = path.join(__dirname, '..', '..', 'docencia-4.0');

function extractComponents() {
    let components = {};

    Object.values(targetPages).flat().forEach(page => {
        const filePath = path.join(BASE_DIR, page);
        if (!fs.existsSync(filePath)) return;
        const html = fs.readFileSync(filePath, 'utf8');

        // We will use basic string matching to find classes and inline styles for key sections
        
        // Find local style blocks
        const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/gi);
        if (styleMatch) {
            styleMatch.forEach(s => {
                if (!components['Local Styles']) components['Local Styles'] = { pages: [], classes: new Set() };
                components['Local Styles'].pages.push(page);
                
                // Extract class selectors from style
                const classSelectors = s.match(/\.[a-zA-Z0-9_-]+/g);
                if (classSelectors) {
                    classSelectors.forEach(cls => components['Local Styles'].classes.add(cls));
                }
            });
        }

        // Find inline styles
        const inlineStyleMatch = html.match(/style="([^"]*)"/g);
        if (inlineStyleMatch) {
            if (!components['Inline Styles']) components['Inline Styles'] = { pages: [], styles: new Set() };
            components['Inline Styles'].pages.push(page);
        }

        // Basic structural classes
        const classesToTrack = [
            'hero-section', 'intro-section', 'lesson-card', 'activity-card', 'forum-card', 'resource-card',
            'concept-review', 'checkpoint-section', 'references-section', 'completion-section', 'btn', 'btn-primary'
        ];

        classesToTrack.forEach(cls => {
            if (html.includes(cls)) {
                if (!components[cls]) components[cls] = { pages: [] };
                components[cls].pages.push(page);
            }
        });
    });

    console.log(JSON.stringify(components, null, 2));
}

extractComponents();
