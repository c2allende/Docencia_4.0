const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const targetPages = {
    m1: [
        'modulo1_intro.html', 'leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html',
        'actividad1_1.html', 'actividad1_2.html', 'foro_modulo1.html', 'recursos_m1.html'
    ],
    m2: [
        'modulo2_intro.html', 'leccion2_1.html', 'leccion2_2.html', 'leccion2_3.html',
        'actividad2_1.html', 'foro_modulo2.html', 'recursos_m2.html'
    ],
    m3: [
        'modulo3_intro.html', 'leccion3_1.html', 'leccion3_2.html', 'leccion3_3.html',
        'leccion3_4.html', 'actividad3_1.html', 'foro_modulo3.html', 'recursos_m3.html'
    ]
};

const BASE_URL = 'http://127.0.0.1:5000';
const OUT_DIR = path.join(__dirname, '..', '..', 'docencia-4.0', 'QA_Auditoria_Forense_Diseno');
const SCREENSHOTS_DIR = path.join(OUT_DIR, 'screenshots');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function auditPages() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const allFindings = {};

    for (const [module, pages] of Object.entries(targetPages)) {
        for (const page of pages) {
            console.log(`Auditing ${page}...`);
            const pageUrl = `${BASE_URL}/${page}`;
            const findings = [];
            let hallazgoCount = 1;

            const p = await browser.newPage();
            
            // --- DESKTOP AUDIT ---
            await p.setViewport({ width: 1440, height: 900 });
            try {
                await p.goto(pageUrl, { waitUntil: 'networkidle2' });
            } catch (err) {
                console.error(`Failed to load ${pageUrl}: ${err.message}`);
                continue;
            }

            const evalData = await p.evaluate(() => {
                const issues = [];
                
                // Check inline styles
                const inlineStyleElements = document.querySelectorAll('[style]');
                if (inlineStyleElements.length > 0) {
                    const examples = Array.from(inlineStyleElements).slice(0, 3).map(e => e.outerHTML.substring(0, 50));
                    issues.push({ cat: 'CSS/tokens', sev: 'Media', desc: `Se encontraron ${inlineStyleElements.length} elementos con estilos inline (hardcoded). Ej: ${examples.join(' | ')}` });
                }

                // Check local style blocks
                const styleBlocks = document.querySelectorAll('style:not(#main-css)');
                if (styleBlocks.length > 0) {
                    issues.push({ cat: 'CSS/tokens', sev: 'Media', desc: `Se encontraron ${styleBlocks.length} bloques <style> locales.` });
                }

                // Check H1
                const h1 = document.querySelector('h1');
                if (h1) {
                    const style = window.getComputedStyle(h1);
                    if (style.fontSize !== '36px' && style.fontSize !== '48px') { // 36px is 2.25rem (text-4xl), 48px is 3rem (text-5xl)
                        issues.push({ cat: 'Visual', sev: 'Media', desc: `H1 tiene tamaño ${style.fontSize}, esperado 36px o 48px (tokens text-4xl o text-5xl)` });
                    }
                } else {
                    issues.push({ cat: 'Accesibilidad', sev: 'Alta', desc: `No se encontró etiqueta H1.` });
                }

                // Check overflow
                if (document.documentElement.scrollWidth > window.innerWidth) {
                    issues.push({ cat: 'Responsividad', sev: 'Alta', desc: `Desbordamiento horizontal detectado (scrollWidth > innerWidth)` });
                }

                return issues;
            });

            // If there are issues, take a desktop screenshot
            if (evalData.length > 0) {
                const ssName = `${page.replace('.html','')}_desktop_hallazgo${String(hallazgoCount).padStart(2, '0')}.png`;
                await p.screenshot({ path: path.join(SCREENSHOTS_DIR, ssName) });
                evalData[0].evidence = ssName;
                hallazgoCount++;
            }
            findings.push(...evalData.map(e => ({ ...e, viewport: 'Desktop' })));

            // --- MOBILE AUDIT ---
            await p.setViewport({ width: 390, height: 844 });
            const mobileEval = await p.evaluate(() => {
                const issues = [];
                if (document.documentElement.scrollWidth > window.innerWidth) {
                    issues.push({ cat: 'Responsividad', sev: 'Alta', desc: `Desbordamiento horizontal detectado en móvil` });
                }
                return issues;
            });

            if (mobileEval.length > 0) {
                const ssName = `${page.replace('.html','')}_mobile_hallazgo${String(hallazgoCount).padStart(2, '0')}.png`;
                await p.screenshot({ path: path.join(SCREENSHOTS_DIR, ssName) });
                mobileEval[0].evidence = ssName;
                hallazgoCount++;
            }
            findings.push(...mobileEval.map(e => ({ ...e, viewport: 'Mobile' })));

            // Extract more specific components based on page type
            const specializedEval = await p.evaluate((page) => {
                const issues = [];
                
                // For forums
                if (page.includes('foro')) {
                    if (!document.querySelector('[data-forum-id]')) issues.push({ cat: 'Funcionalidad', sev: 'Crítica', desc: 'Falta atributo data-forum-id en el foro.' });
                }
                
                // For lessons
                if (page.includes('leccion') || page.includes('modulo')) {
                    if (!document.querySelector('#completion-section')) issues.push({ cat: 'Funcionalidad', sev: 'Crítica', desc: 'Falta elemento #completion-section para tracking.' });
                }

                return issues;
            }, page);

            findings.push(...specializedEval.map(e => ({ ...e, viewport: 'Any' })));

            allFindings[page] = findings;
            await p.close();
        }
    }

    fs.writeFileSync(path.join(OUT_DIR, 'raw_findings.json'), JSON.stringify(allFindings, null, 2));
    await browser.close();
    console.log('Audit complete.');
}

auditPages().catch(console.error);
