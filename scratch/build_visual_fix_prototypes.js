const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'docencia-4.0');

function removeStrong(html) {
  return html.replace(/<strong>/gi, '').replace(/<\/strong>/gi, '');
}

function processPrototype(sourceFile, targetFile) {
  const filepath = path.join(basePath, sourceFile);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Strip ONLY conflicting local styles for the 3 boxes, keeping everything else
  content = content.replace(/<style>([\s\S]*?)<\/style>/i, (match, styleContent) => {
    // We just remove definitions of the conflicting classes
    let cleanStyle = styleContent;
    const classesToRemove = [
      '\\.lesson-core-card',
      '\\.lesson-core-callout',
      '\\.lesson-summary-card',
      '\\.audio-player-container'
    ];
    for (const cls of classesToRemove) {
      // Basic regex to remove standalone rules
      const ruleRegex = new RegExp(cls + '\\s*\\{[^}]*\\}', 'gi');
      cleanStyle = cleanStyle.replace(ruleRegex, '');
      // And rules where it is part of a selector list before {
      const complexRegex = new RegExp(`(?:[^\\{]*?${cls}[^\\{]*?)\\{[^}]*\\}`, 'gi');
      cleanStyle = cleanStyle.replace(complexRegex, '');
    }
    return `<style>${cleanStyle}</style>`;
  });

  const lessonNum = sourceFile.match(/leccion(\d+)_(\d+)/);
  const numStr = lessonNum ? `${lessonNum[1]}.${lessonNum[2]}` : '';

  // Process Audio
  const audioRegex = /<div class="audio-player-container[^>]*>([\s\S]*?)<\/div>/i;
  const audioSectionRegex = /<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>/i;
  const replaceAudio = (m) => {
    let audioTag = m.match(/<audio[\s\S]*?<\/audio>/i);
    audioTag = audioTag ? audioTag[0] : '';
    let pTag = m.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    pTag = pTag ? removeStrong(pTag[0]) : '';

    return `<section class="audio-player-container lesson-audio-intro" aria-label="Audio inicial de la Lección ${numStr}">
    <label class="lesson-section-kicker audio-label" for="lessonAudio">🎧 ESCUCHAR LECCIÓN ${numStr}</label>
    ${audioTag}
    ${pTag}
</section>`;
  };
  if (audioRegex.test(content)) content = content.replace(audioRegex, replaceAudio);
  else if (audioSectionRegex.test(content)) content = content.replace(audioSectionRegex, replaceAudio);

  // Process Resumen
  const summaryRegex = /<section[^>]*class="[^"]*lesson-summary-card[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(summaryRegex, (m, inner) => {
    let cleaned = inner.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    return `<section class="lesson-summary-card" aria-labelledby="resumen-title">
    <h2 id="resumen-title" class="lesson-section-kicker">📌 RESUMEN INICIAL</h2>${removeStrong(cleaned)}
</section>`;
  });

  // Process Concepto Central
  const coreRegex = /<section[^>]*class="[^"]*(?:lesson-core-card|lesson-core-callout)[^"]*"[^>]*>([\s\S]*?)<\/section>/i;
  content = content.replace(coreRegex, (m, inner) => {
    let cleaned = inner.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    cleaned = cleaned.replace(/<p class="lesson-core-callout__label"[^>]*>[\s\S]*?<\/p>/i, '');
    return `<section class="lesson-core-callout" aria-label="Concepto central">
    <p class="lesson-core-callout__label">🎯 CONCEPTO CENTRAL</p>${removeStrong(cleaned)}
</section>`;
  });

  fs.writeFileSync(path.join(basePath, targetFile), content, 'utf8');
}

processPrototype('leccion2_1.html', 'leccion2_1_intro_sections_visual_fix_prototype.html');
processPrototype('leccion1_1.html', 'leccion1_1_intro_sections_match_2_1_prototype.html');

console.log('Fixed prototypes generated.');
