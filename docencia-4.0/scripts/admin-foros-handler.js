import { auth, db } from './firebase-config.js';
import { collection, query, getDocs, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAdminForumPosts, getAdminPostReplies, moderatePost, moderateReply, getForumExportData, buildForumExportRows, exportToCSV, logForumExportAction, getArchivedForumRecordsCount, purgeArchivedForumRecords, archiveLiveRepliesForArchivedPosts } from './forum-service.js';

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
        
        // Export events
        document.getElementById('openExportModalBtn')?.addEventListener('click', () => this.openExportModal());
        document.getElementById('cancelExportBtn')?.addEventListener('click', () => this.closeExportModal());
        document.getElementById('confirmExportBtn')?.addEventListener('click', () => this.executeExport());

        // Purge events
        document.getElementById('openPurgeModalBtn')?.addEventListener('click', () => this.openPurgeModal());
        document.getElementById('cancelPurgeBtn')?.addEventListener('click', () => this.closePurgeModal());
        document.getElementById('confirmPurgeBtn')?.addEventListener('click', () => this.executePurge());

        // Board Act 1.1 event
        document.getElementById('btnCleanBoardAct11')?.addEventListener('click', (e) => this.handleClearBoardAct11(e));
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
            } else if (post.status === 'hidden') {
                actionsHtml += `
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
            
            // Actualizar el contador en el botón de la tabla si difiere (corrección en tiempo real)
            const countInTable = replies.length;
            const tableBtn = document.querySelector(`.view-replies[data-postid="${postId}"]`);
            if (tableBtn) {
                tableBtn.textContent = `Respuestas (${countInTable})`;
            }

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
                } else if (reply.status === 'hidden') {
                    actionsHtml = `
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

    // ── PURGA DE ARCHIVADOS ──────────────────────────────────────────────────

    async openPurgeModal() {
        const modal = document.getElementById('purgeModal');
        const countsEl = document.getElementById('purgeCountsInfo');
        const confirmBtn = document.getElementById('confirmPurgeBtn');
        if (!modal || !countsEl || !confirmBtn) return;

        confirmBtn.disabled = true;
        countsEl.innerHTML = '<p>⏳ Calculando registros archivados...</p>';
        modal.classList.add('active');
        this.pendingPurgeFilters = null;

        try {
            const foroId = this.currentFilters.foroId || 'all';
            const foroLabel = foroId === 'all' ? 'Todos los foros'
                : foroId === 'general' ? 'Foro General'
                : foroId === 'modulo1' ? 'Módulo 1'
                : foroId === 'modulo2' ? 'Módulo 2'
                : foroId === 'modulo3' ? 'Módulo 3'
                : foroId;

            const counts = await getArchivedForumRecordsCount({ foroId });

            let skippedHtml = '';
            if (counts.skippedPosts > 0) {
                skippedHtml = `
                    <div style="margin-top:12px; padding:12px; border-radius:8px; background:rgba(207, 34, 46, 0.1); border:1px solid rgba(207, 34, 46, 0.2);">
                        <p style="font-size:13px; color:var(--color-feedback-error,#cf222e); margin:0;">⚠️ <strong>${counts.skippedPosts} publicaciones archivadas se omitirán</strong> por tener respuestas activas u ocultas.</p>
                        <button id="preparePurgeBtn" class="btn-action" style="margin-top:8px; width:100%; border-color:var(--color-feedback-error); color:var(--color-feedback-error);">Archivar respuestas asociadas (${counts.liveRepliesInArchivedPosts})</button>
                    </div>`;
            }

            if (counts.total === 0) {
                countsEl.innerHTML = `
                    <p><strong>Foro:</strong> ${foroLabel}</p>
                    <p>✅ No hay registros purgables para eliminar en este momento.</p>
                    ${skippedHtml}`;
            } else {
                countsEl.innerHTML = `
                    <p><strong>Foro:</strong> ${foroLabel}</p>
                    <p>📦 Publicaciones archivadas purgables: <strong>${counts.purgablePosts}</strong></p>
                    <p>💬 Respuestas archivadas detectadas: <strong>${counts.archivedReplies}</strong></p>
                    <p><strong>Total que realmente se eliminará: ${counts.total}</strong></p>
                    ${skippedHtml}`;
                confirmBtn.disabled = false;
                this.pendingPurgeFilters = { foroId };
            }

            // Listener para el botón de preparación (si existe)
            const prepBtn = document.getElementById('preparePurgeBtn');
            if (prepBtn) {
                prepBtn.addEventListener('click', () => this.executePreparePurge());
                this.pendingPurgeFilters = { foroId }; // Asegurar filtros para la acción
            }
        } catch (error) {
            console.error("[Purge] Error calculando registros:", error);
            countsEl.innerHTML = '<p style="color:var(--color-feedback-error,#cf222e);">Error al calcular registros. Verifica permisos y consola.</p>';
        }
    }

    closePurgeModal() {
        document.getElementById('purgeModal')?.classList.remove('active');
        this.pendingPurgeFilters = null;
    }

    async executePurge() {
        if (!this.pendingPurgeFilters) return;

        const btn = document.getElementById('confirmPurgeBtn');
        const countsEl = document.getElementById('purgeCountsInfo');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = 'Purgando...';

        try {
            const result = await purgeArchivedForumRecords(this.pendingPurgeFilters, this.adminInfo);

            countsEl.innerHTML = `
                <p style="color:var(--color-feedback-success,#1a7f37);font-weight:700;">✅ Purga completada.</p>
                <p>Publicaciones eliminadas: <strong>${result.archivedPostsDeleted}</strong></p>
                <p>Respuestas eliminadas: <strong>${result.archivedRepliesDeleted}</strong></p>
                ${result.skippedPosts > 0
                    ? `<p>Publicaciones omitidas (tienen respuestas activas/ocultas): <strong>${result.skippedPosts}</strong></p>`
                    : ''}`;

            await this.loadPosts();
            setTimeout(() => this.closePurgeModal(), 3000);
        } catch (error) {
            console.error("[Purge] Error durante la purga:", error);
            countsEl.innerHTML = `<p style="color:var(--color-feedback-error,#cf222e);">❌ Error durante la purga: ${error.message}. Verifica permisos y consola.</p>`;
        } finally {
            btn.disabled = false;
            btn.textContent = 'Purgar definitivamente';
        }
    }

    async executePreparePurge() {
        if (!this.pendingPurgeFilters) return;
        const btn = document.getElementById('preparePurgeBtn');
        const countsEl = document.getElementById('purgeCountsInfo');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = 'Archivando respuestas...';

        try {
            const result = await archiveLiveRepliesForArchivedPosts(this.pendingPurgeFilters, this.adminInfo);
            alert(`Se archivaron ${result.repliesArchived} respuestas en ${result.postsAffected} publicaciones. Ahora puede proceder con la purga.`);
            // Recargar modal para actualizar conteos
            await this.openPurgeModal();
        } catch (error) {
            console.error("[Purge] Error preparando:", error);
            alert("Error al preparar registros: " + error.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Archivar respuestas asociadas';
            }
        }
    }

    // ── EXPORTACIÓN ──────────────────────────────────────────────────────────

    openExportModal() {
        document.getElementById('exportModal')?.classList.add('active');
    }

    closeExportModal() {
        document.getElementById('exportModal')?.classList.remove('active');
    }

    async executeExport() {
        const btn = document.getElementById('confirmExportBtn');
        if (!btn) return;
        
        btn.disabled = true;
        btn.textContent = 'Procesando...';
        
        try {
            const exportType = document.getElementById('exportType').value;
            const foroId = document.getElementById('exportForo').value;
            const statusFilter = document.getElementById('exportStatus').value;
            const typeFilter = document.getElementById('exportIntervention').value;
            const dateFrom = document.getElementById('exportDateFrom').value;
            const dateTo = document.getElementById('exportDateTo').value;

            const filters = {
                foro: foroId,
                estado: statusFilter,
                tipo: typeFilter,
                dateFrom: dateFrom,
                dateTo: dateTo
            };

            // 1. Log auditoría (debe ocurrir ANTES de entregar datos)
            await logForumExportAction({
                exportType,
                foroId,
                statusFilter,
                typeFilter,
                dateFrom,
                dateTo,
                note: "Exportación iniciada desde el dashboard"
            });

            // 2. Traer datos
            const rawData = await getForumExportData(filters);
            
            if (rawData.length === 0) {
                alert("No se encontraron datos con los filtros seleccionados.");
                this.closeExportModal();
                return;
            }

            // 3. Formatear y anonimizar si es necesario
            const isAnonymous = exportType === 'anonymous';
            const rows = buildForumExportRows(rawData, isAnonymous);

            // 4. Generar nombre archivo
            const prefix = isAnonymous ? "exportacion_anonima" : "exportacion_completa";
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `${prefix}_foros_${dateStr}.csv`;

            // 5. Descargar CSV
            exportToCSV(rows, filename);
            
            this.closeExportModal();
            
        } catch (error) {
            console.error("Error durante exportación:", error);
            alert("Error al exportar. Revisa permisos o si la sesión está activa.");
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generar CSV';
        }
    }

    async handleClearBoardAct11(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const confirmed = window.confirm(
            '¿Confirmas que deseas limpiar el Board de la Actividad 1.1? Esta acción eliminará los comentarios interactivos y no se puede deshacer.'
        );

        if (!confirmed) return;

        try {
            const q = query(collection(db, 'sessions/actividad1_1/responses'));
            const snap = await getDocs(q);
            
            if (snap.empty) {
                const statusEl = document.getElementById('boardAct11Status');
                if (statusEl) {
                    statusEl.textContent = 'El Board ya está vacío.';
                    statusEl.style.color = 'var(--color-feedback-info-on)';
                }
                return;
            }

            const batch = writeBatch(db);
            snap.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            console.info('[Panel Operativo] Limpieza del Board Act. 1.1 completada.');
            
            const statusEl = document.getElementById('boardAct11Status');
            if (statusEl) {
                statusEl.textContent = 'Board limpiado correctamente.';
                statusEl.style.color = 'var(--color-feedback-success-on)';
            }
        } catch (error) {
            console.error('[Panel Operativo] Error al limpiar Board Act. 1.1:', error);
            const statusEl = document.getElementById('boardAct11Status');
            if (statusEl) {
                statusEl.textContent = 'Error al limpiar. Revisa la consola.';
                statusEl.style.color = 'var(--color-feedback-error)';
            }
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
