# Checkpoint OBLIGATORIO: Validación de No Regresión del Bloque main.css

## 1 y 2. Tabla de Verificación y Riesgo de Cascada

| Clase | Aparece en HTML | Páginas donde aparece | Riesgo por cascada | Acción recomendada antes de Fase B1 |
| :--- | :---: | :--- | :--- | :--- |
| `concept-review` | Sí | `leccion1_1`, `leccion1_2`, `leccion1_3`, `leccion2_1`, `leccion2_2`, `leccion2_3`, `leccion3_1` a `3_4` | Bajo | Ninguna. `<style>` local sobrescribe `main.css`. |
| `references-section` | Sí | `modulo1_intro_...`, `modulo2_intro_...` | Bajo | Ninguna. |
| `padlet-cta` | Sí | `actividad1_2`, `actividad2_1`, `actividad3_1` | Bajo | Ninguna. `<style>` local controla la vista. |
| `resource-summary-card` | Sí | `recursos_m1`, `recursos_m2`, `recursos_m3` | Bajo | Ninguna. |
| `resource-guidance-card` | Sí | `recursos_m1`, `recursos_m2`, `recursos_m3` | Bajo | Ninguna. |
| `resource-index` | Sí | `recursos_m1`, `recursos_m2`, `recursos_m3` | Bajo | Ninguna. |
| `bibliographic-resources`| Sí | `recursos_m1`, `recursos_m2`, `recursos_m3` | Bajo | Ninguna. |
| `bibliographic-resource` | Sí | `recursos_m1`, `recursos_m2`, `recursos_m3` | Bajo | Ninguna. |
| `forum-shell` | Sí | `foro_general`, `foro_modulo1` al `3` | Bajo | Ninguna. |
| `lesson-progressive-card`| Sí | `leccion1_2`, `leccion2_1`, `leccion2_2`, `leccion2_3` | Bajo | Ninguna. |
| `activity-summary-card` | Sí | `actividad2_1`, `actividad3_1` | Bajo | Ninguna. |
| `activity-tab-card` | Sí | `actividad3_1` | Bajo | Ninguna. |
| `module-route-card` | Sí | `modulo1_intro`, `modulo2_intro`, `modulo3_intro` | Bajo | Ninguna. |
| `module-key-message` | Sí | `modulo1_intro`, `modulo2_intro`, `modulo3_intro` | Bajo | Ninguna. |
| `forum-alert` | No | Ninguna | Nulo | Ninguna. Patrón listo para usarse. |
| `checkpoint-card` | No | Ninguna | Nulo | Ninguna. Patrón listo para usarse. |
| `completion-section-wrap`| No | Ninguna | Nulo | Ninguna. Patrón listo para usarse. |
| `lesson-remember` | No | Ninguna | Nulo | Ninguna. Patrón listo para usarse. |
| `lesson-toolbox` | No | Ninguna | Nulo | Ninguna. Patrón listo para usarse. |

## Análisis Técnico del Riesgo
Al inspeccionar el código fuente (ej. `leccion3_1.html`), se verifica la siguiente jerarquía en el `<head>`:
1. `<link rel="stylesheet" href="styles/main.css">`
2. `<style> ... </style>` local

Según las reglas de especificidad y cascada de CSS, los bloques `<style>` locales leídos *después* del archivo enlazado `main.css` tienen **precedencia**. Esto significa que aunque `main.css` ahora tenga una clase como `.concept-review`, el comportamiento en las páginas existentes está "protegido" y sobrescrito por su respectivo bloque local.

## 3. Conclusión
El nivel de riesgo de regresión visual es **Bajo y completamente controlado**. La inyección a `main.css` actúa en este momento de forma "silenciosa", preparando el terreno sin alterar la visualización actual de las páginas validadas.
Es seguro proceder con el commit de `main.css`.
