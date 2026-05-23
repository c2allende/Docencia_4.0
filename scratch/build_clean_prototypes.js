const fs = require('fs');

const files = ['leccion1_1.html', 'leccion2_1.html'];
const basePath = 'docencia-4.0/';

function removeStrong(html) {
  return html.replace(/<strong>/gi, '').replace(/<\/strong>/gi, '');
}

function processFile(filename) {
  let content = fs.readFileSync(basePath + filename, 'utf8');
  
  // Clean redundant local styles related to boxes
  content = content.replace(/<style>([\s\S]*?)<\/style>/i, (match, p1) => {
    let cleanStyle = p1.replace(/\.lesson-core-card\s*\{[^}]*\}/gi, '');
    cleanStyle = cleanStyle.replace(/\.lesson-core-callout\s*\{[^}]*\}/gi, '');
    cleanStyle = cleanStyle.replace(/\.lesson-summary-card\s*\{[^}]*\}/gi, '');
    cleanStyle = cleanStyle.replace(/(?:\.[^\{]*?lesson-core-card[^\{]*?)\{[^}]*\}/gi, '');
    cleanStyle = cleanStyle.replace(/(?:\.[^\{]*?lesson-core-callout[^\{]*?)\{[^}]*\}/gi, '');
    return `<style>${cleanStyle}</style>`;
  });

  const lessonNum = filename.match(/leccion(\d+)_(\d+)/);
  const numStr = lessonNum ? `${lessonNum[1]}.${lessonNum[2]}` : '';

  // Process Audio Box
  const audioRegex = /<div class="audio-player-container[^>]*>([\s\S]*?)<\/div>/i;
  const audioSectionRegex = /<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>/i;
  
  const replaceAudio = (m) => {
    let inner = m;
    let audioTag = inner.match(/<audio[\s\S]*?<\/audio>/i);
    audioTag = audioTag ? audioTag[0] : '';
    let pTag = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    pTag = pTag ? removeStrong(pTag[0]) : '';

    return `<section class="audio-player-container lesson-audio-intro" aria-label="Audio inicial de la Lección ${numStr}">
    <label class="lesson-section-kicker audio-label" for="lessonAudio">🎧 ESCUCHAR LECCIÓN ${numStr}</label>
    ${audioTag}
    ${pTag}
</section>`;
  };

  if (audioRegex.test(content)) content = content.replace(audioRegex, replaceAudio);
  else if (audioSectionRegex.test(content)) content = content.replace(audioSectionRegex, replaceAudio);

  // Process Resumen Box
  const summaryRegex = /<section[^>]*class="[^"]*lesson-summary-card[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(summaryRegex, (m, p1) => {
    let inner = p1.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    return `<section class="lesson-summary-card" aria-labelledby="resumen-title">
    <h2 id="resumen-title" class="lesson-section-kicker">📌 RESUMEN INICIAL</h2>${removeStrong(inner)}
</section>`;
  });

  // Process Concepto Central
  const coreRegex = /<section[^>]*class="[^"]*(?:lesson-core-card|lesson-core-callout)[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(coreRegex, (m, p1) => {
    let inner = p1.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    inner = inner.replace(/<p class="lesson-core-callout__label"[^>]*>[\s\S]*?<\/p>/i, '');
    return `<section class="lesson-core-callout" aria-label="Concepto central">
    <p class="lesson-core-callout__label">🎯 CONCEPTO CENTRAL</p>${removeStrong(inner)}
</section>`;
  });

  const outName = filename.replace('.html', '_layout_intro_sections_prototype.html');
  fs.writeFileSync(basePath + outName, content, 'utf8');
}

files.forEach(processFile);
console.log('Prototypes generated.');
