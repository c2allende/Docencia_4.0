import { auth, db } from "./firebase-config.js";
import { getAllParticipantsProgress, getParticipantDetailedProgress, resetUserModuleProgress, detectUserOrphanData } from "./progress-service.js";

/**
 * AdminProgresoHandler
 * Gestiona la lógica de la página admin_progreso.html
 */
const AdminProgresoHandler = {
    participants: [],
    filteredParticipants: [],

    async init() {
        console.log("Iniciando AdminProgresoHandler...");
        this.cacheElements();
        this.bindEvents();
        await this.loadData();
    },

    cacheElements() {
        this.tableBody = document.getElementById('progressTableBody');
        this.searchField = document.getElementById('searchParticipants');
        this.moduleFilter = document.getElementById('moduleFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.statusMessage = document.getElementById('statusMessage');
        
        // Métricas
        this.metricParticipants = document.getElementById('metricParticipants');
        this.metricAverage = document.getElementById('metricAverage');
        this.metricCompleted = document.getElementById('metricCompleted');
        this.metricActiveToday = document.getElementById('metricActiveToday');

        // Modal de detalle (se creará dinámicamente si no existe)
        this.detailModal = document.getElementById('detailModal');
    },

    bindEvents() {
        this.searchField?.addEventListener('input', () => this.filterAndRender());
        this.moduleFilter?.addEventListener('change', () => this.filterAndRender());
        this.statusFilter?.addEventListener('change', () => this.filterAndRender());
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.detailModal) this.closeModal();
        });
    },

    async loadData() {
        this.showStatus("Cargando participantes desde Firestore...", "info");
        try {
            this.participants = await getAllParticipantsProgress();
            this.filterAndRender();
            this.updateMetrics();
            this.showStatus("Datos actualizados correctamente.", "success", 3000);
        } catch (error) {
            console.error("Error al cargar datos de administración:", error);
            this.showStatus("Error al cargar datos. Revisa la consola.", "error");
        }
    },

    showStatus(message, type, duration = null) {
        if (!this.statusMessage) return;
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message is-visible is-${type}`;
        if (duration) {
            setTimeout(() => this.statusMessage.classList.remove('is-visible'), duration);
        }
    },

    updateMetrics() {
        const total = this.participants.length;
        const completed = this.participants.filter(p => p.modulo1 === 100 && p.modulo2 === 100 && p.modulo3 === 100).length;
        const avg = total === 0 ? 0 : Math.round(this.participants.reduce((sum, p) => sum + (p.modulo1 + p.modulo2 + p.modulo3) / 3, 0) / total);
        
        // Activos hoy
        const todayStr = new Date().toLocaleDateString();
        const activeToday = this.participants.filter(p => p.lastActivity && p.lastActivity.toLocaleDateString() === todayStr).length;

        if (this.metricParticipants) this.metricParticipants.textContent = total;
        if (this.metricAverage) this.metricAverage.textContent = `${avg}%`;
        if (this.metricCompleted) this.metricCompleted.textContent = completed;
        if (this.metricActiveToday) this.metricActiveToday.textContent = activeToday;
    },

    filterAndRender() {
        const query = this.searchField?.value.toLowerCase() || "";
        const modFilter = this.moduleFilter?.value || "all";
        const statFilter = this.statusFilter?.value || "all";

        this.filteredParticipants = this.participants.filter(p => {
            const matchesSearch = p.displayName.toLowerCase().includes(query) || p.email.toLowerCase().includes(query);
            
            // Lógica de filtro por módulo (simplificada: si tiene progreso en ese módulo)
            let matchesModule = true;
            if (modFilter === "modulo1") matchesModule = p.modulo1 > 0;
            if (modFilter === "modulo2") matchesModule = p.modulo2 > 0;
            if (modFilter === "modulo3") matchesModule = p.modulo3 > 0;

            // Filtro por estado
            let matchesStatus = true;
            if (statFilter === "completed") matchesStatus = (p.modulo1 === 100 && p.modulo2 === 100 && p.modulo3 === 100);
            if (statFilter === "in_progress") matchesStatus = (p.modulo1 > 0 || p.modulo2 > 0 || p.modulo3 > 0) && !(p.modulo1 === 100 && p.modulo2 === 100 && p.modulo3 === 100);
            if (statFilter === "not_started") matchesStatus = (p.modulo1 === 0 && p.modulo2 === 0 && p.modulo3 === 0);

            return matchesSearch && matchesModule && matchesStatus;
        });

        this.renderTable();
    },

    renderTable() {
        if (!this.tableBody) return;
        this.tableBody.innerHTML = "";

        if (this.filteredParticipants.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px; color: var(--color-text-muted);">No se encontraron participantes con estos filtros.</td></tr>`;
            return;
        }

        this.filteredParticipants.forEach(p => {
            const row = document.createElement('tr');
            
            // Celda Participante
            const userCell = document.createElement('td');
            userCell.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <div class="participant-avatar">
                        ${this.getInitials(p.displayName)}
                    </div>
                    <div style="min-width: 0; overflow: hidden;">
                        <span class="participant-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${p.displayName}</span>
                        <span class="participant-email" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${p.email}</span>
                    </div>
                </div>
            `;

            // Celda Estado
            const statusCell = document.createElement('td');
            const statusLabel = this.getStatusLabel(p);
            statusCell.innerHTML = `<span class="badge-soft ${statusLabel === 'Completado' ? 'badge-important' : ''}">${statusLabel}</span>`;

            // Celda Módulo 1
            const m1Cell = document.createElement('td');
            m1Cell.appendChild(this.createMiniProgress(p.modulo1, "M1"));

            // Celda Módulo 2
            const m2Cell = document.createElement('td');
            m2Cell.appendChild(this.createMiniProgress(p.modulo2, "M2"));

            // Celda Módulo 3
            const m3Cell = document.createElement('td');
            m3Cell.appendChild(this.createMiniProgress(p.modulo3, "M3"));

            // Celda Última Actividad
            const activityCell = document.createElement('td');
            activityCell.style.fontSize = "12px";
            activityCell.textContent = p.lastActivity ? this.formatDate(p.lastActivity) : "Sin actividad";

            // Celda Acciones
            const actionCell = document.createElement('td');
            actionCell.style.textAlign = "right";
            actionCell.setAttribute('data-label', 'Acciones');
            
            const btn = document.createElement('button');
            btn.className = "btn-admin-secondary";
            btn.style.padding = "6px 12px";
            btn.style.minHeight = "auto";
            btn.textContent = "Ver detalle";
            btn.onclick = () => this.showDetail(p);
            actionCell.appendChild(btn);

            // Celdas de Placeholder
            const contextCell = document.createElement('td');
            contextCell.textContent = p.roleContext;
            contextCell.setAttribute('data-label', 'Rol/Contexto');

            const locationCell = document.createElement('td');
            locationCell.textContent = p.modulo3 > 0 ? "Módulo 3" : (p.modulo2 > 0 ? "Módulo 2" : (p.modulo1 > 0 ? "Módulo 1" : "Inicio"));
            locationCell.setAttribute('data-label', 'Ubicación');

            // Celda Participante
            userCell.setAttribute('data-label', 'Participante');
            
            // Celda Estado
            statusCell.setAttribute('data-label', 'Estado');

            // Celdas Módulos
            m1Cell.setAttribute('data-label', 'Módulo 1');
            m2Cell.setAttribute('data-label', 'Módulo 2');
            m3Cell.setAttribute('data-label', 'Módulo 3');

            // Celda Actividad
            activityCell.setAttribute('data-label', 'Última actividad');

            row.append(
                userCell, 
                contextCell, 
                locationCell, 
                statusCell, 
                m1Cell, 
                m2Cell, 
                m3Cell, 
                activityCell, 
                actionCell
            );
            
            this.tableBody.appendChild(row);
        });
    },

    createMiniProgress(percent, label) {
        const div = document.createElement('div');
        div.className = "progress-cell";
        div.style.minWidth = "100px";
        div.innerHTML = `
            <div class="progress-label-row">
                <span>${percent}%</span>
            </div>
            <progress class="progress-native" max="100" value="${percent}"></progress>
        `;
        return div;
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    },

    getStatusLabel(p) {
        if (p.modulo1 === 100 && p.modulo2 === 100 && p.modulo3 === 100) return "Completado";
        if (p.modulo1 > 0 || p.modulo2 > 0 || p.modulo3 > 0) return "En progreso";
        return "No iniciado";
    },

    formatDate(date) {
        const now = new Date();
        const diff = (now - date) / 1000;
        if (diff < 3600) return `Hace ${Math.round(diff / 60)} min`;
        if (diff < 86400) return `Hace ${Math.round(diff / 3600)} horas`;
        return date.toLocaleDateString();
    },

    async showDetail(participant) {
        console.log("Mostrando detalle para:", participant.displayName);
        this.openModal();
        
        const modalContent = document.getElementById('modalContent');
        if (!modalContent) return;

        modalContent.innerHTML = `<div style="padding: 40px; text-align: center;"><p>Cargando desglose pedagógico...</p></div>`;

        try {
            const m1Detail = await getParticipantDetailedProgress(participant.uid, "modulo1");
            const m2Detail = await getParticipantDetailedProgress(participant.uid, "modulo2");
            const m3Detail = await getParticipantDetailedProgress(participant.uid, "modulo3");
            const orphanData = await detectUserOrphanData(participant.uid);

            let orphanSection = '';
            if (orphanData.length > 0) {
                orphanSection = `
                    <div style="margin-top: 30px; border-top: 2px dashed var(--color-border-default); padding-top: 20px;">
                        <details class="orphan-details" style="background: #fff8f8; border: 1px solid #ffecec; border-radius: 12px; padding: 15px;">
                            <summary style="cursor: pointer; font-weight: bold; color: #d32f2f; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 20px;">⚠️</span> 
                                Datos huérfanos detectados (${orphanData.length})
                                <span style="font-size: 11px; font-weight: normal; color: var(--color-text-muted); margin-left: auto;">Haz clic para expandir y revisar</span>
                            </summary>
                            <div style="margin-top: 15px; overflow-x: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 12px; min-width: 600px;">
                                    <thead>
                                        <tr style="text-align: left; border-bottom: 1px solid #ffecec;">
                                            <th style="padding: 8px;">Tipo</th>
                                            <th style="padding: 8px;">ID Documento</th>
                                            <th style="padding: 8px;">Módulo</th>
                                            <th style="padding: 8px;">Razón / Hallazgo</th>
                                            <th style="padding: 8px;">Última Act.</th>
                                            <th style="padding: 8px;">Acción Sugerida</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orphanData.map(o => `
                                            <tr style="border-bottom: 1px solid #fff0f0;">
                                                <td style="padding: 8px;"><span class="badge-soft" style="font-size: 10px; background: #ffebee; color: #c62828;">${o.orphanType}</span></td>
                                                <td style="padding: 8px;"><code>${o.orphanId}</code></td>
                                                <td style="padding: 8px;">${o.moduleId}</td>
                                                <td style="padding: 8px; color: #d32f2f;">${o.reason}</td>
                                                <td style="padding: 8px; color: var(--color-text-muted);">${o.lastUpdated}</td>
                                                <td style="padding: 8px;">
                                                    <span style="font-style: italic; color: var(--color-text-muted);">${o.recommendation}</span>
                                                    <br>
                                                    <button class="btn-admin-secondary" style="font-size: 10px; padding: 4px 8px; margin-top: 4px; min-height: auto;" disabled>Pendiente de revisión</button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </div>
                `;
            }

            modalContent.innerHTML = `
                <div style="padding: 20px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid var(--color-border-default); padding-bottom: 20px;">
                        <div class="participant-avatar" style="width: 64px; height: 64px; font-size: 24px;">${this.getInitials(participant.displayName)}</div>
                        <div>
                            <h2 style="margin: 0; font-size: 24px;">${participant.displayName}</h2>
                            <p style="margin: 0; color: var(--color-text-muted);">${participant.email} | ${participant.roleContext}</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                        <!-- Módulo 1 -->
                        <div class="panel-card" style="padding: 15px;">
                            <h3 class="admin-kicker">Módulo 1</h3>
                            <div style="margin: 10px 0;">
                                ${this.renderCategoryBreakdown(m1Detail)}
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: var(--color-background-surface-low); border-radius: 8px;">
                                <p style="font-size: 11px; margin: 0;"><strong>Siguiente:</strong> ${m1Detail?.nextPage?.title || "Completado"}</p>
                            </div>
                            <button class="btn-admin-danger-outline" 
                                    style="width: 100%; margin-top: 12px; font-size: 11px; padding: 8px;"
                                    onclick="handleAdminReset('${participant.uid}', 'modulo1', 'Módulo 1', '${participant.email}')">
                                Reiniciar progreso
                            </button>
                        </div>

                        <!-- Módulo 2 -->
                        <div class="panel-card" style="padding: 15px;">
                            <h3 class="admin-kicker">Módulo 2</h3>
                            <div style="margin: 10px 0;">
                                ${this.renderCategoryBreakdown(m2Detail)}
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: var(--color-background-surface-low); border-radius: 8px;">
                                <p style="font-size: 11px; margin: 0;"><strong>Siguiente:</strong> ${m2Detail?.nextPage?.title || "Completado"}</p>
                            </div>
                            <button class="btn-admin-danger-outline" 
                                    style="width: 100%; margin-top: 12px; font-size: 11px; padding: 8px;"
                                    onclick="handleAdminReset('${participant.uid}', 'modulo2', 'Módulo 2', '${participant.email}')">
                                Reiniciar progreso
                            </button>
                        </div>

                        <!-- Módulo 3 -->
                        <div class="panel-card" style="padding: 15px;">
                            <h3 class="admin-kicker">Módulo 3</h3>
                            <div style="margin: 10px 0;">
                                ${this.renderCategoryBreakdown(m3Detail)}
                            </div>
                            <div style="margin-top: 15px; padding: 10px; background: var(--color-background-surface-low); border-radius: 8px;">
                                <p style="font-size: 11px; margin: 0;"><strong>Siguiente:</strong> ${m3Detail?.nextPage?.title || "Completado"}</p>
                            </div>
                            <button class="btn-admin-danger-outline" 
                                    style="width: 100%; margin-top: 12px; font-size: 11px; padding: 8px;"
                                    onclick="handleAdminReset('${participant.uid}', 'modulo3', 'Módulo 3', '${participant.email}')">
                                Reiniciar progreso
                            </button>
                        </div>
                    </div>

                    ${orphanSection}
                </div>
            `;
        } catch (error) {
            console.error("Error al mostrar detalle:", error);
            modalContent.innerHTML = `<p style="color: red; padding: 20px;">Error al cargar el detalle.</p>`;
        }
    },

    
    async handleResetProgress(uid, moduleId, moduleTitle, targetEmail) {
        const confirmMsg = `ESTA ACCIÓN ES IRREVERSIBLE.\n\nSe reiniciará el progreso del participante en el ${moduleTitle}.\nNo se eliminará la cuenta ni se afectarán otros módulos.\nSe conservará el historial de visitas, pero el participante deberá marcar nuevamente las páginas como completadas.\n\n¿Desea continuar?`;
        
        if (!confirm(confirmMsg)) return;

        const admin = auth.currentUser;
        if (!admin) {
            alert("Sesión administrativa no válida.");
            return;
        }

        // Desactivar botones en el modal
        const buttons = document.querySelectorAll('.btn-admin-danger-outline');
        buttons.forEach(b => b.disabled = true);
        
        try {
            await resetUserModuleProgress(uid, moduleId, {
                adminUid: admin.uid,
                adminEmail: admin.email,
                targetEmail: targetEmail,
                note: "Reinicio solicitado desde el panel administrativo"
            });

            alert(`Progreso del ${moduleTitle} reiniciado con éxito.`);
            
            // Recargar datos y refrescar UI
            await this.loadData();
            this.filterAndRender();
            
            // Actualizar el modal de detalle para reflejar el cambio
            const updatedParticipant = this.participants.find(p => p.uid === uid);
            if (updatedParticipant) {
                this.showDetail(updatedParticipant);
            } else {
                this.closeModal();
            }

        } catch (error) {
            console.error("Error al reiniciar progreso:", error);
            alert("Error al procesar el reinicio. Verifique su conexión y permisos.");
        } finally {
            buttons.forEach(b => b.disabled = false);
        }
    },

    renderCategoryBreakdown(detail) {
        if (!detail || !detail.breakdown) return "<p>Sin datos de desglose.</p>";

        const categories = [
            { label: "Contenido formativo", val: detail.breakdown.contenido.completed, total: detail.breakdown.contenido.total, icon: "📖" },
            { label: "Actividades", val: detail.breakdown.actividades.completed, total: detail.breakdown.actividades.total, icon: "📝" },
            { label: "Foro revisado", val: detail.breakdown.foro.completed, total: detail.breakdown.foro.total, icon: "💬" },
            { label: "Recursos revisados", val: detail.breakdown.recursos.completed, total: detail.breakdown.recursos.total, icon: "📚" }
        ];

        return categories.map(cat => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px;">
                <span>${cat.icon} ${cat.label}</span>
                <span style="font-weight: bold;">${cat.val} de ${cat.total}</span>
            </div>
        `).join('');
    },

    openModal() {
        if (this.detailModal) this.detailModal.style.display = "flex";
    },

    closeModal() {
        if (this.detailModal) this.detailModal.style.display = "none";
    }
};

// Exponer globalmente para los botones del modal
window.closeAdminModal = () => AdminProgresoHandler.closeModal();
window.handleAdminReset = (uid, moduleId, title, email) => AdminProgresoHandler.handleResetProgress(uid, moduleId, title, email);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => AdminProgresoHandler.init());
