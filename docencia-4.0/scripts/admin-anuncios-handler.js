import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    createAnnouncement, 
    getAdminAnnouncements, 
    updateAnnouncement, 
    archiveAnnouncement,
    formatAnnouncementDateTime,
    getArchivedAnnouncementsCount,
    purgeArchivedAnnouncements,
    deleteAnnouncement 
} from "./announcement-service.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
        
        const pubStr = formatAnnouncementDateTime(ann.publishAt || ann.createdAt);
        const createdStr = formatAnnouncementDateTime(ann.createdAt);
        const updatedStr = formatAnnouncementDateTime(ann.updatedAt || ann.createdAt);

        const statusLabel = ann.status === 'published' ? 'Publicado' : (ann.status === 'draft' ? 'Borrador' : 'Archivado');
        const statusClass = `badge-${ann.status}`;

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title-group">
                    <div class="ann-dates-admin" style="font-size: 0.75rem; color: var(--text-light); margin-bottom: 0.5rem; line-height: 1.4;">
                        <div><strong>Publicado:</strong> ${pubStr}</div>
                        <div><strong>Creado:</strong> ${createdStr}</div>
                        <div><strong>Actualizado:</strong> ${updatedStr}</div>
                    </div>
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
                    ` : `
                        <button class="btn-action btn-delete-phys" data-id="${ann.id}" title="Eliminar permanentemente" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    `}
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

    // Borrado físico individual (Fase 2.0F-11B)
    document.querySelectorAll('.btn-delete-phys').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) return;
            const id = e.currentTarget.getAttribute('data-id');
            
            if (confirm('¿Estás seguro de que deseas eliminar PERMANENTEMENTE este anuncio archivado? Esta acción no se puede deshacer.')) {
                try {
                    e.currentTarget.disabled = true;
                    const adminInfo = { uid: currentUser.uid, email: currentUser.email };
                    await deleteAnnouncement(id, adminInfo);
                    loadAnnouncements();
                } catch (error) {
                    console.error("Error al borrar anuncio:", error);
                    alert(`Error al eliminar: ${error.message}`);
                    e.currentTarget.disabled = false;
                }
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

// --- Lógica de Purga (Fase 2.0F-11) ---
const purgeModal = document.getElementById('purgeModal');
const openPurgeModalBtn = document.getElementById('openPurgeModalBtn');
const cancelPurgeBtn = document.getElementById('cancelPurgeBtn');
const confirmPurgeBtn = document.getElementById('confirmPurgeBtn');
const archivedCountModal = document.getElementById('archivedCountModal');

openPurgeModalBtn?.addEventListener('click', async () => {
    try {
        const counts = await getArchivedAnnouncementsCount();
        if (archivedCountModal) archivedCountModal.textContent = counts.archivedAnnouncements;
        
        if (counts.archivedAnnouncements === 0) {
            alert('No hay anuncios archivados para purgar.');
            return;
        }

        if (purgeModal) {
            purgeModal.style.display = 'flex';
        }
    } catch (error) {
        console.error("Error al preparar purga:", error);
        alert('Error al obtener el conteo de anuncios archivados.');
    }
});

cancelPurgeBtn?.addEventListener('click', () => {
    if (purgeModal) purgeModal.style.display = 'none';
});

confirmPurgeBtn?.addEventListener('click', async () => {
    if (!currentUser) return;

    try {
        confirmPurgeBtn.disabled = true;
        confirmPurgeBtn.textContent = 'Purgando...';

        const adminInfo = {
            uid: currentUser.uid,
            email: currentUser.email
        };

        const result = await purgeArchivedAnnouncements(adminInfo);

        alert(`Purga completada con éxito.\nAnuncios eliminados: ${result.announcementsDeleted}\nOmitidos (por límite): ${result.skippedAnnouncements}`);
        
        if (purgeModal) purgeModal.style.display = 'none';
        loadAnnouncements();
    } catch (error) {
        console.error("Error durante la purga:", error);
        alert(`Error crítico durante la purga de anuncios: ${error.message || 'Error desconocido'}`);
    } finally {
        if (confirmPurgeBtn) {
            confirmPurgeBtn.disabled = false;
            confirmPurgeBtn.textContent = 'Purgar definitivamente';
        }
    }
});
