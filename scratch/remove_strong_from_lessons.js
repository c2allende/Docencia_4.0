const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'leccion1_1.html',
  'leccion1_2.html',
  'leccion1_3.html',
  'leccion2_1.html',
  'leccion2_2.html',
  'leccion2_3.html',
  'leccion3_1.html',
  'leccion3_2.html',
  'leccion3_3.html',
  'leccion3_4.html'
];

const basePath = path.join(__dirname, '..', 'docencia-4.0');

function processSection(sectionHtml) {
  let protectedItems = [];
  
  // Protect headers (h1-h6)
  let processedHtml = sectionHtml.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, (match) => {
    protectedItems.push(match);
    return `__PROTECTED_${protectedItems.length - 1}__`;
  });

  // Protect labels (e.g. <label class="audio-label">)
  processedHtml = processedHtml.replace(/<label[^>]*>[\s\S]*?<\/label>/gi, (match) => {
    protectedItems.push(match);
    return `__PROTECTED_${protectedItems.length - 1}__`;
  });

  // Protect kickers (e.g. <span class="module-section-kicker"> or <span class="lesson-kicker">)
  processedHtml = processedHtml.replace(/<span[^>]*class="[^"]*(module-section-kicker|lesson-kicker)[^"]*"[^>]*>[\s\S]*?<\/span>/gi, (match) => {
    protectedItems.push(match);
    return `__PROTECTED_${protectedItems.length - 1}__`;
  });

  // Remove <strong> and </strong>
  processedHtml = processedHtml.replace(/<\/?strong[^>]*>/gi, '');

  // Restore protected items
  processedHtml = processedHtml.replace(/__PROTECTED_(\d+)__/g, (match, index) => {
    return protectedItems[parseInt(index, 10)];
  });

  return processedHtml;
}

for (const filename of filesToProcess) {
  const filePath = path.join(basePath, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Regex patterns for the three specific sections
  const audioSectionRegex = /(<section[^>]*class="[^"]*audio-player-container[^"]*"[\s\S]*?<\/section>)/gi;
  const summarySectionRegex = /(<section[^>]*class="[^"]*lesson-summary-card[^"]*"[\s\S]*?<\/section>)/gi;
  // Match both lesson-core-card and lesson-core-callout
  const coreSectionRegex = /(<section[^>]*class="[^"]*(lesson-core-card|lesson-core-callout)[^"]*"[\s\S]*?<\/section>)/gi;

  let changesMade = false;
  const originalContent = content;

  content = content.replace(audioSectionRegex, (match) => processSection(match));
  content = content.replace(summarySectionRegex, (match) => processSection(match));
  content = content.replace(coreSectionRegex, (match) => processSection(match));

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated strong tags in: ${filename}`);
  } else {
    console.log(`No changes needed or matched in: ${filename}`);
  }
}

console.log("Process complete.");
