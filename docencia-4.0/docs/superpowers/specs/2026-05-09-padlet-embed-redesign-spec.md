# Spec: Rediseño de Embeds de Padlet en Docencia 4.0

## Objetivo
Optimizar la integración de tableros colaborativos de Padlet en el LMS para reducir el espacio vertical excesivo, mejorar el rendimiento de carga y clarificar la intención pedagógica.

## Problema Actual
Los embeds actuales utilizan iframes de altura fija (600px) que dominan visualmente la página, generan scroll excesivo y cargan recursos pesados de forma indiscriminada.

## Enfoques a Prototipar
Se evaluarán cuatro alternativas:

0. **Línea Base: Diseño Actual**
   - **Estructura:** Iframe completo con altura fija de 600px.
   - **Propósito:** Actuar como punto de control para medir la reducción de altura y carga.

1. **Enfoque A: Tarjeta Híbrida (Contextual Interactivo)**
   - **Estructura:** Tarjeta institucional con el código de "Vista Previa" oficial de Padlet.
   - **Acción Principal:** Botón "Abrir tablero completo" (nueva pestaña).
   - **Acción Secundaria:** Botón "Mostrar aquí" (evaluativo).

2. **Enfoque B: Acordeón Progresivo (Andamiaje)**
   - **Estructura:** Botón de toggle con `aria-expanded` y `aria-controls`.
   - **Comportamiento:** El iframe se carga solo al presionar "Mostrar tablero" usando `data-src`.
   - **Accesibilidad:** Foco visible, navegación por teclado, `role="region"`.

3. **Enfoque C: Pestañas (Espacio de Trabajo Dedicado)**
   - **Estructura:** Sistema de pestañas (Instrucciones / Muro Colaborativo).
   - **Comportamiento:** Pestaña inicial "Instrucciones". Carga de iframe diferida hasta activar "Muro".
   - **Accesibilidad:** `role="tablist"`, `role="tab"`, `role="tabpanel"`.

## Métricas y Evaluación
El prototipo debe reportar las siguientes alturas (Desktop/Móvil):
- Altura Diseño Actual.
- Altura Enfoque A.
- Altura Enfoque B (Cerrado/Expandido).
- Altura Enfoque C (Instrucciones/Muro).

La recomendación final se basará en la comparación de estas métricas, carga cognitiva, rendimiento y usabilidad móvil para cada una de las actividades (`actividad1_2.html`, `actividad2_1.html`, `actividad3_1.html`).

## Entrega Final
1. Archivo de prototipo funcional: `docencia-4.0/padlet_embed_alternatives_prototype.html`.
2. Informe de decisión: `padlet_embed_decision_report.md`.
3. Lista exacta de códigos a solicitar al usuario (Vista previa, Tablero completo, Enlace).
