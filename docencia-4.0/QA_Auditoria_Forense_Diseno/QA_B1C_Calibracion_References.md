# QA B1-C — Calibración “Referencias”

## 1. Hallazgo principal
El componente "Referencias" (`.references-compact`) ya se encontraba correctamente centralizado en `main.css` desde una intervención anterior o desde su concepción, implementando una arquitectura BEM completa (`.references-compact`, `__summary`, `__title`, `__action`, `__body`). El diagnóstico confirmó que las páginas en producción ya utilizan esta estructura central y dependen de `main.css`. Solo se detectó una regla huérfana y conflictiva de CSS Grid en `main.css` que fue eliminada para limpiar la cascada.

## 2. Patrón aprobado extraído
El patrón aprobado consiste en:
```html
<section class="text-section" aria-labelledby="referencias-title">
    <hr class="section-separator">
    <details class="references-compact">
        <summary class="references-compact__summary">
            <span id="referencias-title" class="references-compact__title">Referencias</span>
            <!-- (Contador opcional según lección) -->
            <span class="references-compact__action">Ver referencias</span>
        </summary>
        <div class="references-compact__body">
            <ul class="reference-list">
                <li>Referencia APA...</li>
            </ul>
        </div>
    </details>
</section>
```

## 3. Selectores originales
Las lecciones utilizaban exclusivamente la arquitectura BEM `.references-compact`. Algunas lecciones tenían selectores locales muertos como `.references-section` que no se correspondían con el HTML real.

## 4. Selectores centralizados en main.css
- `.references-compact`
- `.references-compact__summary`
- `.references-compact__title`
- `.references-compact__count`
- `.references-compact__action`
- `.references-compact__body`
- `.reference-list` (gestionado internamente por `__body ul`)

*(Intervención en `main.css`)*: Se eliminó la regla inactiva `.references-compact__summary { grid-template-columns: minmax(0, 1fr) auto; }` de la línea 5038 ya que interfería conceptualmente con el uso de `display: flex` establecido en la línea 3156.

## 5. Comparación visual
Al renderizar `leccion3_4_references_prototype.html`, el componente "Referencias" se muestra idéntico al de `leccion3_4.html` en producción.
- **Fondo**: Gris muy sutil / blanco, correspondiente al tema global (surface).
- **Borde**: Borde gris sutil (`var(--color-border-default)`).
- **Acción**: El texto "Ver referencias" se oculta correctamente al abrir el panel y es sustituido por "Ocultar referencias" utilizando `::after`.

## 6. Elementos preservados
Se confirma lo siguiente:
- referencias APA preservadas en su totalidad;
- botón/panel de apertura preservado y funcional;
- contador opcional preservado tal como requiere el patrón (se soporta en `main.css` mediante `__count` y flexbox);
- alineación izquierda preservada;
- no se modificó `leccion3_4.html` ni ninguna otra página de producción;
- no se cambiaron contenidos de texto ni lógicas;
- no se afectó Conceptos a repasar;
- no se afectó Qué debes recordar;
- no se afectó el checkpoint ni la navegación;
- no se hizo deploy;
- no se usó `git add .`

## 7. Estado
B1-C PENDIENTE — requiere ajuste visual. (A la espera de revisión visual humana para confirmar aprobación).
