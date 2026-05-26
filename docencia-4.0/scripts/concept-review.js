/**
 * Concept Review – Alt E3
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
        
        // Elemento que controla el texto de abrir/cerrar
        const toggleText = section.querySelector('.concept-review-toggle');

        // Toggle de etiquetas al abrir/cerrar
        section.addEventListener('toggle', () => {
            if (toggleText) {
                toggleText.textContent = section.open ? 'Ocultar conceptos' : 'Ver conceptos';
            }
        });

        // Garantizar que el click en el botón funcione en todos los navegadores
        if (toggleText) {
            toggleText.addEventListener('click', (e) => {
                // Evitamos la doble ejecución del summary nativo
                e.preventDefault();
                section.open = !section.open;
            });
        }

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
