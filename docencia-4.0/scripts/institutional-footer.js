const container = document.getElementById('institutional-footer');
if (container) {
    if (!document.getElementById('institutional-footer-scoped-styles')) {
        const style = document.createElement('style');
        style.id = 'institutional-footer-scoped-styles';
        style.textContent = `
            .institutional-footer-wrapper {
                border-top: 1px solid var(--color-border-default, #e2e8f0);
                padding: var(--spacing-6, 24px) var(--spacing-8, 32px);
                margin-top: var(--spacing-8, 32px);
                text-align: center;
                width: 100%;
                box-sizing: border-box;
            }
            .institutional-footer-text {
                font-family: var(--font-family-body, 'Manrope', sans-serif);
                font-size: var(--font-size-sm, 0.875rem);
                color: var(--color-text-secondary, #64748b);
                margin: 0;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }

    container.innerHTML = `
        <footer class="institutional-footer-wrapper" role="contentinfo" aria-label="Pie institucional">
            <p class="institutional-footer-text">&copy; 2026 by Carmelo II Allende Mart&iacute;nez</p>
        </footer>
    `;
}
