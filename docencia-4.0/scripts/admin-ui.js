/**
 * ADMIN UI: Funciones compartidas para el panel operativo.
 */

// Resolución de rutas de assets
export function resolveAssetPath(img) {
    const rawAssets = img.dataset.assets || img.dataset.asset;
    if (!rawAssets) return;

    const fileNames = rawAssets.split('|').map(s => s.trim()).filter(Boolean);
    const paths = [];
    const bases = ['./assets/', 'assets/', '../assets/', '../../assets/'];

    fileNames.forEach(fileName => {
        const encoded = fileName.split('/').map(p => encodeURIComponent(p)).join('/');
        bases.forEach(base => {
            paths.push(`${base}${fileName}`);
            paths.push(`${base}${encoded}`);
        });
    });

    const uniqueCandidates = [...new Set(paths)];
    let index = 0;

    img.onerror = () => {
        if (index < uniqueCandidates.length) {
            img.src = uniqueCandidates[index++];
        } else {
            img.onerror = null;
            console.warn(`No se pudo cargar asset: ${fileNames[0]}`);
        }
    };

    if (uniqueCandidates.length > 0) {
        img.src = uniqueCandidates[index++];
    }
}

// Control de Sidebar
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuButton = document.querySelector('.menu-btn');

export function openSidebar() {
    if (!sidebar || !overlay || !menuButton) return;
    sidebar.classList.add('active');
    overlay.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    menuButton.setAttribute('aria-expanded', 'true');
}

export function closeSidebar() {
    if (!sidebar || !overlay || !menuButton) return;
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
}

export function toggleSidebar() {
    if (!sidebar) return;
    sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
}

// Exponer a ventana para onclick de HTML
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-assets], img[data-asset]').forEach(resolveAssetPath);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
});
