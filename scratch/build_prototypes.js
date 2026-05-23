const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'docencia-4.0');
const files = ['leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html', 'leccion2_1.html'];

function refactorHtml(content, filename) {
  // 1. Strip local styles for boxes
  content = content.replace(/<style>[\s\S]*?\.lesson-core-card[\s\S]*?<\/style>/i, '');
  content = content.replace(/<style>[\s\S]*?\.lesson-core-callout[\s\S]*?<\/style>/i, '');

  // Determine lesson number for the label
  const match = filename.match(/leccion(\d+)_(\d+)/);
  const lessonNumber = match ? `${match[1]}.${match[2]}` : '';

  // 2. Refactor Audio Section
  const audioRegex = /<div class="audio-player-container[^>]*>([\s\S]*?)<\/div>/i;
  const audioSectionRegex = /<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>/i;
  
  const replaceAudio = (m) => {
    // Keep inner content but restructure the container
    let inner = m;
    let audioTag = inner.match(/<audio[\s\S]*?<\/audio>/i);
    audioTag = audioTag ? audioTag[0] : '';
    
    let paragraph = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    paragraph = paragraph ? paragraph[0] : '';

    return `<section class="audio-player-container lesson-audio-intro" aria-label="Audio inicial de la Lección ${lessonNumber}">
    <label class="lesson-section-kicker audio-label" for="lessonAudio">🎧 ESCUCHAR LECCIÓN ${lessonNumber}</label>
    ${audioTag}
    ${paragraph}
</section>`;
  };

  if (audioRegex.test(content)) {
    content = content.replace(audioRegex, replaceAudio);
  } else if (audioSectionRegex.test(content)) {
    content = content.replace(audioSectionRegex, replaceAudio);
  }

  // 3. Refactor Resumen Inicial
  const summaryRegex = /<section[^>]*class="[^"]*lesson-summary-card[^"]*"[^>]*>[\s\S]*?<\/section>/i;
  content = content.replace(summaryRegex, (m) => {
    let innerHtml = m.replace(/<section[^>]*>/i, '').replace(/<\/section>/i, '');
    // remove the old header
    innerHtml = innerHtml.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    
    return `<section class="lesson-summary-card" aria-labelledby="resumen-title">
    <h2 id="resumen-title" class="lesson-section-kicker">📌 RESUMEN INICIAL</h2>${innerHtml}
</section>`;
  });

  // 4. Refactor Concepto Central
  const coreRegex = /<section[^>]*class="[^"]*(lesson-core-card|lesson-core-callout)[^"]*"[^>]*>[\s\S]*?<\/section>/i;
  content = content.replace(coreRegex, (m) => {
    let innerHtml = m.replace(/<section[^>]*>/i, '').replace(/<\/section>/i, '');
    // remove old header or label
    innerHtml = innerHtml.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    innerHtml = innerHtml.replace(/<p class="lesson-core-callout__label"[^>]*>[\s\S]*?<\/p>/i, '');
    
    return `<section class="lesson-core-callout" aria-label="Concepto central">
    <p class="lesson-core-callout__label">🎯 CONCEPTO CENTRAL</p>${innerHtml}
</section>`;
  });

  return content;
}

for (const file of files) {
  const filepath = path.join(basePath, file);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    let newContent = refactorHtml(content, file);
    
    const newFilename = file.replace('.html', '_layout_intro_sections_prototype.html');
    fs.writeFileSync(path.join(basePath, newFilename), newContent, 'utf8');
    console.log(`Created ${newFilename}`);
  }
}
