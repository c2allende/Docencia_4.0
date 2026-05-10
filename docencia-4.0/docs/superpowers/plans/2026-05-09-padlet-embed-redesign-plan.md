# Rediseño de Embeds de Padlet: Plan de Implementación del Prototipo

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Desarrollar un prototipo comparativo (`padlet_embed_alternatives_prototype.html`) para evaluar cuatro formas de integrar tableros de Padlet en Docencia 4.0.

**Architecture:** El prototipo será una página HTML independiente que importa `main.css`. Implementará tres enfoques interactivos (Tarjeta, Acordeón, Pestañas) usando Vanilla JS y CSS interno para componentes específicos del prototipo, respetando los tokens institucionales.

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Google Fonts (Manrope, Plus Jakarta Sans).

---

### Task 1: Estructura Base y Línea Base (Alternativa 0)

**Files:**
- Create: `docencia-4.0/padlet_embed_alternatives_prototype.html`

- [ ] **Step 1: Crear el andamiaje HTML.**
Implementar una página independiente que importe `main.css`. Incluir un encabezado de reporte de métricas dinámico.

- [ ] **Step 2: Implementar la Alternativa 0 (Diseño Actual).**
Insertar la estructura exacta de la Actividad 1.2 con el iframe de 600px para establecer la línea base de comparación.

- [ ] **Step 3: Lógica de medición de altura.**
Escribir un script pequeño que calcule y muestre la altura en píxeles de cada sección del prototipo.

---

### Task 2: Enfoque A - Tarjeta Híbrida (Contextual)

**Files:**
- Modify: `docencia-4.0/padlet_embed_alternatives_prototype.html`

- [ ] **Step 1: Diseñar la Tarjeta Híbrida.**
Crear un componente `.padlet-card` con título, descripción e instrucción breve.

- [ ] **Step 2: Implementar el Placeholder de "Vista Previa".**
Simular el código de vista previa de Padlet (miniatura + info).

- [ ] **Step 3: Agregar acciones principales.**
Botón "Abrir tablero completo" (target="_blank").

---

### Task 3: Enfoque B - Acordeón Progresivo (Andamiaje)

**Files:**
- Modify: `docencia-4.0/padlet_embed_alternatives_prototype.html`

- [ ] **Step 1: Crear el componente de Acordeón accesible.**
Implementar `button` con `aria-expanded` y `aria-controls`, panel con `role="region"`.

- [ ] **Step 2: Implementar carga diferida (data-src).**
Configurar el iframe con `data-src` y cargarlo mediante JS solo al expandir el acordeón.

---

### Task 4: Enfoque C - Pestañas (Espacio de Trabajo)

**Files:**
- Modify: `docencia-4.0/padlet_embed_alternatives_prototype.html`

- [ ] **Step 1: Implementar sistema de pestañas accesible.**
Roles `tablist`, `tab`, `tabpanel`. Pestaña inicial: "Instrucciones".

- [ ] **Step 2: Carga diferida en pestaña "Muro".**
Configurar el iframe del muro para que se cargue solo al activar su pestaña.

---

### Task 5: Validación y Reporte Final

**Files:**
- Create: `docencia-4.0/padlet_embed_decision_report.md`

- [ ] **Step 1: Captura de métricas (Desktop/Mobile).**
Usar el navegador para registrar las alturas de cada alternativa.

- [ ] **Step 2: Análisis UX/UI e Instruccional.**
Comparar enfoques y redactar la recomendación específica para las actividades 1.2, 2.1 y 3.1.

- [ ] **Step 3: Definir lista de códigos requeridos.**
Listar qué códigos de Padlet solicitar al usuario para la implementación final.
