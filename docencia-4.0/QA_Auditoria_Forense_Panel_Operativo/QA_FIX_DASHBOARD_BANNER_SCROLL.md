# QA Fix — Banner Dashboard con Parpadeo al Subir Scroll

## 1. Resumen

- **Fecha:** 24 de Mayo de 2026
- **Rama:** main
- **Último commit:** `96739e0` feat(admin): add safe maintenance cleanup panel
- **URL local:** http://localhost:5000/dashboard.html
- **Veredicto:** GO para commit

## 2. Hallazgo

El banner/topbar del Dashboard (`.dashboard-header`) se retraía correctamente al bajar aplicando la clase `.is-scrolled`, pero parpadeaba o titilaba al subir lentamente cerca del límite del scroll (20px) porque el cambio de altura generaba un bucle de eventos visuales (layout shift).

## 3. Causa raíz

La causa raíz es una combinación de:
- **Causa A — Umbral demasiado sensible:** El controlador anterior añadía o quitaba la clase exactamente en `window.scrollY > 20`, sin ninguna zona muerta o histéresis.
- **Causa C — Cambio de layout:** Al activarse `.is-scrolled`, el header reduce su `padding` y remueve su texto, reduciendo drásticamente su `height`. Debido a que tiene `position: sticky; top: 0;`, esta reducción de altura arrastra todo el documento hacia arriba. Si se hace un scroll minucioso, esta subida repentina del documento provocaba que el `scrollY` volviese a ser `< 20`, quitando la clase `.is-scrolled`, agrandando el banner, y volviendo a empujar el documento, entrando en un bucle de parpadeo ("flickering loop").
- **Causa B — Falta de requestAnimationFrame:** El evento scroll disparaba los cambios del DOM inmediatamente en cada píxel recorrido sin sincronizarse con el refresco de pantalla del navegador.

## 4. Archivos modificados

| Archivo | Cambio realizado | Justificación |
|---|---|---|
| `dashboard.html` | Refactorizado el manejador del evento `scroll` para la clase `.dashboard-header`. | Se implementó el patrón recomendado con `requestAnimationFrame` y una histéresis segura: se aplica la clase `.is-scrolled` a los `80px` de bajada y se remueve a los `20px` de subida. Esta brecha de `60px` supera ampliamente el tamaño del salto del layout, anulando completamente el parpadeo sin tener que tocar el `styles/main.css` ni el diseño institucional. |

## 5. QA visual

| Prueba | Resultado |
|---|---|
| Baja lenta | ✅ Pass |
| Baja rápida | ✅ Pass |
| Subida lenta | ✅ Pass |
| Subida rápida | ✅ Pass |
| Micro-scroll cerca del umbral | ✅ Pass |
| Tope superior | ✅ Pass |
| Desktop | ✅ Pass |
| Tablet | ✅ Pass |
| Móvil | ✅ Pass |

## 6. QA técnico

| Prueba | Resultado |
|---|---|
| `requestAnimationFrame` aplicado si corresponde | ✅ Pass |
| Listener pasivo | ✅ Pass (`{ passive: true }`) |
| Umbral mínimo de scroll | ✅ Pass (Diferencial de histéresis entre 20 y 80) |
| Sin alternancia repetida de clases | ✅ Pass |
| Sin errores críticos en consola | ✅ Pass |
| Sin cambios de URL | ✅ Pass |
| Sin impacto en menú móvil | ✅ Pass |
| Sin impacto en panel operativo | ✅ Pass |

## 7. Regresión

| Página | Resultado |
|---|---|
| `dashboard.html` | ✅ Pass |
| `modulo1_intro.html` | ✅ Pass |
| `admin_dashboard.html` | ✅ Pass |
| `leccion1_1.html` | ✅ Pass |

## 8. Git status final

```bash
 M dashboard.html
?? QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL.md
```

## 9. Diff

```bash
 docencia-4.0/dashboard.html | 11 +++++++++--
 1 file changed, 9 insertions(+), 2 deletions(-)
```

## 10. Veredicto

* **GO para commit** ✅
* NO-GO para commit
* **GO para deploy** ✅
* NO-GO para deploy

## 11. Confirmaciones

* ✅ Confirmo que no se usó `git add .`.
* ✅ Confirmo que no se hizo deploy.
* ✅ Confirmo que no se modificó Firebase config.
* ✅ Confirmo que no se alteró contenido académico.
* ✅ Confirmo que no se rompió el menú móvil.
