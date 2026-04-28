import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    createAnnouncement, 
    getAdminAnnouncements, 
    updateAnnouncement, 
    archiveAnnouncement 
} from "./announcement-service.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const announcementForm = document.getElementById('announcementForm');
const announcementList = document.getElementById('announcementList');
const charCounter = document.getElementById('charCounter');
const previewTitle = document.getElementById('previewAnnouncementTitle');
const previewMessage = document.getElementById('previewAnnouncementMessage');
const previewScope = document.getElementById('previewScope');
const previewPriority = document.getElementById('previewPriority');

const activeCountDisplay = document.getElementById('activeCount');
const draftCountDisplay = document.getElementById('draftCount');
const urgentCountDisplay = document.getElementById('urgentCount');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadAnnouncements();
    }
});

/**
 * Carga y renderiza los anuncios en el panel admin.
 */
async function loadAnnouncements() {
    if (!announcementList) return;
    
    announcementList.innerHTML = '<p class="loading-text">Cargando anuncios...</p>';
    
    try {
        const announcements = await getAdminAnnouncements();
        renderAnnouncements(announcements);
        updateMetrics(announcements);
    } catch (error) {
        announcementList.innerHTML = '<p class="error-text">Error al cargar anuncios.</p>';
    }
}

/**
 * Renderiza la lista de anuncios.
 */
function renderAnnouncements(list) {
    if (list.length === 0) {
        announcementList.innerHTML = '<p class="empty-text">No hay anuncios registrados.</p>';
        return;
    }

    announcementList.innerHTML = '';
    list.forEach(ann => {
        const card = document.createElement('article');
        card.className = `announcement-card priority-${ann.priority}`;
        
        const dateStr = ann.createdAt ? ann.createdAt.toDate().toLocaleDateString() : 'Pendiente';
        const statusLabel = ann.status === 'published' ? 'Publicado' : (ann.status === 'draft' ? 'Borrador' : 'Archivado');
        const statusClass = `badge-${ann.status}`;

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title-group">
                    <span class="ann-date">${dateStr}</span>
                    <h3>${ann.title}</h3>
                </div>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <p class="ann-excerpt">${ann.message.substring(0, 150)}${ann.message.length > 150 ? '...' : ''}</p>
            <div class="card-footer">
                <div class="ann-meta">
                    <span class="badge-soft">${ann.scope}</span>
                    <span class="badge-soft priority-label">${ann.priority}</span>
                </div>
                <div class="card-actions">
                    ${ann.status !== 'archived' ? `
                        <button class="btn-action btn-archive" data-id="${ann.id}" title="Archivar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8H3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2z"/><path d="M10 12h4"/><path d="M3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"/></svg>
                        </button>
                    ` : ''}
                    <button class="btn-action btn-edit" data-id="${ann.id}" title="Editar" disabled>
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </div>
        `;

        announcementList.appendChild(card);
    });

    // Event listeners para botones de acción
    document.querySelectorAll('.btn-archive').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas archivar este anuncio?')) {
                await archiveAnnouncement(id);
                loadAnnouncements();
            }
        });
    });
}

/**
 * Actualiza los contadores del resumen.
 */
function updateMetrics(list) {
    const active = list.filter(a => a.status === 'published' && a.isActive).length;
    const drafts = list.filter(a => a.status === 'draft').length;
    const urgent = list.filter(a => a.priority === 'urgente' && a.isActive).length;

    if (activeCountDisplay) activeCountDisplay.textContent = active;
    if (draftCountDisplay) draftCountDisplay.textContent = drafts;
    if (urgentCountDisplay) urgentCountDisplay.textContent = urgent;
}

// Lógica del Formulario
announcementForm?.addEventListener('input', (e) => {
    // Vista previa en tiempo real
    if (previewTitle) previewTitle.textContent = document.getElementById('announcementTitle').value || 'Título del anuncio';
    if (previewMessage) previewMessage.textContent = document.getElementById('announcementMessage').value || 'El mensaje aparecerá aquí...';
    if (previewScope) previewScope.textContent = document.getElementById('announcementScope').value;
    if (previewPriority) previewPriority.textContent = document.getElementById('announcementPriority').value;
    
    // Contador de caracteres
    if (charCounter) {
        const len = document.getElementById('announcementMessage').value.length;
        charCounter.textContent = `${len} / 900 caracteres`;
    }
});

/**
 * Función común para guardar (publicar o borrador).
 */
async function handleSave(status) {
    if (!currentUser) return;

    const title = document.getElementById('announcementTitle').value;
    const message = document.getElementById('announcementMessage').value;
    const scope = document.getElementById('announcementScope').value;
    const priority = document.getElementById('announcementPriority').value;
    const publishDate = document.getElementById('publishDate').value;
    const expirationDate = document.getElementById('expirationDate').value;

    if (!title || !message) {
        alert('Por favor completa el título y el mensaje.');
        return;
    }

    const data = {
        title,
        message,
        scope,
        priority,
        status,
        isActive: status !== 'archived',
        publishAt: publishDate ? Timestamp.fromDate(new Date(publishDate + 'T00:00:00')) : serverTimestamp(),
        expiresAt: expirationDate ? Timestamp.fromDate(new Date(expirationDate + 'T23:59:59')) : null
    };

    try {
        await createAnnouncement(data, currentUser.uid);
        announcementForm.reset();
        loadAnnouncements();
        alert(status === 'published' ? 'Anuncio publicado con éxito.' : 'Borrador guardado.');
    } catch (error) {
        alert('Error al guardar el anuncio.');
    }
}

document.getElementById('publishBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSave('published');
});

document.getElementById('saveDraftBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSave('draft');
});

document.getElementById('clearFormBtn')?.addEventListener('click', () => {
    announcementForm.reset();
    if (charCounter) charCounter.textContent = '0 / 900 caracteres';
});
