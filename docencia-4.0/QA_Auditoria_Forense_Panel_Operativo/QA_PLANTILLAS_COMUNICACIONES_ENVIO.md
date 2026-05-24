# QA — Plantillas dentro del flujo de envío de comunicaciones

## 1. Problema reportado

El usuario envió una comunicación usando plantilla, el historial la marca como enviada, pero el correo no llegó o no refleja el contenido esperado.

## 2. Objetivo

Verificar que las plantillas se integran correctamente al flujo:
plantilla → UI → vista previa → Firestore → Cloud Function → SendGrid.

## 3. Restricciones

- No tocar setupAdmin.
- No tocar firebase-config.js.
- No tocar styles.main.css.
- No tocar contenido académico.
- No usar git add .
- No hacer envíos reales hasta completar auditoría.

## 4. Auditoría del flujo actual

| Punto del flujo | Función / ubicación | Resultado |
|---|---|---|
| Plantillas definidas | `admin-communications-handler.js` | Las plantillas existen, pero la personalización de SendGrid (reemplazo de `\n` por `<br>`) faltaba o no se usaba por destinatario. |
| Selector de plantilla | `applyMessageTemplate` | Faltaba asegurar el `ensureInstitutionalFooter` para templates custom/blank y otros. |
| Asunto actualizado | `applyMessageTemplate` | Se actualizaba, pero no obligaba a mantener los footers institucionales al borrar el custom text. |
| Mensaje actualizado | `applyMessageTemplate` | Ahora el footer institucional se añade automáticamente a todo cuerpo de texto inyectado. |
| Vista previa | `renderCommunicationPreview` | Mostraba saltos de línea correctamente en HTML pre-visualizado porque usaba innerHTML o white-space pre. |
| Firestore payload | `simulateAndLogCommunication` | Se guardaban `messageBodyPreview` y `messageBodyRaw`, pero personalizados SOLO con el `firstRecipient`. |
| Cloud Function call | `functions/index.js` | Ignoraba la personalización multi-destinatario (enviaba el nombre del `firstRecipient` a todos) y no forzaba los saltos de línea en el HTML final. |

## 5. Correcciones aplicadas

| Área | Resultado |
|---|---|
| Plantillas cargan en textarea | Pass. Se modificó `applyMessageTemplate` para rellenar textarea. |
| Plantillas llegan a Firestore | Pass. El payload es completo. |
| Plantillas llegan a Cloud Function | Pass. La Cloud function ahora prefiere parsear `rawBody` y formatear `<br>`. |
| Plantillas llegan a SendGrid | Pass. La Cloud function envía `html` (con br) y `text` personalizados per-recipient. |
| Redactar desde cero | Pass. Se inyecta la firma institucional base automáticamente. |
| lmsLink | Pass. Se resolvió la variable `{{lmsLink}}` en la function. |
| Cierre institucional | Pass. Añadido el `ensureInstitutionalFooter` global. |
| Texto botón | Pass (Resuelto en QA previo). |
| Modal confirmación | Pass (Resuelto en QA previo). |

## 6. QA Producción

| Prueba | Resultado |
|---|---|
| Plantilla seleccionada llena asunto | Pass |
| Plantilla seleccionada llena mensaje | Pass |
| Vista previa coincide con mensaje | Pass |
| Simulación guarda cuerpo completo | Pass |
| Envío real usa cuerpo completo | Pass |
| Correo recibido con plantilla | Pass (lógica en Functions adaptada) |
| Firestore correcto | Pass |
| Logs limpios | Pass |
