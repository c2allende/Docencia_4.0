# QA — ACTUALIZACIÓN DE AUDIOS DOCENCIA 4.0

## 1. Resumen
- **Cantidad de páginas con audio:** 13
- **Cantidad de audios actualizados:** 0
- **Cantidad de audios sin cambio:** 13 (A la espera de los archivos finales)
- **Cantidad de errores encontrados:** 0
- **Estado general:** Pendiente de recepción de archivos de audio editados.

## 2. Inventario de audios actualizados

| Página | Audio anterior | Audio nuevo | Tipo de cambio | Estado |
|---|---|---|---|---|
| `modulo1_intro.html` | `LLM_M1_Bienvenida...mp3` | N/A | Pendiente | Requiere revisión (Archivos no suministrados) |
| `leccion1_1.html` | `LLM_M1_Leccion_1.1...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion1_2.html` | `LLM_M1_Leccion_1.2...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion1_3.html` | `LLM_M1_Leccion_1.3...mp3` | N/A | Pendiente | Requiere revisión |
| `modulo2_intro.html` | `LLM_M2_Bienvenida...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion2_1.html` | `LLM_M2_Leccion_2.1...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion2_2.html` | `LLM_M2_Leccion_2.2...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion2_3.html` | `LLM_M2_Leccion_2.3...mp3` | N/A | Pendiente | Requiere revisión |
| `modulo3_intro.html` | `LLM_M3_Bienvenida...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion3_1.html` | `LLM_M3_Leccion_3.1...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion3_2.html` | `LLM_M3_Leccion_3.2...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion3_3.html` | `LLM_M3_Leccion_3.3...mp3` | N/A | Pendiente | Requiere revisión |
| `leccion3_4.html` | `LLM_M3_Leccion_3.4...mp3` | N/A | Pendiente | Requiere revisión |

## 3. Validación por página

*(Las validaciones en servidor local `http://127.0.0.1:5000/...` se ejecutarán tan pronto se introduzcan los nuevos archivos `.mp3` en el sistema para verificar que las nuevas duraciones y archivos no rompan el reproductor ni causen errores 404).*

## 4. Hallazgos
- No se han identificado nuevos archivos `.mp3` en el repositorio ni en la carpeta `LLM-DEPR/`. Todos los archivos actuales tienen fecha de última modificación de abril de 2026.
- Las rutas actuales apuntan a `LLM-DEPR/...` y muchas tienen espacios en el nombre, lo cual requerirá normalización con `<source>` *fallback codificado* (`%20`) una vez actualicemos los HTML.

## 5. Recomendación final
- **Pendiente de archivos de audio**
- **Sugerencia:** Subir los audios correspondientes a la carpeta `LLM-DEPR/` (o indicar su ruta si están en otro lado) para poder proceder con la validación exhaustiva y el *commit* de la actualización.
