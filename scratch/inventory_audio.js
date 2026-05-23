const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Carmelo Allende/.antigravity/Docencia_4.0/docencia-4.0';

function getFiles(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    if(file === 'node_modules' || file.startsWith('.')) return;
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (fullPath.endsWith('.html') && !fullPath.includes('bak') && !fullPath.includes('prototype')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getFiles(dir);
const inventory = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const filename = path.basename(file);
  
  // Find <source src="..."> tags
  const regex = /<source\s+src=["']([^"']+\.mp3)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const audioSrc = match[1];
    const audioPath = path.join(dir, audioSrc);
    const exists = fs.existsSync(audioPath);
    
    // Check if it's the encoded fallback
    if (audioSrc.includes('%20')) continue; // Skip reporting the encoded version separately to keep it clean, or keep it? We'll keep it.

    inventory.push({
      page: filename,
      src: audioSrc,
      exists: exists
    });
  }
});

console.log('| Página | Sección | Archivo de audio actual | Ruta actual | Existe en carpeta | Requiere actualización | Nuevo archivo esperado | Acción |');
console.log('|---|---|---|---|---|---|---|---|');
inventory.forEach(item => {
  const fileBasename = path.basename(item.src);
  console.log(`| ${item.page} | Audio Principal | ${fileBasename} | ${item.src} | ${item.exists ? 'Sí' : 'No'} | Pendiente | ? | Revisar |`);
});
