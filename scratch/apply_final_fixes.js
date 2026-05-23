const fs = require('fs');
const path = require('path');

const lessons = [
  'leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html',
  'leccion2_1.html', 'leccion2_2.html', 'leccion2_3.html',
  'leccion3_1.html', 'leccion3_2.html', 'leccion3_3.html', 'leccion3_4.html'
];
const basePath = path.join(__dirname, '..', 'docencia-4.0');

function removeStrong(html) {
  return html.replace(/<strong>/gi, '').replace(/<\/strong>/gi, '');
}

function mergeParagraphsText(innerHtml) {
  let textOnly = '';
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(innerHtml)) !== null) {
    if (match[0].includes('lesson-core-callout__label')) continue;
    textOnly += ' ' + match[1].trim().replace(/\s+/g, ' ');
  }
  return textOnly.trim();
}

function migrateFile(filename) {
  const filepath = path.join(basePath, filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  const lessonNum = filename.match(/leccion(\d+)_(\d+)/);
  const numStr = lessonNum ? `${lessonNum[1]}.${lessonNum[2]}` : '';

  // 1. Process Audio Box
  const audioRegex = /<div class="audio-player-container[^>]*>([\s\S]*?)<\/div>/i;
  const audioSectionRegex = /<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>/i;
  
  const replaceAudio = (m) => {
    let audioTagMatch = m.match(/<audio[\s\S]*?<\/audio>/i);
    let audioTag = audioTagMatch ? audioTagMatch[0] : '';
    let pTagText = mergeParagraphsText(m);
    pTagText = removeStrong(pTagText);

    return `<section class="audio-player-container lesson-audio-intro" aria-label="Audio inicial de la Lección ${numStr}">
    <label class="lesson-section-kicker audio-label" for="lessonAudio">🎧 ESCUCHAR LECCIÓN ${numStr}</label>
    ${audioTag}
    <p>${pTagText}</p>
</section>`;
  };

  if (audioRegex.test(content)) content = content.replace(audioRegex, replaceAudio);
  else if (audioSectionRegex.test(content)) content = content.replace(audioSectionRegex, replaceAudio);

  // 2. Process Resumen Box
  const summaryRegex = /<section[^>]*class="[^"]*lesson-summary-card[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(summaryRegex, (m, inner) => {
    let mergedText = removeStrong(mergeParagraphsText(inner));
    return `<section class="lesson-summary-card" aria-labelledby="resumen-title">
    <h2 id="resumen-title" class="lesson-section-kicker">📌 RESUMEN INICIAL</h2>
    <p>${mergedText}</p>
</section>`;
  });

  // 3. Process Concepto Central Box
  const coreRegex = /<section[^>]*class="[^"]*(?:lesson-core-card|lesson-core-callout)[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(coreRegex, (m, inner) => {
    let mergedText = removeStrong(mergeParagraphsText(inner));
    return `<section class="lesson-core-callout" aria-label="Concepto central">
    <p class="lesson-core-callout__label">🎯 CONCEPTO CENTRAL</p>
    <p>${mergedText}</p>
</section>`;
  });

  // 4. Process Conceptos a repasar
  // Restore exactly the user's requested layout for the header
  const conceptHeaderRegex = /<summary class="concept-review__summary-main"[^>]*>([\s\S]*?)<\/summary>/i;
  content = content.replace(conceptHeaderRegex, (m, inner) => {
    return `<summary class="concept-review__summary-main">
  <div class="concept-review-header">
    <div class="concept-review-title">
      <span class="concept-review-icon">📖</span>
      <span class="concept-review-text">Conceptos a repasar</span>
    </div>
    <button class="concept-review-toggle btn btn-outline-primary btn-sm" aria-expanded="false" type="button">Ver conceptos</button>
  </div>
</summary>`;
  });

  fs.writeFileSync(filepath, content, 'utf8');
}

lessons.forEach(migrateFile);
console.log('Final migration script completed securely.');
