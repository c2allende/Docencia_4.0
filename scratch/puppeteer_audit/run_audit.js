const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const files = [
    'docencia-4.0/modulo1_intro.html',
    'docencia-4.0/modulo2_intro.html',
    'docencia-4.0/modulo3_intro.html'
  ];

  for (const file of files) {
    console.log(`\n=== Auditing ${file} ===`);
    // path resolution assuming we run this from inside scratch/puppeteer_audit
    const fileUrl = 'file:///' + path.resolve(__dirname, '../../', file).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'load' });

    const results = await page.evaluate(() => {
      const data = {};
      ['.content-wrapper', '.intro-card'].forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) {
          data[sel] = 'NO ENCONTRADO';
          return;
        }

        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        data[sel] = {
          renderedWidth: rect.width,
          maxWidth: cs.maxWidth,
          marginTop: cs.marginTop,
          paddingTop: cs.paddingTop,
          paddingRight: cs.paddingRight,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft
        };
        
        if (sel === '.intro-card') {
            const innerWidth = rect.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            data[sel].effectiveReadingWidth = innerWidth;
            
            const topbar = document.querySelector('.top-nav');
            if (topbar) {
                const topbarRect = topbar.getBoundingClientRect();
                data[sel].distanceFromTopbar = rect.top - topbarRect.bottom;
            }
        }
      });
      return data;
    });

    console.log(JSON.stringify(results, null, 2));
  }

  await browser.close();
})();
