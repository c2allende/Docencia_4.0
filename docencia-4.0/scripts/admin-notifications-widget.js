/* 
   scripts/admin-notifications-widget.js 
   Fase 2.0E-2: Componente Reutilizable de Notificaciones Administrativas
*/

import { auth } from './firebase-config.js';
import { 
    subscribeToUnreadNotifications, 
    subscribeToRecentNotifications, 
    markNotificationAsRead, 
    archiveNotification 
} from './notification-service.js';

let unsubUnread = null;
let unsubRecent = null;

/**
 * Inicializa la campana de notificaciones en el contenedor #admin-notification-widget
 */
export function initAdminNotifications() {
    const container = document.getElementById('admin-notification-widget');
    if (!container) {
        console.warn("[AdminWidget] ERROR: No se encontró el contenedor #admin-notification-widget en esta página.");
        return;
    }

    console.warn("[AdminWidget] Inicializando widget en el contenedor encontrado.");

    // 1. Inyectar CSS (solo una vez)
    injectStyles();

    // 2. Inyectar Estructura HTML
    renderSkeleton(container);

    // 3. Obtener referencias de UI
    const ui = {
        toggle: container.querySelector('#admin-bell-toggle'),
        dropdown: container.querySelector('#admin-notif-dropdown'),
        badge: container.querySelector('#admin-unread-badge'),
        list: container.querySelector('#admin-notif-list')
    };

    // 4. Manejo de Eventos UI
    ui.toggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        ui.dropdown?.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        ui.dropdown?.classList.remove('active');
    });

    ui.dropdown?.addEventListener('click', (e) => e.stopPropagation());

    // 5. Suscripciones de Firebase
    auth.onAuthStateChanged(user => {
        // Limpiar listeners previos
        if (unsubUnread) unsubUnread();
        if (unsubRecent) unsubRecent();

        if (user) {
            console.warn(`[AdminWidget] Usuario detectado: ${user.email}. Iniciando listeners...`);
            // Pequeño delay para asegurar estabilidad
            setTimeout(() => {
                setupListeners(user.uid, ui);
            }, 500);
        } else {
            console.warn("[AdminWidget] No hay usuario autenticado.");
        }
    });
}

function setupListeners(uid, ui) {
    // Suscripción al contador
    unsubUnread = subscribeToUnreadNotifications(uid, (count) => {
        console.warn(`[AdminWidget] CONTADOR RECIBIDO: ${count} notificaciones no leídas.`);
        
        const badge = document.getElementById('admin-unread-badge') || ui.badge;
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    });

    // Suscripción a los 5 más recientes
    unsubRecent = subscribeToRecentNotifications(uid, (notifs) => {
        console.warn(`[AdminWidget] LISTA RECIBIDA: ${notifs.length} notificaciones encontradas.`);
        const list = document.getElementById('admin-notif-list') || ui.list;
        renderList(uid, notifs, list);
    }, 5);
}

function renderSkeleton(container) {
    container.innerHTML = `
        <div class="notification-admin-wrapper">
            <button class="notification-admin-button" id="admin-bell-toggle" aria-label="Notificaciones administrativas">
                🔔
                <span class="notification-admin-badge" id="admin-unread-badge" style="display: none;">0</span>
            </button>
            <div class="notification-admin-dropdown" id="admin-notif-dropdown">
                <div class="notification-admin-header">
                    <h3>Notificaciones Recientes</h3>
                </div>
                <div class="notification-admin-list" id="admin-notif-list">
                    <div class="notification-admin-empty">Cargando...</div>
                </div>
                <div class="notification-admin-footer">
                    <span>Mostrando notificaciones recientes</span>
                </div>
            </div>
        </div>
    `;
}

function renderList(uid, notifs, listContainer) {
    if (!listContainer) return;

    if (notifs.length === 0) {
        listContainer.innerHTML = '<div class="notification-admin-empty">No hay notificaciones recientes</div>';
        return;
    }

    listContainer.innerHTML = '';
    notifs.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-admin-item ${notif.status === 'unread' ? 'unread' : ''}`;
        
        const dateStr = notif.createdAt?.toDate 
            ? notif.createdAt.toDate().toLocaleString('es-PR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) 
            : 'Reciente';

        let actionBtns = '';
        if (notif.status === 'unread') {
            actionBtns += `<button class="notification-admin-btn-action mark-read" data-id="${notif.id}">Marcar leída</button>`;
        }
        actionBtns += `<button class="notification-admin-btn-action archive-notif" data-id="${notif.id}">Archivar</button>`;

        const contentHtml = `
            <span class="notification-admin-item-title">${escapeHtml(notif.title)}</span>
            <span class="notification-admin-item-msg">${escapeHtml(notif.message)}</span>
            <div class="notification-admin-item-footer">
                <span class="notification-admin-item-date">${dateStr}</span>
                <div class="notification-admin-actions">
                    ${actionBtns}
                </div>
            </div>
        `;

        if (notif.actionUrl) {
            item.innerHTML = `<a href="${notif.actionUrl}" class="notification-admin-link">${contentHtml}</a>`;
        } else {
            item.innerHTML = contentHtml;
        }

        // Eventos
        item.querySelector('.mark-read')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            markNotificationAsRead(uid, notif.id).catch(err => console.warn("Error al marcar leída:", err));
        });

        item.querySelector('.archive-notif')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            archiveNotification(uid, notif.id).catch(err => console.warn("Error al archivar:", err));
        });

        listContainer.appendChild(item);
    });
}

function injectStyles() {
    // ELIMINAR CUALQUIER VERSIÓN PREVIA PARA FORZAR ACTUALIZACIÓN (Cache Bypass)
    const oldStyle = document.getElementById('notification-admin-scoped-styles');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'notification-admin-scoped-styles';
    style.textContent = `
        .notification-admin-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            margin-left: auto;
            margin-right: var(--spacing-md);
        }

        .notification-admin-button {
            background: var(--color-background-surface);
            border: 1px solid var(--color-border-default);
            border-radius: var(--radius-pill);
            padding: var(--spacing-2) var(--spacing-3);
            cursor: pointer;
            font-size: var(--font-size-xl);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .notification-admin-button:hover {
            border-color: var(--color-brand-primary);
            transform: scale(1.05);
        }

        .notification-admin-badge {
            position: absolute !important;
            top: -2px !important;
            right: -2px !important;
            background-color: #ff0000 !important; /* Rojo puro QA */
            background: #ff0000 !important;
            color: #ffffff !important;
            font-size: 10px !important;
            font-weight: bold !important;
            min-width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 4px !important;
            border: 2px solid #ffffff !important;
            z-index: 99999 !important;
            visibility: visible !important;
            opacity: 1 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
        }

        @keyframes notificationBadgePulse {
            0% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
            100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
        }

        .notification-admin-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            width: 340px;
            background: var(--color-background-surface);
            border: 1px solid var(--color-border-default);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-floating);
            display: none;
            z-index: 10000;
            overflow: hidden;
            animation: notificationAdminFadeIn 0.2s ease;
        }

        @keyframes notificationAdminFadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .notification-admin-dropdown.active {
            display: block;
        }

        .notification-admin-header {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--color-border-default);
            background: var(--color-background-surface-low);
        }

        .notification-admin-header h3 {
            margin: 0;
            font-size: var(--font-size-sm);
            color: var(--color-text-display);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .notification-admin-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .notification-admin-item {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--color-border-subtle);
            transition: background 0.2s ease;
            position: relative;
        }

        .notification-admin-item:last-child {
            border-bottom: none;
        }

        .notification-admin-item:hover {
            background: var(--color-background-surface-low);
        }

        .notification-admin-item.unread {
            background: rgba(var(--color-brand-primary-rgb), 0.05);
            border-left: 3px solid var(--color-brand-primary);
        }

        .notification-admin-item-title {
            display: block;
            font-weight: bold;
            font-size: var(--font-size-sm);
            margin-bottom: 4px;
            color: var(--color-text-primary);
        }

        .notification-admin-item-msg {
            display: block;
            font-size: var(--font-size-xs);
            color: var(--color-text-secondary);
            margin-bottom: 8px;
            line-height: 1.4;
        }

        .notification-admin-item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .notification-admin-item-date {
            font-size: 10px;
            color: var(--color-text-muted);
        }

        .notification-admin-actions {
            display: flex;
            gap: 8px;
        }

        .notification-admin-btn-action {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 12px;
            border: 1px solid var(--color-border-default);
            background: transparent;
            cursor: pointer;
            color: var(--color-text-muted);
            transition: all 0.2s ease;
        }

        .notification-admin-btn-action:hover {
            color: var(--color-brand-primary);
            border-color: var(--color-brand-primary);
        }

        .notification-admin-footer {
            padding: var(--spacing-sm) var(--spacing-md);
            background: var(--color-background-surface-low);
            text-align: center;
            font-size: 11px;
            color: var(--color-text-muted);
            border-top: 1px solid var(--color-border-default);
        }

        .notification-admin-empty {
            padding: var(--spacing-xl) var(--spacing-md);
            text-align: center;
            color: var(--color-text-muted);
            font-style: italic;
            font-size: var(--font-size-sm);
        }

        .notification-admin-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
    `;
    document.head.appendChild(style);
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
