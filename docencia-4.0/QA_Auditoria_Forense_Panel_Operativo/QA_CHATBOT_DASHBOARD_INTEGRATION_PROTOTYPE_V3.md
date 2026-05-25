# QA — Chatbot Dashboard V3

## Estado

- Prototipo V3 creado: Completado
- QA visual: Completado
- QA funcional: Completado
- QA pedagógica: Completado
- Deploy ejecutado: No

## Archivos creados

- dashboard_chatbot_integration_prototype_v3.html
- scripts/chatbot-docencia4-handler-integration-prototype-v3.js
- QA_CHATBOT_DASHBOARD_INTEGRATION_PROTOTYPE_V3.md

## Mejoras aplicadas

- Animación más interactiva del búho: Aplicado `owl-attention` con rotación suave y escalado. Acelerado con clase `.is-attending` y `:hover`.
- Reducción de flash/fondo: Sombra de fondo fija sin el pulso de sombra excesivo.
- Apertura del panel desde el inicio: Implementada función `resetChatbotPanelScroll()` en el evento de apertura.
- Nube de ayuda: Se vincula la aparición visual a la aceleración de la animación del búho temporalmente.
- Encabezado/panel: Panel conservado y animaciones preservadas respetando las directrices de Docencia 4.0.
- Accesibilidad: Soporte agregado de `prefers-reduced-motion: reduce`.

## QA visual

| Prueba | Resultado |
|---|---|
| Búho visible | Completado |
| Animación sutil | Completado |
| Sin flash excesivo | Completado |
| Panel cálido | Completado |
| Nube scroll | Completado |

## QA funcional

| Prueba | Resultado |
|---|---|
| Abre desde arriba | Completado |
| Chips funcionan | Completado |
| Búsqueda funciona | Completado |
| Limpiar conversación | Completado |
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
| Producción modificada | No |

## URL local

http://localhost:5000/dashboard_chatbot_integration_prototype_v3.html

## Veredicto

- GO / NO-GO para revisión visual: GO
- GO / NO-GO para migración al dashboard real: GO (pendiente revisión final del usuario)
