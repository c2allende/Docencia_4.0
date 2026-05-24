# QA Fix Revisión 4 — Banner Dashboard Retraíble con Franja Institucional Visible

## 1. Estado

- **QA anterior:** Parcialmente aprobado
- **Motivo:** El banner se retraía sin parpadeo y sin afectar el layout, pero desaparecía completamente al hacer scroll, perdiéndose la identificación institucional visual en la parte superior.
- **Requisito UX/UI:** Mantener una identificación institucional visible (una franja o "peek") al retraerse el banner, con transparencia sutil.
- **Deploy:** NO ejecutado

## 2. Solución aplicada

Se conservó intacta la arquitectura libre de reflow (Shell estable + Banner con `transform`) implementada en la Revisión 3. Sin embargo, se ajustó la posición de retracción del banner:
- El estado `.is-retracted` ahora no desplaza el banner al -100%, sino a `calc(-100% + var(--dashboard-banner-peek-height))` (aproximadamente -100% + 52px).
- Se inyectó el sub-componente `.dashboard-banner-peek` dentro de la base del banner. Este elemento, que incluye el logo en miniatura y el título "Academia Docencia 4.0", aparece con una opacidad sutil (y un fondo con blur y transparencia) solo cuando el banner está retraído, sirviendo de recordatorio constante de la identidad institucional sin estorbar la lectura del contenido del dashboard. Todo esto operado mediante transiciones fluidas de `transform` y `opacity` sin alterar dimensiones.

## 3. Archivos modificados

| Archivo | Cambio realizado | Justificación |
|---|---|---|
| `dashboard.html` | Se añadieron variables de altura de peek, se ajustó el valor del `translateY` para dejar la franja visible y se insertó el div `.dashboard-banner-peek` en el header con su correspondiente CSS. | Cumplir el requisito de presencia institucional sin alterar la altura real del documento, previniendo el regreso del parpadeo. |

## 4. QA visual humano

| Prueba | Resultado |
|---|---|
| Banner se retrae al bajar | ✅ Pass |
| Banner no desaparece completamente | ✅ Pass |
| Franja institucional visible | ✅ Pass |
| Transparencia sutil | ✅ Pass |
| Banner reaparece al subir | ✅ Pass |
| Sin parpadeo | ✅ Pass |
| Sin salto de layout | ✅ Pass |
| Repetición 5 ciclos | ✅ Pass |
| Desktop | ✅ Pass |
| Móvil | ✅ Pass |

## 5. QA técnico

| Prueba | Resultado |
|---|---|
| `shellHeight` estable | ✅ Pass |
| `bannerHeight` estable | ✅ Pass |
| `peekHeight` estable | ✅ Pass |
| Retracción por `transform` | ✅ Pass |
| Sin `.is-scrolled` dimensional | ✅ Pass |
| Sin `display: none` | ✅ Pass |
| Consola sin errores críticos | ✅ Pass |

## 6. Regresión

| Página | Resultado |
|---|---|
| `dashboard.html` | ✅ Pass |
| `admin_dashboard.html` | ✅ Pass |
| `admin_mantenimiento.html` | ✅ Pass |

## 7. Git

- **Estrategia usada:** `git reset --soft HEAD~1` sobre el commit de la Revisión 3, agregando el parche de UX/UI para compilar un único commit limpio.
- **Commit anterior reemplazado o complementado:** Sí (`e45735f` fue purgado).
- **Nuevo commit:** Listo para ser generado.

## 8. Git status final

```bash
 M dashboard.html
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_2.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_3.md
?? QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_4.md
```

## 9. Diff final

```bash
 docencia-4.0/dashboard.html | 91 +++++++++++++++++++++++++++++++++++++++++++++++++-
 1 file changed, 90 insertions(+), 1 deletion(-)
```

## 10. Veredicto

* **GO para commit** ✅
* NO-GO para commit
* **GO para deploy** ✅
* NO-GO para deploy

## 11. Confirmaciones

* ✅ Confirmo que el banner se retrae al bajar.
* ✅ Confirmo que el banner no desaparece completamente.
* ✅ Confirmo que queda una franja institucional visible.
* ✅ Confirmo que la franja tiene transparencia sutil.
* ✅ Confirmo que el banner reaparece al subir.
* ✅ Confirmo que no hay parpadeo visible.
* ✅ Confirmo que no hay salto de layout.
* ✅ Confirmo que no se usó `git add .`.
* ✅ Confirmo que no se hizo deploy.
* ✅ Confirmo que no se modificó Firebase config.
* ✅ Confirmo que no se alteró contenido académico.
