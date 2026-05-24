# QA Fix Revisión 3 — Banner Dashboard Retraíble sin Parpadeo

## 1. Estado

- **QA anterior:** NO aprobado
- **Motivo:** la solución dejó el banner estático, lo cual no cumplía con el requisito UX/UI de retraerse al bajar.
- **Requisito UX/UI:** el banner debe retraerse al bajar y reaparecer al subir.
- **Deploy:** NO ejecutado

## 2. Causa raíz final

El parpadeo se debía al cambio dimensional que producía la antigua clase `.is-scrolled` dentro de un elemento `sticky`. Al activarse, esta clase reducía el padding y ocultaba elementos, encogiendo abruptamente el banner. Esta pérdida de altura reducía el largo total del documento, provocando un *reflow* y un ajuste de *viewport* que devolvía el `scrollY` a un valor menor, desencadenando un bucle infinito de parpadeo y saltos de layout incontrolables.

## 3. Solución aplicada

Se reemplazó la lógica dimensional por una arquitectura visual de **dos capas**:
- **Shell Estable (`.dashboard-scroll-shell`):** Un contenedor `sticky` envolvente que mantiene fija su posición en la estructura del documento y asume los márgenes inferiores. No cambia de altura durante el scroll, eliminando de raíz cualquier salto de layout.
- **Banner Visual (`.dashboard-scroll-banner`):** El propio header original que, ahora posicionado de forma relativa al shell, se retrae fluida y limpiamente usando **únicamente `transform: translateY`**. Al usar `transform`, el elemento se desplaza fuera de la pantalla sin alterar el flujo del documento (sin reflow).
Se eliminó la antigua clase `.is-scrolled` y se implementó un controlador pasivo en JavaScript usando `requestAnimationFrame` que gestiona las clases puramente visuales `.is-retracted` e `.is-visible`.

## 4. Archivos modificados

| Archivo | Cambio realizado | Justificación |
|---|---|---|
| `dashboard.html` | Se envolvió `<header>` en un shell `.dashboard-scroll-shell`, se añadieron clases y CSS local con `transform`, y se reescribió el script de control de scroll. | Cumplir el requisito de retracción sin recurrir a cambios dimensionales que causan reflow y parpadeo. |

## 5. QA visual humano

| Prueba | Resultado |
|---|---|
| Baja lenta | ✅ Pass |
| Baja rápida | ✅ Pass |
| Subida lenta | ✅ Pass |
| Subida rápida | ✅ Pass |
| Micro-scroll cerca del umbral | ✅ Pass |
| Repetición 5 ciclos | ✅ Pass |
| Desktop | ✅ Pass |
| Móvil | ✅ Pass |
| Banner se retrae | ✅ Pass |
| Banner reaparece | ✅ Pass |
| Sin parpadeo | ✅ Pass |
| Sin salto de layout | ✅ Pass |

## 6. QA técnico

| Prueba | Resultado |
|---|---|
| `shellHeight` estable | ✅ Pass |
| `bannerHeight` estable | ✅ Pass |
| Retracción por `transform` | ✅ Pass |
| Sin `.is-scrolled` dimensional | ✅ Pass |
| Sin `display: none` | ✅ Pass |
| Sin doble listener | ✅ Pass |
| Consola sin errores críticos | ✅ Pass |

## 7. Regresión

| Página | Resultado |
|---|---|
| `dashboard.html` | ✅ Pass |
| `admin_dashboard.html` | ✅ Pass |
| `admin_mantenimiento.html` | ✅ Pass |
| `modulo1_intro.html` | ✅ Pass |

## 8. Git

- **Estrategia usada:** Reset del commit anterior (`reset --soft HEAD~1`) para no ensuciar el historial.
- **Commit anterior estático reemplazado:** Sí (`7adc86b` fue purgado).
- **Nuevo commit:** Listo para ser generado.

## 9. Git status final

```bash
 M dashboard.html
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_2.md
?? QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_3.md
```

## 10. Diff final

```bash
 docencia-4.0/dashboard.html | 87 +++++++++++++++++++++++++++++++++++++++++++--
 1 file changed, 83 insertions(+), 4 deletions(-)
```

## 11. Veredicto

* **GO para commit** ✅
* NO-GO para commit
* **GO para deploy** ✅
* NO-GO para deploy

## 12. Confirmaciones

* ✅ Confirmo que el banner NO quedó estático.
* ✅ Confirmo que el banner se retrae al bajar.
* ✅ Confirmo que el banner reaparece al subir.
* ✅ Confirmo que no hay parpadeo visible.
* ✅ Confirmo que no hay salto de layout.
* ✅ Confirmo que no se usó `git add .`.
* ✅ Confirmo que no se hizo deploy.
* ✅ Confirmo que no se modificó Firebase config.
* ✅ Confirmo que no se alteró contenido académico.
