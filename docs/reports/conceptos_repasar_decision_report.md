# Reporte de Decisión UX/UI: Componente "Conceptos a repasar"

## 1. Diagnóstico del componente actual
El componente actual se presenta como un bloque estilo carrusel o libro interactivo (`slider-section`). Posee un contenedor principal con fondo gris claro y una tarjeta interna blanca donde reside el contenido. 
Este patrón se repite extensamente a lo largo de los módulos 1, 2 y 3, pero no es escalable debido a la gran variabilidad de conceptos por lección. Ocupa demasiado espacio visual y genera fatiga de scroll.

## 2. Preservación estricta del contenido (Regla Obligatoria)
El rediseño del componente es **exclusivamente de estructura visual e interacción**. 
- Queda estrictamente **prohibido** resumir, parafrasear, acortar o eliminar texto.
- Los títulos, explicaciones completas, citas y referencias permanecen 100% intactos tal como aparecen en cada lección hoy en día.
- La compacidad se logra únicamente ocultando el contenido mediante una interfaz de revelación progresiva y no alterando su redacción.

## 3. Comparación de alternativas evaluadas

| Alternativa | Descripción | Estado |
|---|---|---|
| **0 - Actual** | Carrusel pesado con caja gris de fondo. | ❌ Descartada |
| **A - Acordeón** | Lista compacta vertical, requiere clics para ver cualquier detalle. | ❌ Descartada |
| **B - Carrusel Refinado** | Carrusel pero integrado en el borde lateral. | ❌ Descartada |
| **C - Grid** | Tarjetas resumen lado a lado con botón de expansión. | ❌ Descartada |
| **D - Split/Índice** | Panel izquierdo con menú, derecha con contenido. | ❌ Descartada |
| **E2 Refinada** | Micro-repaso progresivo adaptativo compacto. Muestra los primeros 3 conceptos cerrados desde el inicio. | ⚠️ En evaluación |
| **E3 - Panel Colapsado** | Panel inicialmente cerrado con botón de acción. Muestra un "badge" con la cantidad de conceptos. Aplica lógica E2 solo al abrirse. | ✅ **Recomendada** |

## 4. Evaluación de panel colapsado inicial (E2 vs E3)

### Análisis Comparativo
* **Alt E2 (Conceptos visibles cerrados):**
  * **Pro:** Muestra inmediatamente los títulos de los conceptos, anticipando el contenido específico.
  * **Contra:** Si los títulos son muy largos, la altura inicial sigue fluctuando moderadamente entre lecciones de 1 concepto vs lecciones de 3+.
* **Alt E3 (Panel colapsado inicialmente):**
  * **Pro:** Reduce drásticamente y estandariza la altura inicial en **todas** las lecciones (promedio ~120px), sin importar si hay 2 o 10 conceptos.
  * **Pro:** Mejora la descubribilidad de la acción con un botón claro ("Repasar conceptos") y gestiona las expectativas con un indicador numérico explícito ("X conceptos disponibles").
  * **Contra:** Requiere un clic extra para ver los títulos de los conceptos.

### Impacto en Carga Cognitiva y Móvil
La **Alt E3** gestiona mejor la carga cognitiva. Al no mostrar texto de entrada, el usuario puede enfocarse en el contenido principal de la lección y, de manera consciente (opt-in), decidir iniciar el repaso. En dispositivos móviles, esto previene por completo que una lista de conceptos desplace contenido crítico fuera del viewport.

## 5. Métricas de Altura (Desktop - E2 vs E3)

| Escenario | Alt E2 (Inicial) | Alt E3 (Inicial cerrado) | Alt E3 (Abierto, sin interactuar) |
|---|---|---|---|
| **2 Conceptos** | ~200px | **~120px** | ~280px |
| **4 Conceptos** | ~280px | **~120px** | ~350px (muestra 3 + Ver más) |
| **7 Conceptos** | ~280px | **~120px** | ~350px (muestra 3 + Ver todos) |

## 6. Recomendación Final

**Se recomienda oficialmente la Alternativa E3 (Panel colapsado + micro-repaso adaptativo)** como el estándar universal para todas las lecciones.

**Justificación:**
La Alt E3 es la única que garantiza una consistencia visual y de altura inicial absoluta (siempre ~120px) en toda la plataforma, independientemente de la carga de contenido de la lección. Transforma una sección de lectura pasiva que genera fatiga (la pared de texto original) en una actividad voluntaria y medible (el clic en "Repasar conceptos"). Además, preserva religiosamente el 100% del contenido original según las directrices.

## 7. Accesibilidad y Estructura (Alt E3)
- **Panel general:** Utiliza un elemento `<button>` real con `aria-expanded` y `aria-controls` apuntando al contenedor (`role="region"`) de los conceptos.
- **Micro-repasos internos:** Utilizan HTML Semántico (`<details>` y `<summary>`) para garantizar accesibilidad por teclado nativa y resiliencia sin JavaScript.

## 8. Confirmación de Entorno
✅ **Se confirma que en esta fase:**
- El entorno de producción (`docencia-4.0/`) **NO** fue modificado.
- El archivo `main.css` **NO** sufrió alteraciones.
- Ninguna lección HTML fue alterada.
- No se han realizado *commits* ni *deploys*.
