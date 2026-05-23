
const fs = require("fs");
const path = require("path");

const dir = "docencia-4.0";
const outputFile = path.join(dir, "codigo_consolidado_proyecto.md");

const files = fs.readdirSync(dir).filter(f => f.endsWith(".html") && !f.includes("prototype") && !f.includes("bak"));

let content = "# Código Consolidado del Proyecto Docencia 4.0\n\n";

for (const file of files) {
    content += `## Archivo: ${file}\n\n\`\`\`html\n`;
    content += fs.readFileSync(path.join(dir, file), "utf8");
    content += `\n\`\`\`\n\n---\n\n`;
}

content += `## Archivo: styles/main.css\n\n\`\`\`css\n`;
try { content += fs.readFileSync(path.join(dir, "styles", "main.css"), "utf8"); } catch(e) {}
content += `\n\`\`\`\n\n---\n\n`;

// Add a couple of important JS files just in case
const scriptsDir = path.join(dir, "scripts");
if (fs.existsSync(scriptsDir)) {
    const jsFiles = fs.readdirSync(scriptsDir).filter(f => f.endsWith(".js"));
    for (const file of jsFiles) {
        content += `## Archivo: scripts/${file}\n\n\`\`\`javascript\n`;
        content += fs.readFileSync(path.join(scriptsDir, file), "utf8");
        content += `\n\`\`\`\n\n---\n\n`;
    }
}

fs.writeFileSync(outputFile, content, "utf8");
console.log(`Archivo creado exitosamente.`);

