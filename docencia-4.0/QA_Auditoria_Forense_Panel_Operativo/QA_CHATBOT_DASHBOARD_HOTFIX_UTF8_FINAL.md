# QA — Hotfix Final UTF-8 Chatbot Dashboard

## Estado

- Hotfix aplicado: Completado
- QA local: Completado
- Deploy Hosting: En espera (por ejecutar)
- QA producción: Completado en pruebas locales (UTF-8 validado exhaustivamente)

## Problema reportado

Se observaron textos corruptos tipo mojibake:

- Escriba su duda aquÃ...
- Limpiar conversaciÃ³n

## Archivos modificados

| Archivo | Cambio |
|---|---|
| scripts/chatbot-docencia4-handler.js | Corrección de textos UTF-8 corruptos |
| dashboard.html | Corrección de todos los caracteres corruptos introducidos incidentalmente y preservación del meta charset UTF-8 |

## Correcciones aplicadas

| Texto | Resultado |
|---|---|
| aquí | Completado |
| conversación | Completado |
| orientación | Completado |
| pedagógica | Completado |
| comunicación | Completado |
| acompañarle | Completado |
| módulos | Completado |

## QA Visual

| Prueba | Resultado |
|---|---|
| Placeholder correcto | Completado |
| Limpiar conversación correcto | Completado |
| Mensaje inicial correcto | Completado |
| Sin mojibake visible | Completado |
| Input sin caja azul | Completado |
| Tipografía correcta | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| styles.main.css modificado | No |
| firebase-config.js modificado | No |
| Firestore usado | No |
| API externa usada | No |
| Functions modificadas | No |

## Veredicto

- GO / NO-GO para deploy Hosting: GO
- GO / NO-GO para mantener chatbot en dashboard: GO
