# Spec: Rediseño de Cajas Reflexivas (Docencia 4.0)

**Fecha:** 2026-05-09
**Estado:** Pendiente de Aprobación Final (v2)
**Objetivo:** Rediseñar el componente `.reflection-banner` para mejorar la legibilidad, reducir el peso visual y optimizar la carga cognitiva en los módulos 1, 2 y 3.

## Contexto
El diseño actual utiliza un fondo naranja sólido (`var(--gradient-orange)`) con texto centrado de gran tamaño. Esto genera una interrupción visual fuerte y fatiga en textos largos (como los de M2 y M3).

## Alternativas en el Prototipo

El prototipo mostrará 4 versiones para comparación directa:

### 0. Diseño Actual (Referencia)
- Fondo naranja sólido, texto centrado, gran altura vertical. Sirve como línea base para medir la mejora.

### A. Tarjeta Institucional Compacta
- **Superficie:** `var(--color-background-surface)` o `var(--color-background-surface-low)`.
- **Acento:** Borde lateral izquierdo (`border-left`) de `6px` en `var(--color-brand-secondary)`.
- **Alineación:** Izquierda para todos los elementos.
- **Jerarquía:** Título en `var(--font-size-sm)` (negrita); Pregunta en `var(--font-size-xl)`.

### B. Diseño Dinámico de Doble Columna
- **Distribución:** Icono pedagógico (columna izquierda) / Contenido textual (columna derecha).
- **Superficie:** Fondo neutro suave.
- **Jerarquía:** El icono actúa como disparador visual de "Momento de pensar".

### C. Acordeón de Andamiaje Progresivo
- **Estado Inicial:** Siempre visible la etiqueta "Reflexión inicial" y la **Pregunta Principal**.
- **Contenido Desplegable:** Nota secundaria e instrucciones adicionales.
- **Accesibilidad:** 
    - Botón real (`<button>`) con `aria-expanded` y `aria-controls`.
    - Navegación por teclado y focus visible.
    - Transición suave de apertura/cierre.

## Contenido Real a Utilizar
Se utilizará el texto íntegro extraído de los archivos de producción (`modulo1_intro.html`, `modulo2_intro.html`, `modulo3_intro.html`) para evaluar la altura real y la carga cognitiva de cada alternativa.

## Criterios de Evaluación y Reporte
El reporte final comparará:
1. **Altura Vertical (px):** Medición en desktop y móvil de cada alternativa.
2. **Escaneabilidad:** Tiempo percibido para identificar la pregunta clave.
3. **Carga Cognitiva:** Evaluación cualitativa del impacto visual.
4. **Accesibilidad:** Validación de contrastes y funcionalidad técnica (especialmente Alt C).

## Restricciones Técnicas
- **NO MODIFICAR PRODUCCIÓN.**
- **NO MODIFICAR main.css.**
- Usar únicamente tokens verificados: `--font-size-sm`, `--font-size-lg`, `--font-size-xl`, `--color-brand-secondary`, `--color-background-surface-low`.
- Archivo destino: `docencia-4.0/reflection_box_alternatives_prototype.html`.
