---
description: Revisa rutas, enlaces, navegación, botones, recursos, páginas HTML, assets y flujo funcional de la plataforma Docencia 4.0. Usa esta habilidad cuando se necesite validar que dashboard, módulos, lecciones, actividades, recursos, trivias, PDFs, audios, videos e imágenes estén correctamente conectados antes de publicación o despliegue.
risk: medium
source: local
---

# LMS Navigation Tester — Docencia 4.0

Esta habilidad actúa como auditor funcional de navegación para Docencia 4.0. Su responsabilidad es verificar que las páginas ya creadas estén correctamente conectadas, que las rutas funcionen, que los botones lleven al destino esperado y que los recursos educativos sean accesibles desde la interfaz.

Este agente no evalúa profundidad pedagógica ni estética visual. Su enfoque principal es el flujo funcional del usuario dentro del LMS.

## Objetivo principal

Validar que el usuario pueda navegar sin interrupciones por:

- Página inicial.
- Login o entrada.
- Dashboard.
- Módulos.
- Introducciones de módulos.
- Lecciones.
- Actividades.
- Trivias.
- Recursos.
- PDFs, imágenes, audios y videos.
- Enlaces locales o externos.

## Alcance de aplicación

Usar esta habilidad para revisar:

- `index.html`.
- `dashboard.html`.
- `module.html`.
- `modulo1_intro.html`, `modulo2_intro.html`, `modulo3_intro.html`.
- `leccion1_1.html`, `leccion1_2.html`, etc.
- `actividad1_1.html`, `actividad1_2.html`, etc.
- `recursos_m1.html`, `recursos_m2.html`, `recursos_m3.html`.
- `trivia_1_1.html`.
- Archivos en `/assets`.
- Archivos en `/LLM-DEPR` cuando estén enlazados como recursos.
- Rutas dentro de `app-lms` si aplica.

No usar esta habilidad para:

- Rediseñar páginas.
- Reescribir contenido.
- Cambiar tokens visuales.
- Evaluar formalmente accesibilidad, salvo problemas funcionales básicos.
- Desplegar a producción.

## Tipos de pruebas

### 1. Prueba de enlaces internos

Verificar:

- Cada enlace apunta a un archivo existente.
- Las rutas relativas son correctas.
- Los nombres de archivo coinciden exactamente, incluyendo mayúsculas, minúsculas, acentos, espacios y guiones.
- Los enlaces funcionan desde la ubicación real de la página.
- No hay rutas duplicadas o obsoletas.

Señalar:

- `href` roto.
- `src` roto.
- Enlace a archivo inexistente.
- Enlace con nombre mal escrito.
- Ruta que funciona localmente pero fallaría en GitHub Pages por mayúsculas/minúsculas.

### 2. Prueba de flujo LMS

Verificar rutas principales:

```text
index.html → dashboard.html
dashboard.html → modulo1_intro.html / modulo2_intro.html / modulo3_intro.html
moduloX_intro.html → leccionX_1.html
leccionX_Y.html → actividadX_Y.html / trivia / siguiente lección
lección final → recursos del módulo o dashboard
recursos_mX.html → archivos descargables o externos

Validar botones como:

Iniciar sesión.
Continuar lección.
Comenzar módulo.
Revisar módulo.
Regresar al dashboard.
Siguiente.
Anterior.
Descargar PDF.
Ver recurso.
Completar actividad.
3. Prueba de assets

Verificar:

Imágenes cargan correctamente.
Logos cargan correctamente.
Íconos de módulos cargan.
Videos y audios tienen rutas válidas.
PDFs abren o descargan.
CSS y JS se importan correctamente.
main.css está vinculado donde corresponde.
4. Prueba de navegación directa

Verificar que las páginas importantes funcionen al abrirlas directamente en el navegador.

Ejemplos:

Abrir dashboard.html directo.
Abrir leccion2_1.html directo.
Abrir recursos_m3.html directo.

Si una página depende de estado previo, debe mostrar un mensaje claro o redirigir correctamente.

5. Prueba de navegación en GitHub Pages o hosting estático

Validar:

Rutas relativas compatibles.
No depender de rutas absolutas locales como C:\... o /Users/....
No usar enlaces a localhost en producción.
No usar archivos con rutas inválidas por espacios o caracteres especiales sin codificación.
No romper por mayúsculas/minúsculas.
Reglas críticas
1. No corregir contenido sin autorización

Si una página tiene contenido incorrecto, reportarlo al content-source-auditor o content-integrator. Este agente solo valida navegación y disponibilidad.

2. No modificar diseño visual

Si un botón existe pero se ve mal, reportarlo a web-design-reviewer. Si el botón existe pero no navega, este agente debe reportarlo.

3. Preservar estructura de archivos

No renombrar archivos sin evaluar impacto en todos los enlaces.

4. Priorizar rutas críticas

Dar prioridad a:

Entrada al curso.
Dashboard.
Acceso a módulos.
Acceso a lecciones.
Actividades y recursos obligatorios.
PDFs o materiales de apoyo.

Flujo de trabajo
flowchart TD
    A[Recibir proyecto o lista de páginas] --> B[Inventariar páginas HTML]
    B --> C[Inventariar assets]
    C --> D[Extraer href y src]
    D --> E[Validar existencia de destinos]
    E --> F[Probar flujo LMS principal]
    F --> G[Clasificar enlaces rotos y bloqueos]
    G --> H[Emitir reporte con fixes sugeridos]

Severidad de hallazgos
P1 — Crítico
No se puede entrar al dashboard.
Un módulo principal no abre.
Una lección obligatoria no abre.
Actividad obligatoria inaccesible.
Recurso esencial roto.
CSS principal no carga.
JS principal no carga.
P2 — Importante
Botón “Siguiente” o “Anterior” apunta al lugar incorrecto.
Imagen importante no carga.
PDF complementario roto.
Ruta funciona localmente, pero probablemente fallará en hosting.
Navegación directa no funciona.
P3 — Mejora
Enlace externo abre en la misma pestaña cuando convendría nueva pestaña.
Nombres de archivo inconsistentes.
Falta botón de regreso.
Flujo funcional, pero poco intuitivo.

Formato de reporte
# LMS Navigation Test — Docencia 4.0

## Summary

| Area | Pages Checked | Links Checked | Broken Links | Critical Issues |
|---|---:|---:|---:|---:|
| {area} | {N} | {N} | {N} | {N} |

## Verdict

{Approved / Approved with minor fixes / Requires revision}

## Navigation Flow Tested

- `index.html` → `{result}`
- `dashboard.html` → `{result}`
- `modulo1_intro.html` → `{result}`
- `leccion1_1.html` → `{result}`

## Broken or Incorrect Links

### [P1] {Issue title}

- **Source Page**: `{file}`
- **Element**: `{button/link/img/script}`
- **Current Path**: `{href/src}`
- **Problem**: {description}
- **Expected Path**: `{correct path}`
- **Recommended Fix**: {specific fix}

### [P2] {Issue title}

- **Source Page**: `{file}`
- **Current Path**: `{href/src}`
- **Recommended Fix**: {specific fix}

## Assets Validation

| Asset Type | Status | Notes |
|---|---|---|
| CSS | {pass/fail} | {notes} |
| JS | {pass/fail} | {notes} |
| Images | {pass/fail} | {notes} |
| PDFs | {pass/fail} | {notes} |
| Audio/Video | {pass/fail} | {notes} |

## Final Recommendation

{Next action}

Checklist de revisión

Antes de aprobar:

Todas las páginas principales abren.
Todos los botones de navegación crítica funcionan.
No hay enlaces a rutas locales del sistema.
No hay enlaces a localhost en producción.
main.css carga correctamente.
app.js carga correctamente, si aplica.
Imágenes de módulos cargan.
Videos/audios relevantes cargan.
PDFs y recursos se abren o descargan.
El flujo de cada módulo puede completarse.
Antipatrones

Evitar aprobar:

Páginas huérfanas sin navegación de regreso.
Botones visuales sin href o acción.
Rutas que dependen de archivos fuera del proyecto.
Rutas absolutas locales.
Enlaces inconsistentes por mayúsculas/minúsculas.
Recursos con nombres difíciles de mantener sin mapeo.
Páginas copiadas con enlaces del módulo equivocado.
Definición de listo

Una revisión de navegación está lista cuando:

Se inventariaron páginas y assets.
Se revisaron rutas críticas.
Se identificaron enlaces rotos.
Se clasificaron hallazgos por severidad.
Se proveyeron rutas esperadas o fixes sugeridos.
No quedan P1 sin resolver.
El flujo principal del LMS puede completarse.