const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/LLM-DEPR';
const targetDir = 'c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/docencia-4.0/LLM-DEPR';
const htmlDir = 'c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/docencia-4.0';

const map = {
  'modulo1_intro.html': 'LLM-DEPR/LLM_M1_intro_audioedit.mp3',
  'leccion1_1.html': 'LLM-DEPR/LLM_M1_Leccion1_1_audioedit.mp3',
  'leccion1_2.html': 'LLM-DEPR/LLM_M1_Leccion1_2_audioedit.mp3',
  'leccion1_3.html': 'LLM-DEPR/LLM_M1_Leccion1_3_audioedit.mp3',
  'modulo2_intro.html': 'LLM-DEPR/LLM_M2_intro_audioedit.mp3',
  'leccion2_1.html': 'LLM-DEPR/LLM_M2_Leccion2_1_audioedit.mp3',
  'leccion2_2.html': 'LLM-DEPR/LLM_M2_Leccion2_2_audioedit.mp3',
  'leccion2_3.html': 'LLM-DEPR/LLM_M2_Leccion2_3_audioedit.mp3',
  'modulo3_intro.html': 'LLM-DEPR/LLM_M3_intro_audioedit.mp3',
  'leccion3_1.html': 'LLM-DEPR/LLM_M3_Leccion3_1_audioedit.mp3',
  'leccion3_2.html': 'LLM-DEPR/LLM_M3_Leccion3_2_audioedit.mp3',
  'leccion3_3.html': 'LLM-DEPR/LLM_M3_Leccion3_3_audioedit.mp3',
  'leccion3_4.html': 'LLM-DEPR/LLM_M3_Leccion3_4_audioedit.mp3'
};

// 1. Copy MP3 files
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

Object.values(map).forEach(relativeSrc => {
  const filename = path.basename(relativeSrc);
  const sourcePath = path.join(srcDir, filename);
  const destPath = path.join(targetDir, filename);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${filename}`);
  } else {
    console.log(`ERROR: Source MP3 not found: ${sourcePath}`);
  }
});

// 2. Update HTML files
Object.entries(map).forEach(([filename, newSrc]) => {
  const filePath = path.join(htmlDir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the block of <source> tags with a single new <source>
    // We match any <source ...> possibly followed by whitespace and another <source ...> etc.
    const newSourceTag = `<source src="${newSrc}" type="audio/mpeg">`;
    const regex = /(<source\s+src="[^"]*"[^>]*>[\s]*)+/gi;
    
    // We also want to preserve indentation if possible, but let's just do a clean replace
    // Find the leading spaces of the first <source>
    content = content.replace(regex, (match) => {
      // Find indentation of first source
      const indentMatch = match.match(/^([\s]*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      return `${newSourceTag}\n${indent.replace(/\n/g, '')}`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated HTML: ${filename}`);
  } else {
    console.log(`ERROR: HTML file not found: ${filePath}`);
  }
});

console.log('Done.');
