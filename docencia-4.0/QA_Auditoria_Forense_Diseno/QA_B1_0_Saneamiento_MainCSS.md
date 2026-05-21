# QA B1-0 — Saneamiento Forense de main.css

## 1. Objetivo
Auditar y reparar `docencia-4.0/styles/main.css` antes de continuar con nuevas calibraciones B1. El propósito fue reducir errores de cascada, eliminar bloques duplicados, limpiar agrupaciones peligrosas y normalizar los tokens huérfanos que estaban degradando la arquitectura limpia del CSS global.

## 2. Estado inicial
El último commit detectado fue `7867b23 chore(css): calibrate references component`. El archivo CSS presentaba múltiples versiones del componente Concept Review, uso de tokens experimentales no documentados en la raíz y agrupaciones masivas que forzaban propiedades a componentes que debían tener sus propios patrones BEM cerrados.

## 3. Hallazgos críticos

| Hallazgo | Evidencia | Riesgo | Acción tomada |
|---|---|---|---|
| Duplicación de Concept Review | Existían dos bloques: `Alt E3` (antiguo) y `B1-B` (nuevo). | Colisión de selectores y comportamientos no deseados en producción. | Eliminación del bloque Alt E3 completo y migración controlada de los pseudo-elementos (`[open]`, `::before`) al bloque B1-B. |
| Agrupación genérica peligrosa | Bloque "DOCENCIA 4.0 - COMPONENTES REUTILIZABLES LMS" agrupaba `.concept-review` y `.references-section`. | Forzaba el mismo layout en componentes con lógicas internas diferentes. | Se retiraron ambas clases de la lista de selectores genéricos. Las propiedades base (padding, bg, bordes) se trasladaron a la definición privada del componente. |
| Tokens no canónicos (huérfanos) | `--color-text-body`, `--color-surface-soft`, `--color-background-subtle`, `--font-family-code`, `--color-background-base`, `--radius-full`, `--container-max-width`. | Pérdida del control de design tokens institucionales, fallos de cascada de color. | Sustituidos globalmente por sus equivalentes canónicos aprobados en el `:root`. |
| Diferencias Conceptos/Referencias | Las reglas heredadas aún estaban esparcidas. | Inconsistencia en la interacción y jerarquía visual. | Se garantizó que ambos componentes usen exactamente las mismas variantes tipográficas y estructuras, sin colisión. |

## 4. Cambios realizados

### Tokens corregidos
- `--color-text-body` → `--color-text-secondary`
- `--color-surface-soft` → `--color-background-surface-low`
- `--color-background-subtle` → `--color-background-surface-low`
- `--font-family-code` → `--font-family-body`
- `--color-background-base` → `--color-white`
- `--radius-full` → `--radius-pill`
- `--container-max-width` → `--size-max-container`

### Duplicados eliminados
- Se borró el bloque `/* === COMPONENT — CONCEPT REVIEW (Alt E3) === */` (líneas 2965 a 3145 aprox) por redundancia técnica total.

### Agrupaciones ajustadas
- Las clases `.concept-review` y `.references-section` fueron desvinculadas de la regla madre genérica de "Componentes Reutilizables LMS" para proteger su cascada BEM.

### Componentes preservados
- `.references-compact` se conservó intacto y no fue degradado. Se documenta como deuda técnica menor el uso de `font-size: 0` para ocultar la etiqueta, pero se dejó inalterado porque no afecta visualmente.
- Todas las estructuras de `.lesson-remember` se conservaron.

## 5. Componentes NO tocados
- **Producción HTML:** NO se tocó `leccion3_4.html` ni ninguna página en producción.
- **Scripts:** NO se alteró ninguna lógica JS adicional.
- **Firebase / Progreso / Navegación:** Totalmente intactos.

## 6. Riesgos pendientes
- **`font-size: 0` en references action:** El patrón `.references-compact[open] .references-compact__action` funciona bien hoy, pero podría considerarse deuda técnica por accesibilidad (screen readers pueden ignorarlo).
- **Variantes antiguas:** Existen componentes como `.lesson-progressive-card` que podrían requerir su propia limpieza en futuras fases.
- Estilos locales todavía dispersos en HTML de lecciones reales (su remoción será en la migración B1-D).

## 7. Estado
B1-0 APROBADO — main.css saneado y listo para continuar B1-D.

**Nota QA Fix Visual (Incidencia documentada):**
Durante el QA visual inicial se detectó que el prototipo `leccion3_4_css_sanity_prototype.html` no mostraba "Ver / Ocultar conceptos". La razón fue que al ser un clon directo de `leccion3_4.html` (producción), no poseía el nuevo marcado HTML del `action-wrapper` calibrado en B1-B. Se procedió a inyectar el HTML correcto exclusivamente en el clon de saneamiento, confirmando el éxito rotundo del CSS saneado frente al patrón esperado. No se tocó producción (`leccion3_4.html`), no hubo deploy ni git add.
