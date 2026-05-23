const fs = require('fs');
const path = require('path');

const prototypes = [
  'leccion1_1_layout_intro_sections_prototype.html',
  'leccion2_1_layout_intro_sections_prototype.html'
];
const basePath = path.join(__dirname, '..', 'docencia-4.0');

for (const file of prototypes) {
  const filepath = path.join(basePath, file);
  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf8');

  // Strip all <style> blocks completely to force reliance on main.css
  content = content.replace(/<style>[\s\S]*?<\/style>/gi, '');

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Stripped all local styles from ${file}`);
}
