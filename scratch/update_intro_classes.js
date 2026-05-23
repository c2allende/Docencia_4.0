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
  
  // Replace old local classes with main.css standards
  content = content.replace(/class="resumen-section module-intro-summary"/g, 'class="lesson-summary-card"');
  content = content.replace(/class="section-label"/g, 'class="module-section-kicker"');
  content = content.replace(/class="intro-card module-intro-card"/g, 'class="module-intro-card"');
  content = content.replace(/class="intro-title"/g, 'class="module-intro-title"');

  fs.writeFileSync(filePath, content);
  console.log(`Updated classes in ${file}`);
}
