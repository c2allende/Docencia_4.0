# Requerimientos de Integración: Solo URL Directa de Padlet

De acuerdo con la validación estratégica final, la integración de Padlet en Docencia 4.0 se simplifica para priorizar el rendimiento y la experiencia de usuario. **No se requiere ningún código de inserción (iframe) ni vista previa oficial.**

## 1. Tabla de Datos Requeridos

| Página | Actividad | Solución recomendada | URL directa | Código iframe completo | Código vista previa | Observaciones |
|---|---|---|---|---|---|---|
| `actividad1_2.html` | Actividad 1.2 | Tarjeta CTA externa | **Requerida** | No requerido | No requerido | Abre en nueva pestaña |
| `actividad2_1.html` | Actividad 2.1 | Tarjeta CTA externa con pasos | **Requerida** | No requerido | No requerido | Regresa al LMS para completar |
| `actividad3_1.html` | Actividad 3.1 | Tarjeta CTA externa | **Requerida** | No requerido | No requerido | Abre en nueva pestaña |

## 2. Formato de Entrega para el Usuario

Por favor, proporcione las URLs directas de los tableros en el siguiente formato:

### Actividad 1.2
**URL directa del Padlet:**
`[https://padlet.com/carmeloallende/llm-actividad-1-2-analisis-de-escenarios-descubriendo-la-ia--o6hvutesyg1t5yhs]`
Título: Actividad 1.2: Análisis de escenarios – "Descubriendo la IA en mi materia"
---

### Actividad 2.1
**URL directa del Padlet:**
`[https://padlet.com/carmeloallende/llm-actividad-2-1-del-prompt-al-recurso-validado-4txmilqn2bqet125]`
Título: Actividad 2.1: "Del prompt al recurso validado"
---

### Actividad 3.1
**URL directa del Padlet:**
`[https://padlet.com/carmeloallende/llm-actividad-3-1-ia-al-servicio-de-la-evaluacion-y-la-gesti-2osbq8uakrbcmtm8]`
Título: Actividad 3.1: “IA al servicio de la evaluación y la gestión docente”
## 3. Notas Técnicas
- **Formato del Botón:** Se implementará un enlace institucional con `target="_blank"` y `rel="noopener noreferrer"`.
- **Accesibilidad:** El botón incluirá un indicador visual de "Enlace externo" y una nota aclaratoria para el usuario.
- **Rendimiento:** Al no cargar scripts de Padlet en el LMS, el impacto en el tiempo de carga de la página es nulo.
