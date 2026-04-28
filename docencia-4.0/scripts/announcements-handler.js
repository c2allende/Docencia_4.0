import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getVisibleAnnouncements, 
    getUserReadStatus, 
    markAsRead,
    formatAnnouncementDateTime 
} from "./announcement-service.js";

const announcementsList = document.getElementById('announcementsList');
const tabButtons = document.querySelectorAll('.tab-btn');

let currentUser = null;
let allVisibleAnnouncements = [];
let userReadIds = [];
let currentFilter = 'all';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await init();
    }
});

/**
 * Inicialización de la vista de anuncios.
 */
async function init() {
    if (!announcementsList) return;
    
    announcementsList.innerHTML = '<p class="loading-text">Cargando anuncios...</p>';
    
    try {
        // Carga paralela de anuncios y lecturas
        [allVisibleAnnouncements, userReadIds] = await Promise.all([
            getVisibleAnnouncements(),
            getUserReadStatus(currentUser.uid)
        ]);
        
        renderFilteredAnnouncements();
        setupFilters();
    } catch (error) {
        console.error("Error en init anuncios:", error);
        announcementsList.innerHTML = '<p class="error-text">Hubo un error al cargar las noticias.</p>';
    }
}

/**
 * Renderiza los anuncios aplicando el filtro actual.
 */
function renderFilteredAnnouncements() {
    let filtered = allVisibleAnnouncements;
    
    if (currentFilter === 'priority') {
        filtered = allVisibleAnnouncements.filter(a => a.priority === 'urgente' || a.priority === 'importante');
    } else if (currentFilter.startsWith('modulo-')) {
        const modId = currentFilter.replace('-', ''); // 'modulo-1' -> 'modulo1'
        filtered = allVisibleAnnouncements.filter(a => a.moduleId === modId);
    }
    
    if (filtered.length === 0) {
        announcementsList.innerHTML = '<p class="empty-text">No hay anuncios en esta categoría.</p>';
        return;
    }

    announcementsList.innerHTML = '';
    filtered.forEach(ann => {
        const isRead = userReadIds.includes(ann.id);
        const card = document.createElement('article');
        
        // Clases de estilo según diseño original
        let cardClass = 'announcement-card';
        if (ann.priority === 'urgente' || ann.priority === 'importante') cardClass += ' priority';
        if (!isRead) cardClass += ' unread';
        
        card.className = cardClass;
        card.dataset.id = ann.id;

        const dateStr = formatAnnouncementDateTime(ann.publishAt || ann.createdAt);
        const tagLabel = ann.scope === 'global' ? 'General' : `Módulo ${ann.moduleId?.replace('modulo', '')}`;

        card.innerHTML = `
            <div class="announcement-meta">
                <span class="announcement-tag">${ann.priority.toUpperCase()} | ${tagLabel}</span>
                <span class="announcement-date">Publicado el ${dateStr}</span>
            </div>
            <div class="announcement-content">
                <h3>${ann.title}</h3>
                <p>${ann.message}</p>
            </div>
            <div class="announcement-footer">
                ${isRead 
                    ? '<span class="announcement-date">✓ Leído</span>' 
                    : `<button class="btn-read-more" data-id="${ann.id}">Marcar como leído</button>`
                }
            </div>
        `;

        announcementsList.appendChild(card);
    });

    // Event listeners para marcar como leído
    announcementsList.querySelectorAll('.btn-read-more').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = e.target.dataset.id;
            await markAsRead(id, currentUser.uid);
            
            // Actualización local para feedback inmediato
            userReadIds.push(id);
            renderFilteredAnnouncements();
        });
    });
}

/**
 * Configura los botones de filtro (Tabs).
 */
function setupFilters() {
    tabButtons.forEach(btn => {
        // Sobrescribimos el onclick del HTML para usar nuestra lógica dinámica
        btn.onclick = (e) => {
            const category = e.target.textContent.toLowerCase();
            
            // Mapeo de texto de botón a filtro técnico
            if (category.includes('todo')) currentFilter = 'all';
            else if (category.includes('prioritario')) currentFilter = 'priority';
            else if (category.includes('1')) currentFilter = 'modulo-1';
            else if (category.includes('2')) currentFilter = 'modulo-2';
            else if (category.includes('3')) currentFilter = 'modulo-3';

            // Actualizar UI de botones
            tabButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            renderFilteredAnnouncements();
        };
    });
}
