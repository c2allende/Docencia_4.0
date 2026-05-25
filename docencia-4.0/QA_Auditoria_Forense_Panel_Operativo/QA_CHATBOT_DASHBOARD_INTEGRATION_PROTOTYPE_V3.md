# QA ‚Äî Chatbot Dashboard V3

## Estado

- Prototipo V3 creado: Completado
- QA visual: Completado
- QA funcional: Completado
- QA pedag√≥gica: Completado
- Deploy ejecutado: No

## Archivos creados

- dashboard_chatbot_integration_prototype_v3.html
- scripts/chatbot-docencia4-handler-integration-prototype-v3.js
- QA_CHATBOT_DASHBOARD_INTEGRATION_PROTOTYPE_V3.md

## Mejoras aplicadas

- Animaci√≥n m√°s interactiva del b√∫ho: Aplicado `owl-attention` con rotaci√≥n suave y escalado. Acelerado con clase `.is-attending` y `:hover`.
- Reducci√≥n de flash/fondo: Sombra de fondo fija sin el pulso de sombra excesivo.
- Apertura del panel desde el inicio: Implementada funci√≥n `resetChatbotPanelScroll()` en el evento de apertura.
- Nube de ayuda: Se vincula la aparici√≥n visual a la aceleraci√≥n de la animaci√≥n del b√∫ho temporalmente.
- Encabezado/panel: Panel conservado y animaciones preservadas respetando las directrices de Docencia 4.0.
- Accesibilidad: Soporte agregado de `prefers-reduced-motion: reduce`.

## QA visual

| Prueba | Resultado |
|---|---|
| B√∫ho visible | Completado |
| Animaci√≥n sutil | Completado |
| Sin flash excesivo | Completado |
| Panel c√°lido | Completado |
| Nube scroll | Completado |

## QA funcional

| Prueba | Resultado |
|---|---|
| Abre desde arriba | Completado |
| Chips funcionan | Completado |
| B√∫squeda funciona | Completado |
| Limpiar conversaci√≥n | Completado |
| Guardrails | Completado |
| Consola sin errores | Completado |

## Seguridad

| Criterio | Resultado |
|---|---|
| dashboard.html modificado | No |
| styles.main.css modificado | No |
| Firebase config modificado | No |
| Firestore usado | No |
| API externa usada | No |
| Producci√≥n modificada | No |

## URL local

http://localhost:5000/dashboard_chatbot_integration_prototype_v3.html

## Veredicto

- GO / NO-GO para revisi√≥n visual: GO
- GO / NO-GO para migraci√≥n al dashboard real: GO (pendiente revisi√≥n final del usuario)

## QA Fix ó Respuesta "øCÛmo comienzo?"

| Prueba | Resultado |
|---|---|
| Chip "øCÛmo comienzo?" responde correctamente | Completado |
| Texto "como comienzo" responde correctamente | Completado |
| Texto "cÛmo empiezo" responde correctamente | Completado |
| Texto "por dÛnde empiezo" responde correctamente | Completado |
| No cae en fallback | Completado |
| Respuesta pedagÛgica y orientadora | Completado |


## QA Fix ó Scroll de respuestas y versiÛn mÛvil/tableta

| Prueba | Resultado |
|---|---|
| Respuesta aparece desde el inicio | Completado |
| Chip "øCÛmo comienzo?" muestra respuesta completa correctamente | Completado |
| No requiere subir/bajar para encontrar inicio | Completado |
| BotÛn cerrar visible en mÛvil | Completado |
| Escape cierra en desktop | Completado |
| Panel mÛvil no ocupa 100vh | Completado |
| Panel tableta usable | Completado |
| Input accesible en mÛvil | Completado |
| Sin errores de consola | Completado |

