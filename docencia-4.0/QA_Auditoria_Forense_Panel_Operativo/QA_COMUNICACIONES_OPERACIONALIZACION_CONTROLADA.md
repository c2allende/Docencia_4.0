# QA — Operacionalización Controlada de Comunicaciones Reales

## 1. Estado inicial

- Backend SendGrid: Operativo (Prueba Admin-Only Validada)
- Firestore: Operativo (Registro validado tras corrección de serverTimestamp)
- Hosting: Intacto (Sin deploy)
- Participantes reales existentes: 0
- Envío real masivo autorizado: No

## 2. Objetivo

Preparar envío real controlado sin activar uso masivo ni comprometer el LMS.

## 3. Restricciones

- No modificar diseño global.
- No modificar Firebase config.
- No modificar styles/main.css.
- No enviar a participantes reales en esta fase.
- No hacer deploy de Hosting sin autorización.

## 4. Participantes actuales

| Fuente | Resultado |
|---|---|
| Colección usuarios | 0 |
| Participantes con rol participante | 0 |
| Participantes seleccionables en comunicaciones | 0 |
| Emails reales de participantes detectados | 0 |

## 5. Guardas backend

| Guarda | Resultado |
|---|---|
| request.auth requerido | Confirmado |
| rol admin requerido | Confirmado |
| recipients.length validado | Confirmado |
| admin-only test preservado | Confirmado |
| envío real a participantes bloqueado | Confirmado |
| kill switch backend presente | Confirmado |
| replyTo una sola dirección | Confirmado |
| serverTimestamp no usado dentro de arrays | Confirmado |

## 6. Estado frontend

| Criterio | Resultado |
|---|---|
| ENABLE_REAL_EMAIL_BACKEND en false | Confirmado |
| No hay botón real abierto | Confirmado |
| UI producción intacta | Confirmado |
| No cambios visuales globales | Confirmado |

## 7. Estado SendGrid

| Criterio | Resultado |
|---|---|
| API Key nueva en Secret Manager | Esperando acción del usuario |
| Permiso limitado a Mail Send | Esperando acción del usuario |
| Sender verificado | Confirmado |
| Credenciales no expuestas | Confirmado |

## 8. Participantes

| Criterio | Resultado |
|---|---|
| Participantes reales existentes | 0 |
| Pruebas a participantes | No |
| Envío colectivo real | No |

## 9. Veredicto

- GO / NO-GO para mantener backend SendGrid: GO
- GO / NO-GO para mantener admin-only: GO
- GO / NO-GO para activar participantes: NO-GO
