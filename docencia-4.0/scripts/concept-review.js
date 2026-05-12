/**
 * Concept Review — Alt E3
 * Panel colapsado + micro-repaso progresivo adaptativo.
 *
 * Mejora progresiva sobre HTML semántico (<details>/<summary>).
 * Si este script no carga, el contenido sigue accesible vía HTML nativo.
 * NO depende de librerías externas.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-concept-review]').forEach(section => {
        const moreBtn = section.querySelector('.concept-review__more');
        const overflow = section.querySelector('.concept-review__overflow');
        const summaryMain = section.querySelector('.concept-review__summary-main');
        const titleSpan = section.querySelector('.concept-review__title');
        
        // Almacenar el título original (ej. "Conceptos a repasar")
        const originalTitle = titleSpan ? titleSpan.textContent : 'Conceptos a repasar';

        // Toggle de etiquetas al abrir/cerrar
        section.addEventListener('toggle', () => {
            if (section.open) {
                if (titleSpan) titleSpan.textContent = 'Ocultar conceptos';
            } else {
                if (titleSpan) titleSpan.textContent = originalTitle;
            }
        });

        // Botón "Ver más conceptos" / "Ver todos los conceptos"
        if (moreBtn && overflow) {
            moreBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Evitar cierre si es un link/button
                overflow.style.display = 'block';
                moreBtn.style.display = 'none';
            });
        }
    });
});
