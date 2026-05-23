const fs = require('fs');
const filepath = 'docencia-4.0/styles/main.css';
let content = fs.readFileSync(filepath, 'utf8');

// Find the string and remove it
const badCss = `/* Componente Conceptos a Repasar */
.concept-review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}
.concept-review-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
@media (max-width: 768px) {
  .concept-review-header {
    flex-wrap: wrap;
  }
}
`;

if (content.includes(badCss)) {
  content = content.replace(badCss, '');
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Removed appended CSS from main.css');
} else {
  // If exact match fails, just chop off everything after the comment
  const index = content.indexOf('/* Componente Conceptos a Repasar */');
  if (index !== -1) {
    content = content.substring(0, index);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Chopped off appended CSS from main.css');
  }
}
