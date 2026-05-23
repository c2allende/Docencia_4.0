const fs = require('fs');
const path = require('path');

const files = [
  'modulo1_intro_visual_fix_prototype.html',
  'modulo2_intro_visual_fix_prototype.html',
  'modulo3_intro_visual_fix_prototype.html'
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', 'docencia-4.0', file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // TAREA 4: Eliminar <strong> dentro de module-key-message
  // Find the module-key-message section
  const keyMessageRegex = /<section[^>]*class="[^"]*module-key-message[^"]*"[\s\S]*?<\/section>/g;
  content = content.replace(keyMessageRegex, (match) => {
    // Inside this section, replace <strong> and </strong> with nothing
    return match.replace(/<\/?strong>/g, '');
  });

  // TAREA 5: Objetivo general a H2
  // We look for <p class="module-section-kicker">🎯 Objetivo general</p>
  // or <p class="module-objective-card__label">🎯 Objetivo general</p>
  const objGeneralRegex = /<p[^>]*class="[^"]*(?:module-section-kicker|module-objective-card__label)[^"]*"[^>]*>\s*🎯\s*Objetivo general\s*<\/p>/g;
  content = content.replace(objGeneralRegex, '<h2 class="module-section-title">🎯 Objetivo general</h2>');

  // TAREA 6: Eliminar Conexión con la investigación
  const researchPillarsRegex = /<section[^>]*class="[^"]*module-research-pillars[^"]*"[\s\S]*?<\/section>/g;
  content = content.replace(researchPillarsRegex, '');

  fs.writeFileSync(filePath, content);
  console.log(`Updated HTML in ${file}`);
}
