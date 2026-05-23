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

  // Ensure no strong tags in lesson-summary-card
  const summaryRegex = /(<section[^>]*class="[^"]*lesson-summary-card[^"]*"[\s\S]*?<\/section>)/g;
  content = content.replace(summaryRegex, (match) => {
    return match.replace(/<\/?strong>/gi, '');
  });

  // Ensure no strong tags in module-key-message
  const keyMessageRegex = /(<section[^>]*class="[^"]*module-key-message[^"]*"[\s\S]*?<\/section>)/g;
  content = content.replace(keyMessageRegex, (match) => {
    return match.replace(/<\/?strong>/gi, '');
  });

  // TAREA 6: Micro-correction in M3
  if (file === 'modulo3_intro_visual_fix_prototype.html') {
    content = content.replace('es insustituible.Ningún instrumento', 'es insustituible. Ningún instrumento');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned HTML in ${file}`);
}
