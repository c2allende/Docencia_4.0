import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { startPageProgress, completePageProgress, getUserPageProgress } from "./progress-service.js";
import { checkUserParticipation } from "./forum-service.js";

console.log("[ProgressTracker] Inicializando tracker...");

onAuthStateChanged(auth, async (user) => {
    console.log("[ProgressTracker] Estado de autenticación cambiado. Usuario:", user ? user.uid : "No autenticado");
    
    if (!user) {
        console.warn("[ProgressTracker] Abortando: No hay usuario autenticado.");
        return;
    }

    const body = document.body;
    const pageId = body.getAttribute('data-page-id');
    const moduleId = body.getAttribute('data-module-id');
    const pageType = body.getAttribute('data-page-type');
    const title = body.getAttribute('data-title');
    const url = window.location.pathname.split('/').pop();

    console.log("[ProgressTracker] Datos de página detectados:", { pageId, moduleId, pageType, title });

    if (!pageId || !moduleId) {
        console.error("[ProgressTracker] Error: Faltan metadatos data-page-id o data-module-id en <body>");
        return;
    }

    // 1. Registro automático de visita
    try {
        await startPageProgress(user.uid, { pageId, moduleId, pageType, title, url });
        console.log("[ProgressTracker] Visita registrada correctamente.");
    } catch (err) {
        console.error("[ProgressTracker] Error al registrar visita:", err);
    }

    // 2. Manejo del botón de completado
    const completionSection = document.getElementById('completion-section');
    if (completionSection) {
        console.log("[ProgressTracker] Contenedor #completion-section encontrado. Cargando estado...");
        try {
            const progress = await getUserPageProgress(user.uid, pageId);
            const isCompleted = progress?.status === 'completed';
            
            // Si es un foro y no está completado, verificar participación
            let hasParticipated = false;
            if (pageType === 'foro' && !isCompleted) {
                const foroId = document.getElementById('forum-dynamic-container')?.getAttribute('data-forum-id') || pageId.replace('foro_', '');
                hasParticipated = await checkUserParticipation(foroId, user.uid);
            }

            renderCompletionButton(completionSection, user.uid, pageId, moduleId, isCompleted, hasParticipated);
        } catch (err) {
            console.error("[ProgressTracker] Error al cargar progreso previo:", err);
        }
    }
});

function renderCompletionButton(container, uid, pageId, moduleId, isCompleted, hasParticipated = false) {
    container.innerHTML = '';
    const pageType = document.body.getAttribute('data-page-type');
    
    const wrapper = document.createElement('div');
    wrapper.id = 'completion-wrapper';
    wrapper.style.margin = '2rem 0';
    wrapper.style.padding = '2rem';
    wrapper.style.background = 'var(--color-background-surface-low, #f8f9fa)';
    wrapper.style.borderRadius = '16px';
    wrapper.style.border = '1px solid var(--color-border-default, #e2e8f0)';
    wrapper.style.textAlign = 'center';
    wrapper.style.boxShadow = 'var(--shadow-flat)';

    if (isCompleted) {
        wrapper.innerHTML = `
            <div style="color: var(--color-brand-secondary, #2d3748); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 1.1rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#48bb78" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ¡Has completado esta sección!
            </div>
        `;
    } else {
        const isForum = pageType === 'foro';
        const canComplete = !isForum || hasParticipated;
        
        const btn = document.createElement('button');
        btn.id = 'btn-complete-page';
        btn.style.background = canComplete ? 'var(--color-brand-primary, #1a237e)' : '#cbd5e0';
        btn.style.color = 'white';
        btn.style.padding = '1rem 2.5rem';
        btn.style.border = 'none';
        btn.style.borderRadius = '50px';
        btn.style.cursor = canComplete ? 'pointer' : 'not-allowed';
        btn.style.fontWeight = '700';
        btn.style.fontSize = '1rem';
        btn.style.transition = 'all 0.2s ease';
        btn.textContent = 'Marcar como completado';
        
        if (isForum && !hasParticipated) {
            btn.disabled = true;
            const helpText = document.createElement('p');
            helpText.id = 'forum-help-text';
            helpText.style.fontSize = '0.9rem';
            helpText.style.color = 'var(--color-text-muted)';
            helpText.style.marginTop = '1rem';
            helpText.innerHTML = '⚠️ Debes <strong>publicar una aportación</strong> en el foro para habilitar este botón.';
            wrapper.appendChild(btn);
            wrapper.appendChild(helpText);
        } else {
            if (isForum && hasParticipated) {
                const successText = document.createElement('p');
                successText.id = 'forum-help-text';
                successText.style.fontSize = '0.9rem';
                successText.style.color = '#1a7f37';
                successText.style.marginTop = '1rem';
                successText.innerHTML = '✅ ¡Aportación detectada! Ya puedes marcar como completado.';
                wrapper.appendChild(btn);
                wrapper.appendChild(successText);
            } else {
                wrapper.appendChild(btn);
            }

            btn.onmouseover = () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = 'var(--shadow-floating)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            };
        }

        btn.onclick = async () => {
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.textContent = 'Guardando...';
            try {
                await completePageProgress(uid, pageId, moduleId);
                renderCompletionButton(container, uid, pageId, moduleId, true);
            } catch (err) {
                console.error("[ProgressTracker] Error al completar:", err);
                btn.disabled = false;
                btn.textContent = 'Reintentar';
            }
        };
    }
    
    container.appendChild(wrapper);

    // Listener para habilitar desde otros scripts (ej. forum-handler) - Se registra solo una vez por vida de página
    if (!window._hasCompletionListener) {
        document.addEventListener('enable-completion', () => {
            const btn = document.getElementById('btn-complete-page');
            const help = document.getElementById('forum-help-text');
            if (btn && !isCompleted) {
                btn.disabled = false;
                btn.style.background = 'var(--color-brand-primary, #1a237e)';
                btn.style.cursor = 'pointer';
                if (help) {
                    help.style.color = '#1a7f37';
                    help.innerHTML = '✅ ¡Aportación detectada! Ya puedes marcar como completado.';
                }
                
                btn.onmouseover = () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = 'var(--shadow-floating)';
                };
                btn.onmouseout = () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = 'none';
                };
            }
        });
        window._hasCompletionListener = true;
    }
}
