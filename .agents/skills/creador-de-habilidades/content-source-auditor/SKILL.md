---
- No hay omisiones importantes.
- No hay cambios terminológicos no autorizados.
- No se alteró el orden de ideas si el orden es parte del documento.
- No se añadieron interpretaciones como si fueran parte de la fuente.

Señalar:

- Texto resumido sin autorización.
- Parafraseo de definiciones oficiales.
- Cambios de “modelos de lenguaje de gran tamaño” por términos genéricos.
- Eliminación de advertencias éticas, privacidad o sesgo.

### 2. Auditoría de alineación por módulo

Verificar:

- Recursos del Módulo 1 aparecen en páginas del Módulo 1.
- Recursos del Módulo 2 aparecen en páginas del Módulo 2.
- Recursos del Módulo 3 aparecen en páginas del Módulo 3.
- Actividades corresponden a su lección.
- Trivias o checkpoints evalúan el contenido correspondiente.
- No hay mezcla accidental de archivos o imágenes entre módulos.

### 3. Auditoría de metadatos

Verificar:

- Títulos consistentes.
- Nombres de módulo correctos.
- Numeración correcta de lecciones.
- Descripciones coherentes.
- Duración estimada si aplica.
- Tipo de recurso correcto.
- Slugs o IDs coherentes.

### 4. Auditoría de recursos

Verificar:

- PDFs enlazados corresponden al tema indicado.
- Imágenes ilustran el contenido correcto.
- Audios o videos corresponden a la lección correcta.
- Recursos descargables tienen nombres y descripciones adecuadas.
- No hay recursos huérfanos importantes.

### 5. Auditoría de enfoque ético y Human-in-the-Loop

Verificar que el contenido sobre LLM:

- No presente la IA como sustituto del docente.
- Mantenga al maestro cooperador como experto validador.
- Incluya advertencias sobre privacidad cuando aplique.
- Mencione sesgo o revisión crítica cuando corresponda.
- No solicite datos sensibles de estudiantes.
- Mantenga lenguaje responsable.

## Niveles de severidad

### P1 — Crítico

- Documento oficial alterado sin autorización.
- Contenido de un módulo publicado en otro módulo.
- Definición técnica cambiada de forma incorrecta.
- Advertencia ética o de privacidad eliminada.
- Recurso obligatorio equivocado o faltante.
- Actividad evalúa contenido que no fue enseñado.

### P2 — Importante

- Omisión parcial de contenido relevante.
- Título o metadato inconsistente.
- Recurso correcto, pero mal descrito.
- Terminología inconsistente.
- Falta referencia o trazabilidad a fuente.

### P3 — Mejora

- Nombre de archivo poco claro.
- Descripción de recurso mejorable.
- Orden de recursos puede optimizarse.
- Se recomienda añadir nota de revisión humana.

## Flujo de trabajo

```mermaid
flowchart TD
    A[Recibir página o módulo a auditar] --> B[Identificar fuente correspondiente]
    B --> C[Comparar título, estructura y contenido]
    C --> D[Comparar recursos y assets]
    D --> E[Verificar terminología y Human-in-the-Loop]
    E --> F[Clasificar discrepancias]
    F --> G[Emitir reporte de fidelidad]

Reglas críticas
1. No corregir silenciosamente

Si se encuentra una discrepancia, reportarla. No corregir el texto sin instrucción explícita.

2. No resumir la fuente

Al reportar, citar fragmentos breves o describir la discrepancia. No producir versiones resumidas del documento fuente.

3. Distinguir error de adaptación autorizada

Si el contenido fue marcado como “edición controlada”, puede aceptar cambios menores de estilo si conservan significado. Si fue marcado como “verbatim”, no aceptar cambios.

4. Preservar trazabilidad

Cada hallazgo debe indicar:

Fuente.
Página o archivo afectado.
Fragmento o sección.
Tipo de diferencia.
Recomendación.

Formato de reporte
# Content Source Audit — Docencia 4.0

## Summary

| Module/Page | Source Checked | Fidelity Status | Issues Detected | Critical Issues |
|---|---|---|---:|---:|
| {module/page} | {source file} | {pass/partial/fail} | {N} | {N} |

## Verdict

{Approved / Approved with notes / Requires revision}

## Source Mapping

| Published Content | Source Document | Status |
|---|---|---|
| `{page/file}` | `{source}` | {matched/partial/missing/mismatch} |

## Detected Issues

### [P1] {Issue title}

- **Published Location**: `{page or file}`
- **Source Location**: `{source document / section}`
- **Issue Type**: {omission, paraphrase, wrong module, terminology change, missing resource}
- **Problem**: {description}
- **Required Action**: {restore source text, remap resource, request human review, etc.}

### [P2] {Issue title}

- **Published Location**: `{page or file}`
- **Source Location**: `{source document / section}`
- **Problem**: {description}
- **Recommended Action**: {action}

## Human-in-the-Loop Review Notes

- {Ethical, privacy, bias or validation concerns}

## Final Recommendation

{Next action}

Checklist de auditoría

Antes de aprobar:

Fuente correcta identificada.
Títulos comparados.
Numeración de módulo/lección verificada.
Texto verbatim preservado si aplica.
Recursos asociados correctamente.
Terminología técnica consistente.
Human-in-the-Loop presente cuando aplica.
No hay contenido de otro módulo mezclado.
Hay trazabilidad clara.
Antipatrones

Evitar aprobar:

Contenido oficial parafraseado sin autorización.
Definiciones técnicas alteradas.
Recursos mal asignados por módulo.
Páginas sin fuente identificable.
Actividades desconectadas de la lección.
Prompts que solicitan datos sensibles.
Ausencia de revisión humana en actividades con LLM.
Títulos o numeración inconsistentes.
Definición de listo

Una auditoría de fuente está lista cuando:

Se identificó la fuente correspondiente.
Se comparó el contenido publicado con la fuente.
Se verificaron recursos, metadatos y módulo.
Se documentaron discrepancias por severidad.
Se preservó la fidelidad documental.
No quedan P1 sin revisión humana.
El contenido puede pasar a integración, corrección o publicación con trazabilidad clara.