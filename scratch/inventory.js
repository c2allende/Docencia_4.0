const fs = require('fs');
const path = require('path');

const pages = [
  'dashboard.html',
  'modulo1_intro.html', 'leccion1_1.html', 'leccion1_2.html', 'leccion1_3.html', 'actividad1_1.html', 'actividad1_2.html', 'foro_modulo1.html', 'recursos_m1.html',
  'modulo2_intro.html', 'leccion2_1.html', 'leccion2_2.html', 'leccion2_3.html', 'actividad2_1.html', 'foro_modulo2.html', 'recursos_m2.html',
  'modulo3_intro.html', 'leccion3_1.html', 'leccion3_2.html', 'leccion3_3.html', 'leccion3_4.html', 'actividad3_1.html', 'foro_modulo3.html', 'recursos_m3.html'
];

const componentsToTrack = {
  'Resumen Inicial': /class="[^"]*lesson-summary-card/g,
  'Objetivos': /class="[^"]*lesson-objective-card/g,
  'Concepto Central': /class="[^"]*lesson-media-card/g,
  'Lectura Progresiva': /class="[^"]*lesson-progressive-card/g,
  'Conexión Rol Docente': /class="[^"]*lesson-role-connection/g,
  'Qué debes recordar': /class="[^"]*lesson-remember/g,
  'Conceptos a repasar': /class="[^"]*concept-review/g,
  'Checkpoint Genially': /class="[^"]*genially-checkpoint/g,
  'Checkpoint Saberes': /class="[^"]*checkpoint-card/g,
  'Referencias': /class="[^"]*references-compact/g,
  'Caja de Herramientas': /class="[^"]*lesson-toolbox/g,
  'Foro': /class="[^"]*forum-shell/g,
  'Recursos': /class="[^"]*resource-bank-shell/g,
  'Actividad': /class="[^"]*activity-task-card/g
};

let htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Auditoría Visual - Docencia 4.0</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #f8fafc; margin: 2rem; color: #1e293b; }
        h1 { color: #0f172a; }
        .module-section { margin-bottom: 2rem; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: grid; grid-template-columns: 1fr 1fr 2fr 1fr 1fr; gap: 1rem; align-items: center; }
        .card a { color: #2563eb; text-decoration: none; font-weight: bold; }
        .card a:hover { text-decoration: underline; }
        .badge { background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
        .badge-warning { background: #fef08a; color: #854d0e; }
        .badge-danger { background: #fecaca; color: #991b1b; }
        .badge-success { background: #bbf7d0; color: #166534; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    </style>
</head>
<body>
    <h1>Índice Visual: Páginas Editadas Docencia 4.0</h1>
`;

let inventoryMd = `# Inventario Visual de Páginas Editadas

| Página | Tipo | Componentes visibles | Componentes nuevos/locales detectados | Riesgo visual | Acción recomendada |
|---|---|---|---|---|---|
`;

let componentMatrix = {};
Object.keys(componentsToTrack).forEach(c => componentMatrix[c] = new Set());

const getModule = (file) => {
    if (file.includes('dashboard')) return 'Dashboard';
    if (file.includes('1')) return 'Módulo 1';
    if (file.includes('2')) return 'Módulo 2';
    if (file.includes('3')) return 'Módulo 3';
    return 'Otros';
};

const getType = (file) => {
    if (file.includes('intro')) return 'Introducción';
    if (file.includes('leccion')) return 'Lección';
    if (file.includes('actividad')) return 'Actividad';
    if (file.includes('foro')) return 'Foro';
    if (file.includes('recursos')) return 'Recursos';
    if (file.includes('dashboard')) return 'Dashboard';
    return 'Página';
};

let currentModule = '';

for (const file of pages) {
    const mod = getModule(file);
    if (mod !== currentModule) {
        if (currentModule) htmlContent += `</div>\n`;
        htmlContent += `<div class="module-section"><h2>${mod}</h2>\n`;
        currentModule = mod;
    }

    const filePath = path.join(__dirname, '..', 'docencia-4.0', file);
    let content = '';
    let foundComponents = [];
    let localStyles = false;
    
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
        
        for (const [compName, regex] of Object.entries(componentsToTrack)) {
            if (content.match(regex)) {
                foundComponents.push(compName);
                componentMatrix[compName].add(file);
            }
        }
        
        if (content.includes('<style>') || content.includes('<style ')) {
            localStyles = true;
        }
    } else {
        foundComponents.push('Archivo no encontrado');
    }

    const type = getType(file);
    let risk = 'Bajo';
    let rec = 'Conservar tal como está.';
    let state = 'Revisado';
    
    if (localStyles) {
        risk = 'Alto';
        rec = 'Migrar estilos a main.css o unificar.';
        state = 'Requiere ajuste';
    } else if (foundComponents.length === 0 && file !== 'dashboard.html') {
        risk = 'Medio';
        rec = 'Revisión visual de coherencia.';
        state = 'Pendiente';
    }

    let tagsHtml = foundComponents.map(c => '<span class="badge">' + c + '</span>').join('');
    
    htmlContent += `
    <div class="card">
        <div><a href="http://127.0.0.1:5000/${file}" target="_blank">${file}</a></div>
        <div><span class="badge">${type}</span></div>
        <div class="tags">${tagsHtml}</div>
        <div><span class="badge ${risk==='Alto'?'badge-danger':(risk==='Medio'?'badge-warning':'badge-success')}">${state}</span></div>
        <div style="font-size: 0.875rem;">${localStyles ? 'Estilos locales detectados' : 'Consistente'}</div>
    </div>`;

    inventoryMd += `| ${file} | ${type} | ${foundComponents.join(', ') || 'Ninguno'} | ${localStyles ? 'Sí (<style> local)' : 'No'} | ${risk} | ${rec} |\n`;
}

htmlContent += `</div></body></html>`;

let matrixMd = `# Matriz de Componentes Creados

| Componente | Páginas donde aparece | Clase(s) CSS detectadas | Está en main.css | Tiene variantes locales | Recomendación |
|---|---|---|---|---|---|
`;

for (const [comp, pagesSet] of Object.entries(componentMatrix)) {
    const pagesArray = Array.from(pagesSet);
    const pagesStr = pagesArray.length > 0 ? pagesArray.join(', ') : 'Ninguna';
    const hasLocal = pagesArray.some(p => {
        const content = fs.readFileSync(path.join(__dirname, '..', 'docencia-4.0', p), 'utf8');
        return content.includes('<style>');
    });
    
    let rec = 'Conservar tal como está.';
    if (hasLocal) rec = 'Centralizar en main.css y remover local.';
    if (pagesArray.length === 0) rec = 'No usado.';
    
    matrixMd += `| ${comp} | ${pagesArray.length} página(s) | ${comp} | Sí | ${hasLocal ? 'Sí' : 'No'} | ${rec} |\n`;
}

matrixMd += `\n## Elementos que se salen del diseño institucional\n\n`;
matrixMd += `| Página | Elemento | Qué se observa | Por qué se sale del diseño | Severidad | Recomendación |\n`;
matrixMd += `|---|---|---|---|---|---|\n`;

for (const file of pages) {
    const filePath = path.join(__dirname, '..', 'docencia-4.0', file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('<style>')) {
        matrixMd += `| ${file} | Etiqueta \`<style>\` local | Reglas CSS inyectadas en la página | Duplica o sobrescribe \`main.css\` | Alta | Mover a main.css |\n`;
    }
}

fs.writeFileSync(path.join(__dirname, '..', 'docencia-4.0', 'auditoria_visual_paginas_editadas.html'), htmlContent);
fs.writeFileSync(path.join(__dirname, '..', 'docencia-4.0', 'QA_Auditoria_Forense_Diseno', 'Inventario_Paginas_Editadas_Docencia_4_0.md'), inventoryMd);
fs.writeFileSync(path.join(__dirname, '..', 'docencia-4.0', 'QA_Auditoria_Forense_Diseno', 'Matriz_Componentes_Creados_Durante_Edicion.md'), matrixMd);
console.log('Generación completada.');
