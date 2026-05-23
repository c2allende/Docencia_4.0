const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'docencia-4.0', 'QA_Auditoria_Forense_Diseno', 'QA_INTRO_Normalizacion_Visual_M1_M2_M3.md');
const textToAppend = "\n## QA Fix — Calibración final de rótulos y espaciado reflexivo\n\n" +
"- **Rótulos subidos:** Los rótulos de Resumen inicial, Mensaje clave y Pregunta reflexiva se subieron explícitamente a `--font-size-base` con `display: block` y márgenes correspondientes.\n" +
"- **Mensaje Clave:** Se normalizó explícitamente y con `font-weight: 400` para asegurar que respeta en todo momento el cuerpo de lectura de `var(--font-family-body)` y no parezca subtítulo hero.\n" +
"- **Pregunta reflexiva:** Se añadió separación explícita (`margin-top: var(--spacing-xs)`) entre el rótulo \"Antes de comenzar\" y la pregunta, conservando el color inverso sobre el bloque naranja.\n" +
"- **Seguridad:** Confirmado no se modificó producción, no deploy, no git add ., no scripts, no Firebase, no progreso.\n";

fs.appendFileSync(targetPath, textToAppend);
console.log('Appended to QA report');
