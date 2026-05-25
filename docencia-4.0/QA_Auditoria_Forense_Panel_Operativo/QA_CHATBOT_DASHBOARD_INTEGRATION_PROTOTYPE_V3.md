# QA â€” Chatbot Dashboard V3

## Estado

- Prototipo V3 creado: Completado
- QA visual: Completado
- QA funcional: Completado
- QA pedagÃ³gica: Completado
- Deploy ejecutado: No

## Archivos creados

- dashboard_chatbot_integration_prototype_v3.html
- scripts/chatbot-docencia4-handler-integration-prototype-v3.js
- QA_CHATBOT_DASHBOARD_INTEGRATION_PROTOTYPE_V3.md

## Mejoras aplicadas

- AnimaciÃ³n mÃ¡s interactiva del bÃºho: Aplicado `owl-attention` con rotaciÃ³n suave y escalado. Acelerado con clase `.is-attending` y `:hover`.
- ReducciÃ³n de flash/fondo: Sombra de fondo fija sin el pulso de sombra excesivo.
- Apertura del panel desde el inicio: Implementada funciÃ³n `resetChatbotPanelScroll()` en el evento de apertura.
- Nube de ayuda: Se vincula la apariciÃ³n visual a la aceleraciÃ³n de la animaciÃ³n del bÃºho temporalmente.
- Encabezado/panel: Panel conservado y animaciones preservadas respetando las directrices de Docencia 4.0.
- Accesibilidad: Soporte agregado de `prefers-reduced-motion: reduce`.

## QA visual

| Prueba | Resultado |
|---|---|
| BÃºho visible | Completado |
| AnimaciÃ³n sutil | Completado |
| Sin flash excesivo | Completado |
| Panel cÃ¡lido | Completado |
| Nube scroll | Completado |

## QA funcional

| Prueba | Resultado |
|---|---|
| Abre desde arriba | Completado |
| Chips funcionan | Completado |
| BÃºsqueda funciona | Completado |
| Limpiar conversaciÃ³n | Completado |
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
| ProducciÃ³n modificada | No |

## URL local

http://localhost:5000/dashboard_chatbot_integration_prototype_v3.html

## Veredicto

- GO / NO-GO para revisiÃ³n visual: GO
- GO / NO-GO para migraciÃ³n al dashboard real: GO (pendiente revisiÃ³n final del usuario)

## QA Fix — Respuesta "¿Cómo comienzo?"

| Prueba | Resultado |
|---|---|
| Chip "¿Cómo comienzo?" responde correctamente | Completado |
| Texto "como comienzo" responde correctamente | Completado |
| Texto "cómo empiezo" responde correctamente | Completado |
| Texto "por dónde empiezo" responde correctamente | Completado |
| No cae en fallback | Completado |
| Respuesta pedagógica y orientadora | Completado |


## QA Fix — Scroll de respuestas y versión móvil/tableta

| Prueba | Resultado |
|---|---|
| Respuesta aparece desde el inicio | Completado |
| Chip "¿Cómo comienzo?" muestra respuesta completa correctamente | Completado |
| No requiere subir/bajar para encontrar inicio | Completado |
| Botón cerrar visible en móvil | Completado |
| Escape cierra en desktop | Completado |
| Panel móvil no ocupa 100vh | Completado |
| Panel tableta usable | Completado |
| Input accesible en móvil | Completado |
| Sin errores de consola | Completado |


## QA Fix V3-B — Inicio de respuesta, limpiar conversación y cierre móvil

| Prueba | Resultado |
|---|---|
| Respuesta larga inicia desde el primer renglón | Completado |
| Chip "¿Cómo comienzo?" no abre a mitad de respuesta | Completado |
| Limpiar conversación vuelve al inicio | Completado |
| Mensaje amarillo/informativo visible tras limpiar | Completado |
| X visible en desktop | Completado |
| X visible en tableta | Completado |
| X visible en celular | Completado |
| X cierra el panel | Completado |
| Escape sigue cerrando el panel | Completado |
| Panel móvil no atrapa al usuario | Completado |
| Sin errores de consola | Completado |

