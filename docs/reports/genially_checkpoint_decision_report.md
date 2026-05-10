# Reporte de Decisión: Rediseño de Integración Genially (FINAL - PATRÓN APROBADO)

**Proyecto:** Docencia 4.0  
**Fecha:** 10 de mayo de 2026  
**Responsable:** Antigravity (Asistente UX/UI)

## 1. Decisión Ejecutiva: Patrón de Integración Progresiva

Tras la fase de análisis y prototipado, se aprueba el uso de la **Alternativa C Refinada** como el estándar institucional para los "Checkpoints de saberes". Esta decisión prioriza la permanencia del estudiante dentro del LMS y optimiza la carga visual y técnica de las lecciones.

### Justificación de la Elección
- **Continuidad Instruccional:** Elimina el riesgo de abandono al evitar la apertura forzada de nuevas pestañas.
- **Eficiencia Técnica:** Mediante la carga diferida (`data-src`), el peso del iframe Genially no afecta el tiempo inicial de carga de la lección.
- **Jerarquía Visual:** Sustituye el bloque naranja invasivo por una tarjeta compacta que respeta el flujo de cierre, referencias y navegación final.

## 2. Especificación del Patrón (V3)

| Elemento | Especificación |
|---|---|
| **Contenedor** | Tarjeta blanca con borde neutral y acento superior (4px) en color naranja (`--color-brand-secondary`). |
| **Eyebrow** | "Cierre de la lección" (Naranja, 800 weight). |
| **Título** | "Checkpoint de saberes: Lección X.X" (Slate-900, 700 weight). |
| **Botón Primario** | "Realizar checkpoint aquí" (Naranja, forma pill). |
| **Enlace Secundario**| "Abrir en Genially en nueva pestaña" (Cyan, outline). |
| **Mecánica** | El iframe se inserta o se le asigna `src` solo tras el clic primario. |

## 3. Matriz de Recomendación y Códigos Requeridos

Para proceder a la fase de producción, el usuario deberá proveer los siguientes datos para las 10 lecciones.

| Página | Patrón Aprobado | Acción Requerida | Datos Pendientes del Usuario |
|---|---|---|---|
| **leccion1_1.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion1_2.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion1_3.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion2_1.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion2_2.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion2_3.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion3_1.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion3_2.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion3_3.html** | Progresivo Refinado | Sustituir iframe directo por tarjeta. | URL Embed Genially + Título Actividad |
| **leccion3_4.html** | Integrado (Cierre) | Tarjeta con mensaje de felicitación. | URL Embed Genially + Título Actividad |

## 4. Requisitos Técnicos de Implementación

La implementación final en los archivos `.html` deberá seguir este estándar de accesibilidad y rendimiento:

```html
<!-- Ejemplo de Marcado Progresivo -->
<div class="checkpoint-card-refined" role="region" aria-label="Checkpoint de saberes">
    <span class="card-eyebrow">Cierre de la lección</span>
    <h2 class="card-title">Checkpoint de saberes: Lección X.X</h2>
    <p class="card-description">Descripción breve del propósito...</p>
    
    <div class="cta-actions">
        <button class="btn-primary-lms" aria-expanded="false" aria-controls="iframe-container-X">
            Realizar checkpoint aquí
        </button>
        <a href="URL_DIRECTA" target="_blank" class="btn-secondary-external">
            Abrir en Genially en nueva pestaña
        </a>
    </div>

    <div id="iframe-container-X" class="checkpoint-body-progress">
        <iframe data-src="URL_EMBED" src="about:blank" loading="lazy" title="Actividad interactiva"></iframe>
    </div>
</div>
```

## 5. Validación de Integridad
- [x] Los archivos de análisis residen en `/docs/`.
- [x] El directorio `docencia-4.0/` permanece intacto.
- [x] Se ha corregido el error 404 simulado en el prototipo usando placeholders dinámicos.

---
**Próximo Paso:** Una vez que el usuario provea la tabla de URLs y títulos para las 10 lecciones, se procederá a la fase de implementación controlada en producción.
