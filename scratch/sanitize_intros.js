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
  
  // Find the exact <style> ... </style> block
  const styleStart = content.indexOf('<style>');
  const styleEnd = content.indexOf('</style>');
  
  if (styleStart !== -1 && styleEnd !== -1) {
    const before = content.substring(0, styleStart);
    const after = content.substring(styleEnd + 8);
    
    fs.writeFileSync(filePath, before + after);
    console.log(`Cleaned ${file}`);
  } else {
    console.log(`No <style> found in ${file}`);
  }
}
