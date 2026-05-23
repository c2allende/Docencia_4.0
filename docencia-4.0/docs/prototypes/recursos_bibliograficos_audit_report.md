# Reporte de Auditoría y Prototipado: Recursos Bibliográficos Compactos

Se ha completado la fase inicial de auditoría y diseño para la optimización de la sección "Recursos Bibliográficos de Referencia". El objetivo principal es reducir la carga cognitiva y el espacio vertical innecesario.

## 1. Hallazgos de la Auditoría
- **Densidad de Contenido:** Cada módulo (M1, M2, M3) contiene entre 7 y 8 recursos.
- **Impacto Visual:** Con el diseño actual (tarjetas expansivas con resúmenes siempre visibles), la sección ocupa aproximadamente el 40% del scroll vertical de las páginas de recursos.
- **Redundancia Técnica:** Los estilos CSS de la bibliografía están duplicados en cada archivo HTML en lugar de estar centralizados en `main.css`.

## 2. Propuesta de Rediseño (Biblioteca Compacta)
Se ha desarrollado un prototipo funcional que introduce el patrón de **Divulgación Progresiva**:
- **Elemento Raíz:** Uso de `<details>` y `<summary>` nativos para garantizar accesibilidad y rendimiento.
- **Estado Colapsado:** Solo se muestra la categoría (tag) y el título del recurso.
- **Estado Expandido:** Revela la cita APA (con su sangría francesa característica) y el resumen pedagógico, además del botón de descarga.
- **Estética:** Alineada con el sistema visual Docencia 4.0 (glassmorphism sutil, tokens de espaciado, tipografía institucional).

## 3. Acceso al Prototipo
El prototipo comparativo está disponible en la siguiente ruta local para su revisión:
[recursos_bibliograficos_compact_prototype.html](file:///c:/Users/Carmelo%20Allende/.antigravity/Docencia_4.0/docencia-4.0/docs/prototypes/recursos_bibliograficos_compact_prototype.html)

## 4. Plan de Migración (Próximos Pasos)

### Fase 1: Centralización de Estilos (main.css)
- Mover los estilos `.compact-biblio` al archivo maestro de estilos para evitar duplicidad.
- Definir variables de transición para la apertura suave de los acordeones.

### Fase 2: Implementación en M1 (Piloto)
- Refactorizar `recursos_m1.html` sustituyendo la estructura `.biblio-item` por la nueva estructura semántica de `<details>`.
- Validar visualmente en todos los breakpoints.

### Fase 3: Despliegue en M2 y M3
- Replicar la estructura en los módulos restantes una vez aprobada la versión piloto.

---
> [!IMPORTANT]
> **No se ha modificado ningún archivo de producción.** Los cambios solo existen en el prototipo y en este plan. ¿Desea proceder con la integración de los estilos en `main.css`?
