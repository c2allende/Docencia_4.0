import { auth } from './firebase-config.js';
import { getAdminForumPosts, getAdminPostReplies, moderatePost, moderateReply } from './forum-service.js';

class AdminForosHandler {
    constructor() {
        this.posts = [];
        this.adminInfo = null;
        this.currentFilters = {
            foroId: 'all',
            status: 'all',
            searchTerm: ''
        };
        
        this.init();
    }

    async init() {
        // Asegurar que el usuario sea admin está manejado por admin-guard.js
        // Esperamos a que auth se inicialice
        auth.onAuthStateChanged(user => {
            if (user) {
                this.adminInfo = { email: user.email, uid: user.uid };
                this.bindEvents();
                this.loadPosts();
            }
        });
    }

    bindEvents() {
        document.getElementById('filterForo')?.addEventListener('change', (e) => {
            this.currentFilters.foroId = e.target.value;
            this.loadPosts();
        });

        document.getElementById('filterStatus')?.addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.loadPosts();
        });

        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.currentFilters.searchTerm = e.target.value;
            // Debounce simple
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.loadPosts(), 400);
        });
        
        // Modal events
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelModerateBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('confirmModerateBtn')?.addEventListener('click', () => this.executeModeration());
    }

    async loadPosts() {
        this.renderLoading();
        try {
            this.posts = await getAdminForumPosts(this.currentFilters);
            this.updateMetrics();
            this.renderTable();
        } catch (error) {
            console.error("Error cargando posts admin:", error);
            document.getElementById('postsTableBody').innerHTML = `<tr><td colspan="6" class="error-msg">Error al cargar publicaciones.</td></tr>`;
        }
    }

    updateMetrics() {
        let total = this.posts.length;
        let activas = this.posts.filter(p => p.status === 'active').length;
        let ocultas = this.posts.filter(p => p.status === 'hidden').length;
        let archivadas = this.posts.filter(p => p.status === 'archived').length;

        const setMetric = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.textContent = val;
        };

        setMetric('metricTotal', total);
        setMetric('metricActivas', activas);
        setMetric('metricOcultas', ocultas);
        setMetric('metricArchivadas', archivadas);
    }

    renderLoading() {
        const tbody = document.getElementById('postsTableBody');
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="loading-state">Cargando publicaciones...</td></tr>`;
    }

    renderTable() {
        const tbody = document.getElementById('postsTableBody');
        if (!tbody) return;

        if (this.posts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No se encontraron publicaciones con los filtros actuales.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        this.posts.forEach(post => {
            const tr = document.createElement('tr');
            
            const dateStr = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('es-PR', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : 'Desconocida';

            const statusClass = `status-badge ${post.status}`;
            const statusText = post.status === 'active' ? 'Activo' : post.status === 'hidden' ? 'Oculto' : 'Archivado';

            let actionsHtml = `<button class="btn-action view-replies" data-foroid="${post.foroId}" data-postid="${post.id}">Respuestas (${post.replyCount || 0})</button>`;
            
            if (post.status === 'active') {
                actionsHtml += `
                    <button class="btn-action moderate-btn hide-btn" data-type="post" data-foroid="${post.foroId}" data-postid="${post.id}" data-action="hidden">Ocultar</button>
                    <button class="btn-action moderate-btn archive-btn" data-type="post" data-foroid="${post.foroId}" data-postid="${post.id}" data-action="archived">Archivar</button>
                `;
            }

            tr.innerHTML = `
                <td><strong>${post.foroId}</strong></td>
                <td>
                    <div class="author-cell">
                        <span class="author-name">${this.escapeHtml(post.authorName)}</span>
                        <span class="author-context">${this.escapeHtml(post.authorContext || '')}</span>
                    </div>
                </td>
                <td><div class="content-preview">${this.escapeHtml(post.content).substring(0, 100)}...</div></td>
                <td>${dateStr}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td class="actions-cell">${actionsHtml}</td>
            `;

            tbody.appendChild(tr);
        });

        // Add event listeners to buttons
        tbody.querySelectorAll('.view-replies').forEach(btn => {
            btn.addEventListener('click', (e) => this.showRepliesModal(e.target.dataset.foroid, e.target.dataset.postid));
        });

        tbody.querySelectorAll('.moderate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.openModerationModal(
                e.target.dataset.type,
                e.target.dataset.foroid,
                e.target.dataset.postid,
                null,
                e.target.dataset.action
            ));
        });
    }

    async showRepliesModal(foroId, postId) {
        const container = document.getElementById('repliesContainer');
        const modal = document.getElementById('repliesModal');
        if (!container || !modal) return;

        container.innerHTML = '<p class="loading-state">Cargando respuestas...</p>';
        modal.classList.add('active');

        try {
            const replies = await getAdminPostReplies(foroId, postId);
            if (replies.length === 0) {
                container.innerHTML = '<p class="empty-state">No hay respuestas para esta publicación.</p>';
                return;
            }

            container.innerHTML = '';
            replies.forEach(reply => {
                const div = document.createElement('div');
                div.className = `reply-card status-${reply.status}`;
                
                const dateStr = reply.createdAt?.toDate ? reply.createdAt.toDate().toLocaleDateString('es-PR', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : 'Desconocida';

                const statusText = reply.status === 'active' ? 'Activo' : reply.status === 'hidden' ? 'Oculto' : 'Archivado';

                let actionsHtml = '';
                if (reply.status === 'active') {
                    actionsHtml = `
                        <button class="btn-action hide-btn reply-mod-btn" data-type="reply" data-foroid="${foroId}" data-postid="${postId}" data-replyid="${reply.id}" data-action="hidden">Ocultar</button>
                        <button class="btn-action archive-btn reply-mod-btn" data-type="reply" data-foroid="${foroId}" data-postid="${postId}" data-replyid="${reply.id}" data-action="archived">Archivar</button>
                    `;
                }

                div.innerHTML = `
                    <div class="reply-header">
                        <strong>${this.escapeHtml(reply.authorName)}</strong>
                        <span class="reply-meta">${dateStr} • <span class="badge ${reply.status}">${statusText}</span></span>
                    </div>
                    <div class="reply-body">${this.escapeHtml(reply.content)}</div>
                    <div class="reply-actions">${actionsHtml}</div>
                `;
                container.appendChild(div);
            });

            container.querySelectorAll('.reply-mod-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.openModerationModal(
                    e.target.dataset.type,
                    e.target.dataset.foroid,
                    e.target.dataset.postid,
                    e.target.dataset.replyid,
                    e.target.dataset.action
                ));
            });

        } catch (error) {
            console.error("Error cargando respuestas:", error);
            container.innerHTML = '<p class="error-msg">Error al cargar las respuestas.</p>';
        }
    }

    closeModal() {
        document.getElementById('repliesModal')?.classList.remove('active');
        document.getElementById('moderationModal')?.classList.remove('active');
        this.currentModerationTask = null;
    }

    openModerationModal(type, foroId, postId, replyId, action) {
        this.currentModerationTask = { type, foroId, postId, replyId, action };
        
        const actionText = action === 'hidden' ? 'ocultar' : 'archivar';
        const typeText = type === 'post' ? 'la publicación' : 'la respuesta';
        
        document.getElementById('modWarningText').textContent = 
            `Esta acción cambiará el estado de ${typeText} a [${action}]. El contenido no será eliminado físicamente. ¿Desea continuar?`;
        
        document.getElementById('modNote').value = '';
        document.getElementById('moderationModal').classList.add('active');
    }

    async executeModeration() {
        if (!this.currentModerationTask) return;
        
        const note = document.getElementById('modNote').value.trim();
        if (!note) {
            alert("Debe proveer un motivo o nota de moderación.");
            return;
        }

        const btn = document.getElementById('confirmModerateBtn');
        btn.disabled = true;
        btn.textContent = 'Procesando...';

        try {
            const { type, foroId, postId, replyId, action } = this.currentModerationTask;
            
            if (type === 'post') {
                await moderatePost(foroId, postId, action, note, this.adminInfo);
                await this.loadPosts(); // Refresh table
            } else {
                await moderateReply(foroId, postId, replyId, action, note, this.adminInfo);
                await this.showRepliesModal(foroId, postId); // Refresh replies
            }
            
            document.getElementById('moderationModal').classList.remove('active');
        } catch (error) {
            console.error("Error en moderación:", error);
            alert("Ocurrió un error al moderar. Revisa los permisos y consola.");
        } finally {
            btn.disabled = false;
            btn.textContent = 'Confirmar';
            this.currentModerationTask = null;
        }
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
}

// Inicializar cuando el DOM esté listo
const initAdminForos = () => new AdminForosHandler();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminForos);
} else {
    initAdminForos();
}
