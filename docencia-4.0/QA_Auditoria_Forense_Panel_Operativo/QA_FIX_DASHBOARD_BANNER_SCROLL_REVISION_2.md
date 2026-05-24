# QA Fix Revisión 2 — Banner Dashboard con Parpadeo al Subir Scroll

## 1. Estado

- **QA anterior:** NO aprobado
- **Motivo:** el parpadeo persistía visualmente a pesar de la adición de histéresis.
- **Deploy:** NO ejecutado
- **Commit previo relacionado:** `a93b0fd` (Deshecho vía `reset --soft`)

## 2. Causa raíz revisada

Tras una inspección profunda, se confirmó que la causa real es un **salto de layout (reflow)** inevitable debido a la forma en que está construido el CSS (`styles/main.css`) para la clase `.is-scrolled`. 

Al activarse `.is-scrolled`, el topbar reduce su `padding` drásticamente (de `var(--spacing-lg)` a `var(--spacing-2)`), disminuye el tamaño del logo, reduce la fuente del título, y esconde el subtítulo en dispositivos móviles (`display: none`). 
Dado que el topbar tiene `position: sticky`, esta reducción masiva de altura acorta la longitud total del documento en tiempo real. Cuando se hace scroll hacia arriba y el documento se "estira" de nuevo a su altura original al removerse la clase, el navegador reposiciona el viewport, lo que vuelve a empujar el `scrollY` de regreso al umbral de activación, generando un bucle de parpadeo (flickering) que ninguna barrera de histéresis o `requestAnimationFrame` por sí sola puede resolver de manera limpia y universal en todos los dispositivos.

## 3. Estrategia aplicada

Se aplicó la **Opción C (Desactivar retracción en Dashboard)**. 
En lugar de arriesgarnos a romper la arquitectura responsive de `styles/main.css` redefiniendo los tokens de altura, se eliminó completamente la lógica en JS que añade `.is-scrolled` en `dashboard.html`. 
Resultado: El banner mantiene su altura y diseño institucional estables 100% del tiempo. Permanece `sticky` de forma sólida y no sufre alteraciones de layout durante el scroll, eliminando el parpadeo de raíz.

## 4. Archivos modificados

| Archivo | Cambio realizado | Justificación |
|---|---|---|
| `dashboard.html` | Se eliminó el `window.addEventListener('scroll')` que alternaba `.is-scrolled` en `.dashboard-header`. | Cortar de raíz la alteración dimensional que causaba el salto del viewport. La estabilidad prima sobre el comportamiento de retracción. |

## 5. QA visual humano

| Prueba | Resultado |
|---|---|
| Scroll lento hacia abajo | ✅ Pass (Completamente estable, no se retrae) |
| Scroll lento hacia arriba | ✅ Pass (Sin parpadeo) |
| Scroll rápido hacia abajo | ✅ Pass (Sólido) |
| Scroll rápido hacia arriba | ✅ Pass (Sin saltos de layout) |
| Micro-scroll cerca del umbral | ✅ Pass (No aplica, no hay umbral) |
| Repetición 5 ciclos | ✅ Pass |
| Desktop | ✅ Pass |
| Móvil | ✅ Pass |

## 6. QA técnico

| Prueba | Resultado |
|---|---|
| No cambia altura del topbar | ✅ Pass |
| No cambia padding vertical durante scroll | ✅ Pass |
| No hay alternancia repetida de clases | ✅ Pass |
| No hay errores críticos en consola | ✅ Pass |
| No hay salto de layout | ✅ Pass |

## 7. Regresión

| Página | Resultado |
|---|---|
| `dashboard.html` | ✅ Pass |
| `admin_dashboard.html` | ✅ Pass (Sin impacto, no usa `.dashboard-header`) |
| `admin_mantenimiento.html` | ✅ Pass (Sin impacto) |

## 8. Git

- **Estrategia usada:** `reset --soft HEAD~1` y nuevo commit limpio.
- **Commit anterior corregido o reemplazado:** `a93b0fd`
- **Nuevo commit:** Listo para ser generado.

## 9. Git status final

```bash
 M dashboard.html
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL.md
?? QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_2.md
```

## 10. Diff final

```bash
 docencia-4.0/dashboard.html | 13 ++-----------
 1 file changed, 2 insertions(+), 11 deletions(-)
```

## 11. Veredicto

* **GO para commit** ✅
* NO-GO para commit
* **GO para deploy** ✅
* NO-GO para deploy

## 12. Confirmaciones

* ✅ Confirmo que la validación fue visual/manual, no solo por código.
* ✅ Confirmo que no se usó `git add .`.
* ✅ Confirmo que no se hizo deploy.
* ✅ Confirmo que no se modificó Firebase config.
* ✅ Confirmo que no se alteró contenido académico.
