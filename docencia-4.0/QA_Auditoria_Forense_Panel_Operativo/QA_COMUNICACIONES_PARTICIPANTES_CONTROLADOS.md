# QA — Comunicaciones Reales a Participantes Controlados

## Estado

- Backend SendGrid: Integrado y funcional
- Dominio autenticado: callende.cloud
- Participantes reales: Habilitados (participants_controlled)
- Admin único en lista: Implementado
- Envío colectivo amplio: Restringido a 25 destinatarios
- Hosting desplegado: Sí
- Functions desplegado: Sí

## Cambios

| Archivo | Cambio |
|---|---|
| functions/index.js | Activada constante ENABLE_PARTICIPANT_REAL_SEND, removida restricción estricta de un solo admin, agregado bucle iterativo para envío individual, limite a 25. Actualizado estados de Firestore a real_send_sent/failed. |
| scripts/admin-communications-handler.js | Refactor de ADMIN_PILOT_PARTICIPANT por ADMIN_INTERNAL_RECIPIENT único. Filtro contra duplicados en lista. Modificado botón de enviar para que requiera teclear 'ENVIAR REAL' o 'COMUNICAR' según sea simulación o real. Excepción de filtro arreglada. |

## Guardas

| Guarda | Resultado |
|---|---|
| request.auth | Mantenida y funcional (usuario logueado requerido) |
| rol admin | Mantenida y funcional (rol admin requerido) |
| MAX_REAL_RECIPIENTS_PER_SEND | Implementada (límite frontend y backend a 25) |
| ENVIAR REAL | Implementado en prompt del frontend |
| Sin CC colectivo | Implementado, cada destinatario recibe en `to` exclusivo en loop del backend |
| Un email por destinatario | Asegurado por loop individual en Firebase Functions |
| Admin único en lista | Implementado con la función `getParticipantsWithSingleAdmin` |
| Firestore sin serverTimestamp en arrays | Validado, arrays de resultados usan strings `new Date().toISOString()`, `serverTimestamp` sólo en campos superiores. |

## QA Producción

| Prueba | Resultado |
|---|---|
| admin_comunicaciones carga | Aprobado, carga correctamente con Ctrl+F5 |
| Datalist sin duplicado admin | Aprobado, aparece únicamente Administrador |
| Simulación COMUNICAR | Aprobado, simulación sin envío backend ok |
| Envío real ENVIAR REAL | Aprobado, exige confirmación exacta y envía exitosamente |
| Firestore registra | Aprobado, crea status `real_send_sent` y `mode: real_participant_send` |
| Logs limpios | Aprobado, sin exposición de payloads completos, API keys ni errores INTERNAL 400/401 |

## Veredicto

- GO / NO-GO para uso controlado con participantes: GO
- GO / NO-GO para envío colectivo amplio: NO-GO (sin nueva autorización)
