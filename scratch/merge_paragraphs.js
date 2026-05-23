const fs = require('fs');

const prototypes = [
  'docencia-4.0/leccion1_1_layout_intro_sections_prototype.html',
  'docencia-4.0/leccion2_1_layout_intro_sections_prototype.html'
];

function mergeParagraphs(html) {
  // We want to find the <section>...</section> and replace its inner <p> tags
  
  // Resumen Inicial
  const summaryRegex = /(<section class="lesson-summary-card"[^>]*>)([\s\S]*?)(<\/section>)/i;
  html = html.replace(summaryRegex, (match, openTag, inner, closeTag) => {
    // Keep the header
    const headerMatch = inner.match(/<h2[^>]*>[\s\S]*?<\/h2>/i);
    const header = headerMatch ? headerMatch[0] : '';
    
    // Extract all <p> contents
    let textOnly = '';
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(inner)) !== null) {
      textOnly += ' ' + pMatch[1].trim().replace(/\s+/g, ' ');
    }
    
    return `${openTag}
    ${header}
    <p>${textOnly.trim()}</p>
${closeTag}`;
  });

  // Concepto Central
  const coreRegex = /(<section class="lesson-core-callout"[^>]*>)([\s\S]*?)(<\/section>)/i;
  html = html.replace(coreRegex, (match, openTag, inner, closeTag) => {
    // Keep the label
    const labelMatch = inner.match(/<p class="lesson-core-callout__label"[^>]*>[\s\S]*?<\/p>/i);
    const label = labelMatch ? labelMatch[0] : '';
    
    // Extract all other <p> contents
    let textOnly = '';
    const pRegex = /<p(?![^>]*lesson-core-callout__label)[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(inner)) !== null) {
      textOnly += ' ' + pMatch[1].trim().replace(/\s+/g, ' ');
    }

    return `${openTag}
    ${label}
    <p>${textOnly.trim()}</p>
${closeTag}`;
  });

  return html;
}

for (const proto of prototypes) {
  let content = fs.readFileSync(proto, 'utf8');
  content = mergeParagraphs(content);
  fs.writeFileSync(proto, content, 'utf8');
  console.log('Merged paragraphs in ' + proto);
}
