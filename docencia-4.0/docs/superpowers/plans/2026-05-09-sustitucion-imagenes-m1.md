# Sustitución de Imágenes Módulo 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir cuatro imágenes pedagógicas en producción por sus versiones revisadas (`_Rev`) sin alterar la estructura, diseño o funcionalidad de las páginas HTML.

**Architecture:** Se realizarán sustituciones directas de las referencias `src` en los archivos HTML, manteniendo la codificación de caracteres especiales (como `&`) y realizando copias de seguridad previas.

**Tech Stack:** HTML5, Git, Firebase Hosting.

---

### Task 1: Backups Preventivos

**Files:**
- Create: `docs/backups/cambio_imagenes_modulo1/modulo1_intro_backup_before_image_update.html`
- Create: `docs/backups/cambio_imagenes_modulo1/leccion1_1_backup_before_image_update.html`

- [ ] **Step 1: Crear copia de seguridad de modulo1_intro.html**
    - Leer el contenido de `docencia-4.0/modulo1_intro.html` y escribirlo en `docs/backups/cambio_imagenes_modulo1/modulo1_intro_backup_before_image_update.html`.

- [ ] **Step 2: Crear copia de seguridad de leccion1_1.html**
    - Leer el contenido de `docencia-4.0/leccion1_1.html` y escribirlo en `docs/backups/cambio_imagenes_modulo1/leccion1_1_backup_before_image_update.html`.

---

### Task 2: Actualización de modulo1_intro.html

**Files:**
- Modify: `docencia-4.0/modulo1_intro.html`

- [ ] **Step 1: Sustituir imagen de guía de uso responsable**
    - Buscar: `assets/LLM_M1_Intro_guia_uso_responsable_LLM_imagen.png`
    - Reemplazar por: `assets/LLM_M1_Intro_guia_uso_responsable_LLM_imagen_Rev.png`
    - Ubicaciones: Atributo `onclick` (línea 742) y `src` (línea 744).

---

### Task 3: Actualización de leccion1_1.html

**Files:**
- Modify: `docencia-4.0/leccion1_1.html`

- [ ] **Step 1: Sustituir imagen de evolución LLM**
    - Buscar: `assets/LLM_M1_Contenido_1.1_Evolucion_LLM_imagen.png`
    - Reemplazar por: `assets/LLM_M1_Contenido_1.1_Evolucion_LLM_imagen_Rev.png`
    - Ubicaciones: Atributo `onclick` (línea 1189) y `src` (línea 1191).

- [ ] **Step 2: Sustituir imagen de LLM&Bot&Buscador**
    - Buscar: `assets/LLM_M1_Contenido_1.1_LLM&amp;Bot&amp;Buscador_imagen.png` (notar `&amp;`)
    - Reemplazar por: `assets/LLM_M1_Contenido_1.1_LLM&amp;Bot&amp;Buscador_imagen_Rev.png`
    - Ubicaciones: Atributo `onclick` (línea 1220) y `src` (línea 1222).

- [ ] **Step 3: Sustituir imagen de LLM & BOT**
    - Buscar: `assets/LLM_M1_LLM_&_BOT_imagen.png` (notar `&` sin codificar)
    - Reemplazar por: `assets/LLM_M1_LLM_&_BOT_imagen_Rev.png`
    - Ubicaciones: Atributo `onclick` (línea 1382) y `src` (línea 1383).

---

### Task 4: QA Local y Validación

- [ ] **Step 1: Verificar carga de imágenes en modulo1_intro.html**
    - Abrir `modulo1_intro.html` en el navegador y verificar que la imagen `_Rev` carga correctamente y el zoom funciona.

- [ ] **Step 2: Verificar carga de imágenes en leccion1_1.html**
    - Abrir `leccion1_1.html` y verificar las tres imágenes actualizadas.

- [ ] **Step 3: Ejecutar git diff para confirmar cambios mínimos**
    - Comando: `git diff docencia-4.0/modulo1_intro.html docencia-4.0/leccion1_1.html`
    - Esperado: Solo cambios en los nombres de los archivos de imagen.

---

### Task 5: Commit y Deploy

- [ ] **Step 1: Commit de los cambios**
    - Comando: `git add docencia-4.0/modulo1_intro.html docencia-4.0/leccion1_1.html`
    - Comando: `git commit -m "Sustitución de 4 imágenes revisadas en Módulo 1"`

- [ ] **Step 2: Deploy a Firebase**
    - Comando: `firebase deploy --only hosting`
