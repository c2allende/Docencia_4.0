const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/docencia-4.0';

const classes = [
  'concept-review', 'references-section', 'padlet-cta', 'resource-summary-card',
  'resource-guidance-card', 'resource-index', 'bibliographic-resources',
  'bibliographic-resource', 'forum-shell', 'forum-alert', 'checkpoint-card',
  'completion-section-wrap', 'lesson-progressive-card', 'lesson-remember',
  'lesson-toolbox', 'activity-summary-card', 'activity-tab-card',
  'module-route-card', 'module-key-message'
];

function getFiles(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    if(file === 'node_modules' || file.startsWith('.')) return;
    file = path.join(dirPath, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.html') && !file.includes('bak')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(dir);
const report = {};

classes.forEach(c => report[c] = new Set());

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  classes.forEach(c => {
    if (content.includes('"' + c + '"') || content.includes(' ' + c + ' ') || content.includes(' ' + c + '"') || content.includes('"' + c + ' ')) {
      report[c].add(path.basename(f));
    }
  });
});

console.log('--- RESULTADOS ---');
Object.keys(report).forEach(c => {
  if (report[c].size > 0) {
    console.log(c + '| Sí | ' + Array.from(report[c]).join(', '));
  } else {
    console.log(c + '| No | Ninguna');
  }
});
