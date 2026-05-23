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
  content = content.replace(/<footer class="nav-footer"/g, '<footer class="nav-footer footer-nav"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated footer in ${file}`);
}
