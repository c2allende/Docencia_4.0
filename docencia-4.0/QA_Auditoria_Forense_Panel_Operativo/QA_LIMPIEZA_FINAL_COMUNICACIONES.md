# QA — Limpieza Final Comunicaciones Administrativas

## 1. Objetivo

Eliminar residuos visuales/textuales del piloto técnico y dejar el módulo listo para uso institucional controlado.

## 2. Restricciones

- No tocar setupAdmin.
- No tocar functions/index.js.
- No tocar Firebase config.
- No tocar styles.main.css.
- No tocar contenido académico.
- No tocar SendGrid ni Cloudflare.
- No usar git add .

## 3. Cambios aplicados

| Área | Resultado |
|---|---|
| Botón de procesamiento | Separados en dos botones claros: "Simular comunicación" y "Enviar comunicación real" |
| Estado backend obsoleto | Eliminado el botón que decía "Envío real pendiente de backend seguro" |
| Modal de confirmación | Dinámico según la acción, solicitando solo "COMUNICAR" o "ENVIAR REAL" |
| Historial | Título actualizado a "Historial de comunicaciones" y mensaje base ajustado |
| Acciones Archivar/Borrar | Ahora muestran iconos y text tooltips "Archivar" y "Borrar" |
| Plantilla Redactar desde cero | Implementada con texto base, LMS link y firma de Equipo Docencia 4.0 |
| Reemplazo lmsLink | Verificado que {{lmsLink}} se reemplaza correctamente por la URL real |
| Elementos piloto | Ocultos del historial activo por defecto, filtrables |

## 4. QA Producción

| Prueba | Resultado |
|---|---|
| No aparece Admin — Piloto | Pass |
| Admin único | Pass |
| Botón limpio | Pass |
| Sin texto backend pendiente | Pass |
| Modal real solo ENVIAR REAL | Pass |
| Modal simulado solo COMUNICAR | Pass |
| Historial limpio | Pass |
| Mostrar archivados | Pass |
| Archivar | Pass |
| Borrar | Pass |
| Plantilla Redactar desde cero | Pass |
| lmsLink en vista previa | Pass |
| Consola sin errores | Pass |

## 5. Seguridad

| Criterio | Resultado |
|---|---|
| setupAdmin tocado | No |
| functions/index.js modificado | No |
| firebase-config.js modificado | No |
| styles.main.css modificado | No |
| API keys expuestas | No |
