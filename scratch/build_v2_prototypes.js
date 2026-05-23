const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'docencia-4.0');

function removeStrong(html) {
  return html.replace(/<strong>/gi, '').replace(/<\/strong>/gi, '');
}

function mergeParagraphsText(innerHtml) {
  let textOnly = '';
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(innerHtml)) !== null) {
    // skip elements that are labels (like lesson-core-callout__label)
    if (match[0].includes('lesson-core-callout__label')) continue;
    textOnly += ' ' + match[1].trim().replace(/\s+/g, ' ');
  }
  return textOnly.trim();
}

function processV2(sourceFile, targetFile) {
  const filepath = path.join(basePath, sourceFile);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  const lessonNum = sourceFile.match(/leccion(\d+)_(\d+)/);
  const numStr = lessonNum ? `${lessonNum[1]}.${lessonNum[2]}` : '';

  // 1. Audio Box
  const audioRegex = /<div class="audio-player-container[^>]*>([\s\S]*?)<\/div>/i;
  const audioSectionRegex = /<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>/i;
  
  const replaceAudio = (m) => {
    let audioTag = m.match(/<audio[\s\S]*?<\/audio>/i);
    audioTag = audioTag ? audioTag[0] : '';
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

  // 2. Resumen Box
  const summaryRegex = /<section[^>]*class="[^"]*lesson-summary-card[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(summaryRegex, (m, inner) => {
    let mergedText = removeStrong(mergeParagraphsText(inner));
    return `<section class="lesson-summary-card" aria-labelledby="resumen-title">
    <h2 id="resumen-title" class="lesson-section-kicker">📌 RESUMEN INICIAL</h2>
    <p>${mergedText}</p>
</section>`;
  });

  // 3. Concepto Central Box
  const coreRegex = /<section[^>]*class="[^"]*(?:lesson-core-card|lesson-core-callout)[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(coreRegex, (m, inner) => {
    let mergedText = removeStrong(mergeParagraphsText(inner));
    return `<section class="lesson-core-callout" aria-label="Concepto central">
    <p class="lesson-core-callout__label">🎯 CONCEPTO CENTRAL</p>
    <p>${mergedText}</p>
</section>`;
  });

  fs.writeFileSync(path.join(basePath, targetFile), content, 'utf8');
}

processV2('leccion2_1.html', 'leccion2_1_intro_sections_visual_fix_v2.html');
processV2('leccion1_1.html', 'leccion1_1_intro_sections_match_2_1_v2.html');

console.log('V2 Prototypes generated cleanly.');
