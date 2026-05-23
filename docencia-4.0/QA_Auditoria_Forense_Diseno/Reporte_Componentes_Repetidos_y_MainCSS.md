# REPORTE — COMPONENTES REPETIDOS Y CENTRALIZACIÓN EN main.css

## 1. Resumen ejecutivo
- **Total de componentes repetidos identificados:** 15 patrones principales.
- **Componentes consistentes:** `#completion-section`, botones básicos (`.btn`, `.btn-primary`), y navegación final (`.footer-nav`) mantienen una alta consistencia a nivel de HTML, aunque presentan leves variaciones de espaciado debido a estilos en línea.
- **Componentes inconsistentes:** Introducciones de módulo (tamaño de H1), tarjetas de lectura progresiva (colores hardcoded), foros (alertas de sesión con background fijo), y componentes interactivos como ejemplos de prompts (`leccion2_3.html`).
- **Componentes que deben centralizarse en main.css:** 100% de los identificados. El patrón actual delega excesiva responsabilidad a los bloques `<style>` locales en el `<head>` de cada archivo.
- **Riesgo si no se corrige:** Mantenimiento insostenible. Cualquier ajuste de branding futuro requeriría editar 23 archivos individuales. Además, hay riesgo alto de "deriva visual" a medida que se creen nuevos módulos.
- **Recomendación general:** Proceder con la implementación de las clases propuestas en `styles/main.css` y comenzar una refactorización de HTML progresiva (Fase B).

---

## 2. Inventario de componentes repetidos

*(El detalle completo se encuentra en el archivo `Inventario_Componentes_Repetidos_Docencia_4_0.md` en este mismo directorio).*

---

## 3. Componentes con mayor deriva visual

### Encabezados en Introducciones de Módulo
- **Páginas afectadas:** `modulo1_intro.html`, `modulo2_intro.html`, `modulo3_intro.html`
- **Diferencias encontradas:** Uso de `style="font-size:1.5rem;"` que sobreescribe la jerarquía esperada para un `H1`.
- **Evidencia:** Screenshots de la fase 1 (H1 visiblemente pequeño).
- **Patrón recomendado:** Sistema tipográfico global.
- **Acción sugerida:** Centralizar bajo `.module-key-message` y clases `.text-4xl` / `.text-5xl`.

### Alertas en Foros
- **Páginas afectadas:** `foro_modulo1.html`, `foro_modulo2.html`, `foro_modulo3.html`
- **Diferencias encontradas:** Background `#fff3cd` hardcoded mediante atributo `style`.
- **Evidencia:** Screenshots de la fase 1 (Foros).
- **Patrón recomendado:** Alertas basadas en tokens semánticos (warning).
- **Acción sugerida:** Centralizar alerta en `.forum-participation-card` o `.alert-warning`.

### Bloques Toolbox / Ejemplos de Prompt
- **Páginas afectadas:** `leccion2_1.html`, `leccion2_3.html`
- **Diferencias encontradas:** Uso intensivo de CSS inline para el componente de copiado de texto y salida de consola.
- **Evidencia:** `leccion2_3_desktop_hallazgo01.png`.
- **Patrón recomendado:** Tarjeta oscura interactiva tokenizada.
- **Acción sugerida:** Centralizar en `.lesson-toolbox`.

---

## 4. Componentes que deben añadirse a main.css

| Clase propuesta | Propósito | Páginas que la usarían | Reemplaza estilos locales | Prioridad |
|-----------------|-----------|------------------------|---------------------------|-----------|
| `.lesson-progressive-card` | Acordeones y lectura paulatina | Todas las lecciones | CSS inline y `<style>` | 1 - Alta |
| `.forum-purpose-card` | Alertas e intro de foros | Foros | Background hardcoded | 1 - Alta |
| `.module-key-message` | Resumen e intro del módulo | Introducciones | Inline `font-size` en H1 | 1 - Alta |
| `.lesson-toolbox` | Cajas interactivas de prompts | Lección 2.1, 2.3 | Extensos `<style>` locales | 2 - Media |
| `.activity-steps` | Flujo de pasos en actividades | Actividades | Márgenes locales | 2 - Media |
| `.concept-review` | Cierre consolidado de conceptos | Todas las lecciones | Reglas redundantes en `head` | 2 - Media |
| `.checkpoint-card` | Contenedor de iframe Genially | Todas las lecciones | Padding y bordes en `head` | 3 - Baja |
| `.resource-bank-shell` | Contenedor de recursos/plantillas | Recursos | Bloques locales repetidos | 3 - Baja |

---

## 5. Reglas locales que deben eliminarse después de centralizar

Para completar la migración con éxito, será imperativo purgar los archivos HTML de:
- **Estilos inline:** Todo atributo `style="..."` deberá ser eliminado.
- **Bloques `<style>`:** El 95% del contenido de las etiquetas `<style>` dentro del `<head>` de cada lección/actividad debe ser borrado tras mover las clases a `main.css`.
- **Colores hardcoded:** Eliminación total de hexadecimales (ej. `#fff3cd`) reemplazándolos por `var(--color-...)`.

---

## 6. Plan de implementación controlado

### Fase A — Centralización CSS
Añadir el nuevo bloque de "COMPONENTES REUTILIZABLES LMS" al final de `styles/main.css`. Esta acción es 100% segura ya que no altera el HTML actual, solo expone las nuevas clases.

### Fase B — Migración HTML por tipo de página
Para evitar rupturas masivas, se modificará el HTML en este orden estricto, haciendo commit al final de cada subfase:
1. Introducciones de módulo (archivos más simples).
2. Foros (para remover colores hardcoded).
3. Lecciones (el mayor volumen de trabajo, consolidando `.lesson-card` y `.lesson-progressive-card`).
4. Actividades y Recursos.

### Fase C — QA visual comparativo
Verificar localmente que las páginas migradas se vean idénticas o superiores a la versión pre-migración (pero ahora sin deuda técnica).

---

## 7. Riesgos

- **Pérdida de diseño aprobado:** Eliminar un `style` inline sin mapear correctamente su clase equivalente puede causar un retroceso visual.
- **Cambios inesperados por cascada CSS:** Si una nueva clase en `main.css` tiene menor especificidad que las reglas antiguas, el navegador podría renderizar de forma imprevista.
- **Impacto en mobile:** Centralizar paddings requiere verificar exhaustivamente que los media queries en `main.css` cubran los casos de tarjetas anidadas.

---

## 8. Recomendación final

**Se recomienda proceder con la centralización (Fase A y B) antes del próximo gran deploy.**
El sistema está en un estado óptimo para absorber esta refactorización, dado que la arquitectura visual ya ha sido aprobada por QA. Centralizar ahora garantiza que el Módulo 4 y futuros módulos se construyan en una fracción del tiempo, al contar con un ecosistema de componentes ya tokenizado en `main.css`.

*(Fin del reporte)*
