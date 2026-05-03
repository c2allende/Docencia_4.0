import { getAllUsers, updateUserStatus } from './user-service.js';
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/**
 * Handler para la página de Administración de Usuarios.
 * Conecta la UI con Firestore y maneja el borrado lógico.
 */
class AdminUsersHandler {
    constructor() {
        this.users = [];
        this.MAIN_ADMIN_UID = "9l2MOKU8Y9ayX9yHmxtAcpGkzcJ2";
        this.elements = {
            usersList: document.getElementById('usersList'),
            searchUsers: document.getElementById('searchUsers'),
            roleFilter: document.getElementById('roleFilter'),
            statusFilter: document.getElementById('statusFilter'),
            metricTotal: document.getElementById('metricTotal'),
            metricActive: document.getElementById('metricActive'),
            metricVerified: document.getElementById('metricVerified'),
            metricAdmins: document.getElementById('metricAdmins'),
            statusMessage: document.getElementById('statusMessage')
        };
    }

    async init() {
        console.log("AdminUsersHandler: Inicializando...");
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await this.loadUsers();
                this.setupEventListeners();
            }
        });
    }

    async loadUsers() {
        this.showStatus("Cargando usuarios reales...", "info");
        try {
            this.users = await getAllUsers();
            this.render();
            this.hideStatus();
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            this.showStatus("Error al conectar con Firestore. Revisa tu conexión.", "error");
        }
    }

    setupEventListeners() {
        if (this.elements.searchUsers) {
            this.elements.searchUsers.addEventListener('input', () => this.render());
        }
        if (this.elements.roleFilter) {
            this.elements.roleFilter.addEventListener('change', () => this.render());
        }
        if (this.elements.statusFilter) {
            this.elements.statusFilter.addEventListener('change', () => this.render());
        }
    }

    render() {
        if (!this.elements.usersList) return;

        const filtered = this.getFilteredUsers();
        this.updateMetrics(this.users);

        this.elements.usersList.innerHTML = '';

        if (filtered.length === 0) {
            this.elements.usersList.innerHTML = '<div class="empty-state">No se encontraron usuarios.</div>';
            return;
        }

        filtered.forEach(user => {
            const card = this.createUserCard(user);
            this.elements.usersList.appendChild(card);
        });
    }

    getFilteredUsers() {
        const query = this.elements.searchUsers?.value.trim().toLowerCase() || "";
        const role = this.elements.roleFilter?.value || "all";
        const status = this.elements.statusFilter?.value || "active_inactive"; // Default custom

        return this.users.filter(u => {
            const matchesSearch = !query || 
                (u.displayName || "").toLowerCase().includes(query) || 
                (u.email || "").toLowerCase().includes(query);
            
            const matchesRole = role === "all" || u.role === role;
            
            let matchesStatus = true;
            if (status === "active_inactive") {
                matchesStatus = u.status === "active" || u.status === "inactive";
            } else if (status !== "all") {
                matchesStatus = u.status === status;
            }

            return matchesSearch && matchesRole && matchesStatus;
        });
    }

    updateMetrics(allUsers) {
        // No contar archivados en métricas operativas
        const operativeUsers = allUsers.filter(u => u.status !== "archived");
        
        if (this.elements.metricTotal) this.elements.metricTotal.innerText = operativeUsers.length;
        if (this.elements.metricActive) this.elements.metricActive.innerText = operativeUsers.filter(u => u.status === "active").length;
        if (this.elements.metricVerified) this.elements.metricVerified.innerText = operativeUsers.filter(u => u.emailVerified).length;
        if (this.elements.metricAdmins) this.elements.metricAdmins.innerText = operativeUsers.filter(u => u.role === "admin").length;
    }

    createUserCard(user) {
        const div = document.createElement('article');
        div.className = 'user-card';
        if (user.status === 'archived') div.style.opacity = '0.6';

        const initials = (user.displayName || "U").split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
        const isMainAdmin = user.uid === this.MAIN_ADMIN_UID;

        div.innerHTML = `
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
                <h3>${user.displayName || "Usuario"} ${isMainAdmin ? '<span style="font-size:10px; vertical-align:middle; color:var(--color-brand-primary);">[PRINCIPAL]</span>' : ''}</h3>
                <span class="user-email">${user.email}</span>
                <div class="user-meta">
                    <span class="badge-soft ${user.role === 'admin' ? 'badge-important' : ''}">${user.role}</span>
                    <span class="badge-soft ${user.status === 'active' ? 'badge-important' : ''}">${user.status}</span>
                    <span class="badge-soft">${user.emailVerified ? 'Verificado' : 'No verificado'}</span>
                </div>
            </div>
            <div class="user-actions">
                ${this.renderActions(user)}
            </div>
        `;

        // Attach events
        const actions = div.querySelector('.user-actions');
        actions.querySelectorAll('button').forEach(btn => {
            btn.onclick = (e) => {
                const action = e.target.dataset.action;
                this.handleAction(user, action);
            };
        });

        return div;
    }

    renderActions(user) {
        if (user.uid === this.MAIN_ADMIN_UID) {
            return '<span class="field-helper" style="margin:0;">Cuenta protegida</span>';
        }

        let btns = '';
        if (user.status === 'active') {
            btns += `<button class="btn-admin-secondary" data-action="inactive">Inactivar</button>`;
        } else {
            btns += `<button class="btn-admin-secondary" data-action="active">Activar</button>`;
        }

        if (user.status !== 'archived') {
            btns += `<button class="btn-admin-secondary" data-action="archive" style="color:var(--color-error, #dc2626);">Revocar acceso</button>`;
        }

        return btns;
    }

    async handleAction(user, action) {
        let confirmMsg = "";
        let newStatus = "";
        let accessRevoked = false;
        let note = "";

        if (action === "inactive") {
            confirmMsg = `¿Deseas inactivar a ${user.displayName}? No podrá entrar al LMS hasta que lo reactives.`;
            newStatus = "inactive";
            accessRevoked = true;
            note = "Inactivación administrativa";
        } else if (action === "active") {
            confirmMsg = `¿Deseas activar a ${user.displayName}?`;
            newStatus = "active";
            accessRevoked = false;
            note = "Reactivación administrativa";
        } else if (action === "archive") {
            confirmMsg = `⚠️ Esta acción revocará el acceso de ${user.displayName} al LMS de forma permanente (archivado). ¿Deseas continuar?`;
            newStatus = "archived";
            accessRevoked = true;
            note = "Acceso revocado / Usuario archivado";
        }

        if (confirm(confirmMsg)) {
            try {
                this.showStatus(`Actualizando a ${user.displayName}...`, "info");
                await updateUserStatus(user.uid, user.email, newStatus, accessRevoked, note);
                await this.loadUsers();
                this.showStatus("Usuario actualizado correctamente.", "success");
                setTimeout(() => this.hideStatus(), 3000);
            } catch (error) {
                this.showStatus(error.message, "error");
            }
        }
    }

    showStatus(msg, type) {
        if (!this.elements.statusMessage) return;
        this.elements.statusMessage.innerText = msg;
        this.elements.statusMessage.className = `status-message is-visible is-${type}`;
    }

    hideStatus() {
        if (this.elements.statusMessage) {
            this.elements.statusMessage.className = `status-message`;
        }
    }
}

export const adminUsersHandler = new AdminUsersHandler();
