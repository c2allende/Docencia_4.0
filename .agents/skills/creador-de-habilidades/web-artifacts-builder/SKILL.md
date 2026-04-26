---
name: web-artifacts-builder
description: Construye artefactos web complejos de Docencia 4.0 usando React + TypeScript + Vite + Tailwind + shadcn/ui, respetando el sistema visual oficial definido en `src/styles/main.css`. Úsalo para artefactos con múltiples componentes, estado, routing, shadcn/ui, empaquetado o bundling. Para decisiones visuales de composición, movimiento, énfasis cromático, jerarquía tipográfica y registro visual, deferir al skill `frontend-design`.
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder — Docencia 4.0

Esta habilidad se encarga de construir, organizar y empaquetar artefactos web complejos. Su rol principal es técnico: scaffolding, integración del sistema visual, configuración de Tailwind/shadcn, estructura del proyecto, componentes, estado, bundling y entrega del artefacto.

Este agente no es la fuente primaria de decisiones visuales. Para composición, tono visual, layout creativo, microinteracciones, jerarquía visual y registro de diseño, debe seguir el skill `frontend-design`.

## Stack recomendado

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Parcel o herramienta equivalente para bundling cuando se requiera un HTML final autocontenido

## Responsabilidad del agente

Este agente debe encargarse de:

- Inicializar o estructurar artefactos complejos.
- Integrar correctamente `src/styles/main.css`.
- Configurar Tailwind para respetar la marca Docencia 4.0.
- Adaptar shadcn/ui para que herede los tokens visuales del proyecto.
- Construir componentes funcionales y reutilizables.
- Manejar estado, props, composición, rutas o vistas internas si aplica.
- Empaquetar el artefacto para entrega.
- Mantener el código claro, modular y listo para producción.

Este agente no debe:

- Crear otro archivo de tokens duplicado.
- Sustituir `src/styles/main.css` por `tokens.css` u otro sistema visual paralelo.
- Inventar colores, radios, sombras o fuentes.
- Tomar decisiones visuales que contradigan `frontend-design`.
- Usar shadcn con su apariencia por defecto si entra en conflicto con Docencia 4.0.

## Fuente única de verdad visual

El archivo oficial del sistema visual es:

```text
src/styles/main.css