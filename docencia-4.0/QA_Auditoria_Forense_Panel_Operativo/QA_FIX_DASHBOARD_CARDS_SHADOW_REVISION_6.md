# QA Fix Revisión 6 — Remoción Precisa de Sombra en Programa de Formación y Foro General

## 1. Estado

- **QA anterior:** NO aprobado.
- **Motivo:** El ajuste anterior eliminó sombras de un espectro demasiado amplio de componentes (módulos, perfil, audios, objetivos), desvirtuando la jerarquía visual nativa de la plataforma.
- **Solicitud corregida:** Limitar la remoción de sombras estricta y exclusivamente a los contenedores primarios de "Programa de Formación" y "Foro General", conservando bordes originales.
- **Deploy:** NO ejecutado.

## 2. Solicitud visual exacta

Remover únicamente la sombra de las secciones principales:
1. Programa de Formación (Contenedor general).
2. Foro General del Programa (Contenedor general).
Se requirió expresamente conservar los colores institucionales originales en sus bordes (cyan para el programa, naranja/coral para el foro) y proteger absolutamente el resto de tarjetas secundarias de cualquier alteración en su profundidad visual (`box-shadow`).

## 3. Solución aplicada

- Se procedió a purgar el bloque CSS masivo de la revisión 5 que atacaba indiscriminadamente a todas las clases `.card`.
- Se introdujo un bloque altamente específico: `.dashboard-page .intro-container, .dashboard-page .forum-general-access { box-shadow: none !important; }`. 
- No se inyectó ningún `border-color` sobreescrito, garantizando el retorno a la paleta institucional nativa definida en `main.css`.
- Todo el trabajo se mantuvo inyectado localmente en `<head>` de `dashboard.html`.
- Se mantuvo blindado el comportamiento fluido del banner retraíble.

## 4. Archivos modificados

| Archivo | Cambio realizado | Justificación |
|---|---|---|
| `dashboard.html` | Reducción de la regla CSS para afectar solo a `.intro-container` (Programa) y `.forum-general-access` (Foro). | Acatar la orden precisa de diseño de aislar el ajuste a dos contenedores, rescatando la profundidad visual del resto del ecosistema de tarjetas del dashboard. |

## 5. QA visual

| Prueba | Resultado |
|---|---|
| Programa de Formación sin sombra | ✅ Pass |
| Programa conserva borde cyan original | ✅ Pass |
| Foro General sin sombra | ✅ Pass |
| Foro conserva borde naranja/coral original | ✅ Pass |
| Módulos no alterados | ✅ Pass |
| Perfil/investigador no alterado | ✅ Pass |
| Tarjetas internas no alteradas indebidamente | ✅ Pass |
| Dashboard conserva jerarquía visual | ✅ Pass |

## 6. QA banner

| Prueba | Resultado |
|---|---|
| Banner se retrae al bajar | ✅ Pass |
| Franja institucional visible | ✅ Pass |
| Banner reaparece al subir | ✅ Pass |
| Sin parpadeo | ✅ Pass |
| Sin salto de layout | ✅ Pass |

## 7. Regresión

| Página | Resultado |
|---|---|
| `dashboard.html` | ✅ Pass |
| `admin_dashboard.html` | ✅ Pass |
| `admin_mantenimiento.html` | ✅ Pass |

## 8. Git

- **Estrategia usada:** `git reset --soft HEAD~1` sobre el commit de la revisión 5. Se reemplazó el ajuste de sombras generalizado por el ajuste quirúrgico para consolidar el commit final de UI.
- **Commit anterior reemplazado o complementado:** Sí (`f8e2394` fue purgado).
- **Nuevo commit:** Listo para ser generado.

## 9. Git status final

```bash
 M dashboard.html
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_2.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_3.md
A  QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_BANNER_SCROLL_REVISION_4.md
?? QA_Auditoria_Forense_Panel_Operativo/QA_FIX_DASHBOARD_CARDS_SHADOW_REVISION_6.md
```

## 10. Diff final

```bash
 docencia-4.0/dashboard.html | 19 ++-----------------
 1 file changed, 2 insertions(+), 17 deletions(-)
```

## 11. Veredicto

* **GO para commit** ✅
* NO-GO para commit
* **GO para deploy** ✅
* NO-GO para deploy

## 12. Confirmaciones

* ✅ Confirmo que solo se removió la sombra de Programa de Formación.
* ✅ Confirmo que solo se removió la sombra de Foro General.
* ✅ Confirmo que los bordes conservaron su color original.
* ✅ Confirmo que no se alteraron las tarjetas de módulos.
* ✅ Confirmo que no se alteró la tarjeta del investigador.
* ✅ Confirmo que el banner retraíble sigue funcionando.
* ✅ Confirmo que no hay parpadeo.
* ✅ Confirmo que no se modificó `styles/main.css`.
* ✅ Confirmo que no se usó `git add .`.
* ✅ Confirmo que no se hizo deploy.
* ✅ Confirmo que no se modificó Firebase config.
* ✅ Confirmo que no se alteró contenido académico.
