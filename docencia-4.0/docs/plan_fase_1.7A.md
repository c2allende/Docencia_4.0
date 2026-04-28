# Plan Técnico: Extensión del Seguimiento de Progreso - Módulo 1

Este plan detalla la integración del sistema de seguimiento de progreso en todas las páginas del Módulo 1, asegurando que el total de páginas (9) se refleje correctamente en el Dashboard.

## 1. Inventario de Páginas del Módulo 1

| Archivo | ID de Página (`data-page-id`) | Tipo | Título | Estado Actual |
| :--- | :--- | :--- | :--- | :--- |
| `modulo1_intro.html` | `m1_intro` | `intro` | Inicio Módulo 1 | Falta Tracker |
| `leccion1_1.html` | `m1_l1` | `lesson` | Lección 1.1 | **Piloto OK** |
| `leccion1_2.html` | `m1_l2` | `lesson` | Lección 1.2 | Falta Tracker |
| `leccion1_3.html` | `m1_l3` | `lesson` | Lección 1.3 | Falta Tracker |
| `actividad1_1.html` | `m1_a1` | `activity` | Actividad 1.1 | **Piloto OK** |
| `actividad1_2.html` | `m1_a2` | `activity` | Actividad 1.2 | Falta Tracker |
| `trivia_1_1.html` | `m1_trivia1` | `quiz` | Trivia Lección 1.1 | Falta Tracker |
| `foro_modulo1.html` | `m1_foro` | `forum` | Foro Módulo 1 | Falta Tracker |
| `recursos_m1.html` | `m1_recursos` | `resources` | Recursos Módulo 1 | **Piloto OK** |

## 2. Tareas de Implementación

### A. Actualización de `progress-service.js`
Se modificará el objeto `COURSE_STRUCTURE` para reflejar el total real de páginas del Módulo 1.

```javascript
const COURSE_STRUCTURE = {
    'modulo1': {
        totalPages: 9,
        title: 'Fundamentos de los LLM'
    }
};
```

### B. Inyección de Metadatos y Contenedores
Para cada página marcada como "Falta Tracker", se realizarán los siguientes cambios:

1.  **Atributos en `<body>`**:
    *   `data-module-id="modulo1"`
    *   `data-page-id="[ver tabla]"`
    *   `data-page-type="[ver tabla]"`
    *   `data-title="[ver tabla]"`

2.  **Sección de Completado**:
    *   Insertar `<div id="completion-section"></div>` antes de la navegación del pie de página (`footer-nav`).

3.  **Scripts**:
    *   Asegurar la inclusión de:
        ```html
        <script type="module" src="scripts/progress-tracker.js"></script>
        ```

### C. Páginas Especiales
*   **`trivia_1_1.html`**: Se integrará el tracker. Aunque es un quiz independiente, su finalización marcará el progreso de esa página.
*   **`foro_modulo1.html`**: Se integrará el tracker para registrar que el usuario visitó y participó en el foro.

## 3. Verificación de Reglas Firestore
Las reglas actuales ya cubren las subcolecciones `progresoPaginas` y `progresoModulos` de forma genérica para cualquier `pageId` y `moduleId` bajo el UID del usuario, por lo que **no se requieren cambios adicionales en las reglas**.

## 4. Próximos Pasos
1.  Aprobación de este plan por parte del usuario.
2.  Edición masiva de los archivos del Módulo 1.
3.  Actualización de `COURSE_STRUCTURE`.
4.  Pruebas de navegación y confirmación en el Dashboard (el progreso debería ser 1/9, 2/9, etc.).
