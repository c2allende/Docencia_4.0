# QA — Chatbot Dashboard V2

## Estado
- Prototipo V2 creado: Completado
- QA visual: Completado
- QA funcional: Completado
- QA pedagógica: Completado
- Deploy ejecutado: No

## Archivos creados
- dashboard_chatbot_integration_prototype_v2.html
- scripts/chatbot-docencia4-handler-integration-prototype-v2.js
- QA_CHATBOT_DASHBOARD_INTEGRATION_PROTOTYPE_V2.md

## Mejoras aplicadas
- Integración visual más cálida
- Uso del búho/logo Docencia 4.0
- Animación sutil del búho
- Globo de ayuda activado por scroll
- Reescritura de mensaje inicial
- Mejora de chips y tono visual

## QA visual
- Botón/Avatar: Integrado con el logo del búho.
- Globo: Aparece debajo y guiando la mirada hacia el botón.
- Animación: Animación cíclica (pulso) y movimiento de cabeza en hover.
- Panel: Estilos cálidos añadidos (borde naranja sutil).
- Responsive: Funciona adaptándose a pantallas móviles.

## QA funcional
- Apertura/cierre: Funciona y auto-cierra el globo.
- Scroll hint: Aparece tras desplazar la página hacia abajo (scrollY > 400).
- Chips: Textos actualizados y fluidos.
- FAQ: Respuestas base mantenidas.
- Guardrails: Tono ajustado, funcionalidad preservada.
- Consola: Sin errores.

## Seguridad
- dashboard.html modificado: No
- styles.main.css modificado: No
- Firebase config modificado: No
- Firestore: No usado
- API externa: No usada
- Producción: No modificada

## URL local
- http://localhost:5000/dashboard_chatbot_integration_prototype_v2.html

## Veredicto
- GO / NO-GO para revisión visual: GO
- GO / NO-GO para migración al dashboard real: GO (pendiente revisión final del usuario)
