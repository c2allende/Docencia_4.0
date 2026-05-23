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

  // Regex to match section and contents. We use [\s\S]*? to match across newlines.
  const summaryRegex = /(<section[^>]*class="[^"]*lesson-summary-card[^"]*"[\s\S]*?<\/section>)/g;
  content = content.replace(summaryRegex, (match) => {
    return match.replace(/<\/?strong>/gi, '');
  });

  const keyMessageRegex = /(<section[^>]*class="[^"]*module-key-message[^"]*"[\s\S]*?<\/section>)/g;
  content = content.replace(keyMessageRegex, (match) => {
    return match.replace(/<\/?strong>/gi, '');
  });

  fs.writeFileSync(filePath, content);
  console.log(`Updated strong tags in ${file}`);
}
