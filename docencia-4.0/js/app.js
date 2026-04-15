// Shared application logic for Docencia 4.0

const APP_DATA = {
    modules: [
        {
            id: 1,
            title: "Fundamentos, potencial pedagógico y ética de los LLM en la gestión docente",
            shortTitle: "Introducción e Impacto",
            progress: 0,
            lessons: 4,
            image: "../assets/icon_modulo1.png"
        },
        {
            id: 2,
            title: "Optimización de la planificación y diseño de recursos didácticos con IA",
            shortTitle: "Planificación con IA",
            progress: 0,
            lessons: 3,
            image: "../assets/icon_modulo2.png"
        },
        {
            id: 3,
            title: "Gestión administrativa y evaluativa: Eficiencia operativa en el rol docente",
            shortTitle: "Gestión y Evaluación",
            progress: 0,
            lessons: 4,
            image: "../assets/icon_modulo3.png"
        }
    ]
};

function initDashboard() {
    const modulesGrid = document.getElementById('modules-grid');
    if (!modulesGrid) return;

    APP_DATA.modules.forEach(mod => {
        const card = document.createElement('div');
        card.className = 'module-card-refined card animate-fade-in';
        card.innerHTML = `
            <div class="module-image-container">
                <img src="${mod.image}" alt="" class="module-image">
            </div>
            <div class="module-content">
                <div class="module-number-prominent">Módulo ${mod.id}</div>
                <h3 class="module-title-refined">${mod.title}</h3>
                <div class="module-stats">
                    <span>${mod.lessons} lecciones</span>
                    <span>Progreso: ${mod.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${mod.progress}%"></div>
                </div>
                <a href="module.html?id=${mod.id}" class="btn btn-primary" style="margin-top: var(--spacing-sm); width: 100%;">Continuar</a>
            </div>
        `;
        modulesGrid.appendChild(card);
    });
}

// Simple router for module data
function loadModuleContent() {
    const params = new URLSearchParams(window.location.search);
    const modId = parseInt(params.get('id'));
    const mod = APP_DATA.modules.find(m => m.id === modId);
    
    if (mod) {
        document.getElementById('module-title').textContent = mod.title;
        document.getElementById('module-breadcrumb').textContent = `Módulo ${modId}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('modules-grid')) initDashboard();
    if (document.getElementById('module-title')) loadModuleContent();
});
