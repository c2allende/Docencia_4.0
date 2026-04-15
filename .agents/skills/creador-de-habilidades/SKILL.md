---
name: Creador de Habilidades
description: Utiliza esta habilidad cuando necesites crear, estructurar o documentar nuevas habilidades (.skills) para Antigravity en este espacio de trabajo.
---

# Creador de Habilidades

Esta habilidad te permite generar nuevas capacidades para Antigravity de manera estructurada y siguiendo las mejores prácticas oficiales.

## Cuándo usar esta habilidad
- Cuando el usuario te pida "crear una nueva habilidad" o "añadir una skill".
- Cuando identifiques un patrón repetitivo que podría beneficiarse de ser una habilidad documentada.
- Cuando necesites estructurar procesos complejos dentro del directorio `.agents/skills/`.

## Instrucciones para el Agente

Para crear una nueva habilidad, sigue estos pasos rigurosamente:

### 1. Planificación
- **Nombre de la habilidad**: Define un nombre corto y descriptivo (ej. `gestor-de-base-de-datos`). Usa `kebab-case` para el nombre del directorio.
- **Descripción**: Redacta una descripción clara en español que explique qué hace la habilidad y bajo qué condiciones debe activarse.

### 2. Estructura de Archivos
Crea la siguiente estructura dentro del proyecto:
- `.agents/skills/<nombre-de-la-habilidad>/`
    - `SKILL.md`: El archivo principal de instrucciones (obligatorio).
    - `scripts/`: (Opcional) Si la habilidad requiere herramientas externas.
    - `examples/`: (Opcional) Ejemplos de uso para mejorar la precisión.

### 3. Formato del archivo `SKILL.md`
El archivo **debe** comenzar con el bloque YAML de metadatos:

```yaml
---
name: <Nombre Legible de la Habilidad>
description: <Descripción detallada en español para el selector de habilidades>
---
```

Después del bloque YAML, incluye:
- **Objetivo**: Qué intenta lograr la habilidad.
- **Instrucciones paso a paso**: Guía detallada para el agente.
- **Restricciones**: Qué NO debe hacer el agente al usar esta habilidad.

### 4. Implementación
- Asegúrate de crear primero los directorios necesarios.
- Utiliza la herramienta `write_to_file` para generar el contenido inicial.
- Informa al usuario una vez que la habilidad esté lista para ser detectada por el sistema.

---
**Nota**: Todas las habilidades creadas mediante esta herramienta deben estar documentadas en español para mantener la consistencia en este espacio de trabajo.
