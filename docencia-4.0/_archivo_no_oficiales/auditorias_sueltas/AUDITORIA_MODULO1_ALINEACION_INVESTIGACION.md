# AUDITORIA_MODULO1_ALINEACION_INVESTIGACION.md

## 1. Inventario de Componentes del Módulo 1

Se ha realizado un barrido completo del espacio de trabajo para identificar todos los activos vinculados al Módulo 1.

| Componente | Archivo de Producción | Prototipo Existente | Estado |
| :--- | :--- | :--- | :--- |
| **Introducción** | `modulo1_intro.html` | `modulo1_intro_ux_carga_cognitiva_prototype.html` | **Aprobado (Modelo)** |
| **Lección 1.1** | `leccion1_1.html` | `leccion1_1_prototype.html` | Requiere Rediseño (Visual/UX) |
| **Lección 1.2** | `leccion1_2.html` | N/A | Faltante Prototipo |
| **Lección 1.3** | `leccion1_3.html` | N/A | Faltante Prototipo |
| **Actividad 1.1** | `actividad1_1.html` | N/A | Requiere Rediseño (UX/UI) |
| **Actividad 1.2** | `actividad1_2.html` | N/A | Requiere Rediseño (Padlet CTA) |
| **Recursos M1** | `recursos_m1.html` | N/A | Requiere Rediseño (Biblioteca) |
| **Foro Módulo 1** | `foro_modulo1.html` | N/A | Requiere Verificación de Contenido |
| **Trivia 1.1** | `trivia_1_1.html` | N/A | Elemento Funcional |

---

## 2. Mapa de Alineación e Impacto Pedagógico

### Introducción del Módulo 1
*   **Propósito:** Establecer el contrato pedagógico y el contenedor mental del módulo.
*   **Relación con Investigación:** Define al docente como "facilitador" y no solo "usuario".
*   **UX-UI:** Contenedor flotante, H1 limpio, lectura progresiva. (Modelo a seguir).

### Lección 1.1: Conceptualización y Panorama
*   **Propósito:** Definir LLM, Transformers y diferenciar de buscadores.
*   **Evidencia:** Comprensión de la lógica probabilística (evitar frustración ante "alucinaciones").
*   **Riesgo Carga Cognitiva:** Alta densidad técnica. Requiere fragmentación (chunking).
*   **Componentes UX:** Tarjetas de conceptos, glosario interactivo, audio integrado.

### Lección 1.2: Aplicaciones por Áreas
*   **Propósito:** Contextualizar la IA en STEM, Humanidades y Ed. Especial.
*   **Relación con Investigación:** Reducción de carga administrativa mediante personalización (DUA).
*   **UX-UI:** Sistema de pestañas o acordeones por área para evitar scroll excesivo.

### Lección 1.3: Ética y "Human in the Loop"
*   **Propósito:** Salvaguardar datos (FERPA/PII) y establecer el rol de validador.
*   **Evidencia:** Capacidad de anonimizar datos antes de interactuar con IA.
*   **Riesgo:** Sobrecarga moral/administrativa.
*   **Componentes UX:** Listas de verificación (Checklists) interactivas, bloque de "Regla de Oro".

### Actividades (1.1 y 1.2)
*   **Propósito:** Primer acceso y descubrimiento de casos de uso reales.
*   **Investigación:** "Quick wins" para reducir la tecnofobia y aumentar la autoeficacia.
*   **UX-UI:** Guías paso a paso con botones de "Copiar Prompt" y CTAs claros para Padlet/Foro.

---

## 3. Elementos Críticos (No Romper)

1.  **Integridad de Audio:** Todos los archivos `LLM_M1_...audio.mp3` deben permanecer vinculados.
2.  **Tracking de Progreso:** Los IDs de página (`data-page-id`) deben ser idénticos a producción para no romper Firebase.
3.  **Fuentes de Verdad:** Se debe usar el contenido de los archivos `.md` en `LLM-DEPR/` como base textual única.
4.  **Interactivos Externos:** Los iframes de Genially y la Trivia 1.1 deben integrarse respetando su funcionalidad original.

---

## 4. Identificación de Riesgos de Carga Cognitiva

1.  **Densidad Textual:** Las lecciones en producción tienen párrafos demasiado largos sin pausas visuales.
2.  **Navegación Compleja:** Falta de indicadores claros de "qué sigue" en las actividades.
3.  **Fragmentación de Recursos:** La página de recursos actual es una lista plana; requiere una estructura de "Biblioteca" organizada por tipo (Lectura, Video, Herramienta).

---

## 5. Recomendación del Orden de Rediseño (Módulo 1 Piloto)

Para asegurar una validación incremental, se propone el siguiente flujo:

1.  **Lección 1.1:** (Prioridad 1) Es la base conceptual. Establece el tono técnico.
2.  **Lección 1.3:** (Prioridad 2) Fundamental para la ética y seguridad (requisito para las actividades).
3.  **Lección 1.2:** (Prioridad 3) Conecta con la realidad específica de cada maestro.
4.  **Actividad 1.1 + Foro:** (Prioridad 4) Cierra el primer ciclo de práctica y reflexión.
5.  **Actividad 1.2 + Recursos:** (Prioridad 5) Expande el descubrimiento y ofrece andamiaje continuo.

---

**Firma:** Antigravity (IA Agent)  
**Fecha:** 14 de mayo de 2026
