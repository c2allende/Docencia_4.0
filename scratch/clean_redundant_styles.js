const fs = require('fs');
const path = require('path');

const prototypes = [
  'leccion1_1_layout_intro_sections_prototype.html',
  'leccion1_2_layout_intro_sections_prototype.html',
  'leccion1_3_layout_intro_sections_prototype.html',
  'leccion2_1_layout_intro_sections_prototype.html'
];
const basePath = path.join(__dirname, '..', 'docencia-4.0');

for (const file of prototypes) {
  const filepath = path.join(basePath, file);
  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf8');

  // We find the <style> block
  content = content.replace(/<style>([\s\S]*?)<\/style>/i, (match, styleContent) => {
    // Regex to remove a CSS rule block. Simple approach:
    // This matches the class, everything up to {, and then everything up to }
    const classesToRemove = [
      '\\.audio-player-container',
      '\\.lesson-summary-card',
      '\\.lesson-core-card',
      '\\.lesson-core-callout',
      '\\.lesson-audio-intro',
      '\\.lesson-core-callout__label'
    ];

    for (const cls of classesToRemove) {
      // Handle cases where the class is part of a comma separated list, or standalone.
      // Easiest is to just remove the rule if it's explicitly defining it standalone
      // or if it's grouped, well, we'd have to parse CSS. 
      // Let's do a basic regex: classname\s*\{ [^}]* \}
      const regex = new RegExp(cls + '\\s*\\{[^}]*\\}', 'gi');
      styleContent = styleContent.replace(regex, '');
      
      // Handle grouped like: .audio-player-container, .lesson-summary-card { ... }
      // This is harder with regex. Let's just remove grouped rules that START with these classes.
      // Or we can just leave it if it's too complex, but let's try a broader regex:
      // match any selector containing the class, followed by { ... }
      const groupRegex = new RegExp(`(?:[^\\{]*?${cls}[^\\{]*?)\\{[^}]*\\}`, 'gi');
      styleContent = styleContent.replace(groupRegex, '');
    }

    return `<style>${styleContent}</style>`;
  });

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Cleaned redundant styles in ${file}`);
}
