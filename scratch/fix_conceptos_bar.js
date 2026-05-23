const fs = require('fs');
const path = require('path');

const lessons = [
  'leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html',
  'leccion2_1.html', 'leccion2_2.html', 'leccion2_3.html',
  'leccion3_1.html', 'leccion3_2.html', 'leccion3_3.html', 'leccion3_4.html'
];
const basePath = path.join(__dirname, '..', 'docencia-4.0');

function fixFile(filename) {
  const filepath = path.join(basePath, filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Match the exact block we injected earlier
  const badHeaderRegex = /<summary class="concept-review__summary-main concept-review-header">\s*<div class="concept-review-title">\s*<span aria-hidden="true" class="concept-review__icon">💡<\/span>\s*<span class="concept-review__title-text" id="conceptos-title">Conceptos a repasar<\/span>\s*<\/div>\s*<span class="concept-review-toggle btn btn-outline-primary btn-sm">Ver conceptos<\/span>\s*<\/summary>/i;
  
  // The correct native grid block
  const correctHeader = `<summary class="concept-review__summary-main">
  <span aria-hidden="true" class="concept-review__icon">📖</span>
  <span class="concept-review__meta">
    <span class="concept-review__title" id="conceptos-title">Conceptos a repasar</span>
  </span>
  <span class="concept-review-toggle btn btn-outline-primary btn-sm">Ver conceptos</span>
</summary>`;

  if (badHeaderRegex.test(content)) {
    content = content.replace(badHeaderRegex, correctHeader);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed ' + filename);
  } else {
    // Try a more flexible regex just in case
    const flexibleRegex = /<summary class="concept-review__summary-main concept-review-header">[\s\S]*?<\/summary>/i;
    if (flexibleRegex.test(content)) {
      content = content.replace(flexibleRegex, correctHeader);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log('Fixed (flexible) ' + filename);
    } else {
      console.log('Not found in ' + filename);
    }
  }
}

lessons.forEach(fixFile);
console.log('Done fixing Conceptos a repasar.');
