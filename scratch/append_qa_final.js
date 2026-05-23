const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'docencia-4.0', 'QA_Auditoria_Forense_Diseno', 'QA_INTRO_Normalizacion_Visual_M1_M2_M3.md');
const textToAppend = "\n## APROBACIÓN FINAL - CIERRE CONTROLADO\n\n" +
"El estado visual actual de los prototipos de introducción M1, M2 y M3 queda aprobado por revisión visual humana. No se realizarán más microajustes tipográficos en esta fase.\n\n" +
"### Resumen de logros alcanzados en los prototipos:\n" +
"1. Se eliminaron estilos locales en los prototipos.\n" +
"2. Se calibró el sistema editorial de introducciones desde main.css.\n" +
"3. \"Resumen inicial\" quedó sin `<strong>`.\n" +
"4. \"Mensaje clave del módulo\" quedó sin `<strong>` y con cuerpo de lectura más proporcionado.\n" +
"5. \"Objetivo general\" quedó como `h2.module-section-title`.\n" +
"6. \"Conexión con la investigación\" fue eliminada en M1, M2 y M3.\n" +
"7. La navegación final quedó corregida:\n" +
"   - \"Volver al Dashboard\" a la izquierda.\n" +
"   - CTA \"Iniciar Módulo\" a la derecha.\n" +
"8. El estado visual actual queda aprobado por revisión visual humana.\n" +
"9. No se harán más microajustes tipográficos en esta fase.\n";

fs.appendFileSync(targetPath, textToAppend);
console.log('Appended final summary to QA report');
