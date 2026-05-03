/**
 * Admin Notifications Widget v2 - EMERGENCY CONTROL
 * Updated: 2026-05-02
 * Version: 2.0.2 (Complete Rewrite)
 */

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    subscribeToUnreadNotifications, 
    subscribeToRecentNotifications, 
    markNotificationAsRead, 
    archiveNotification 
} from "./notification-service.js";

console.info("🚀 [AdminNotificationsWidget] v2.0.2 physical file LOADED");

const STYLES_ID = 'notification-admin-scoped-styles';
let unreadCount = 0;
let notifications = [];
let unsubscribeUnread = null;
let unsubscribeRecent = null;

/**
 * Inyecta estilos CSS reforzados con !important para QA
 */
function injectStyles() {
    const oldStyle = document.getElementById(STYLES_ID);
    if (oldStyle) oldStyle.remove();
    
    const style = document.createElement('style');
    style.id = STYLES_ID;
    style.textContent = `
        .notification-admin-wrapper { 
            position: relative !important; 
            display: flex !important; 
            align-items: center !important; 
            z-index: 99999 !important;
            margin-left: auto !important;
            padding: 0 15px !important;
            height: 100% !important;
        }
        .notification-admin-bell-btn { 
            background: #ffffff !important; 
            border: 1px solid #e2e8f0 !important; 
            font-size: 22px !important; 
            cursor: pointer !important; 
            position: relative !important; 
            padding: 8px !important; 
            display: flex !important; 
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            transition: all 0.2s !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
        }
        .notification-admin-bell-btn:hover { transform: scale(1.05) !important; border-color: #3182ce !important; }
        .notification-admin-badge { 
            position: absolute !important; 
            top: -2px !important; 
            right: -2px !important; 
            background: #ff0000 !important; 
            color: #ffffff !important; 
            font-size: 10px !important; 
            font-weight: 900 !important; 
            min-width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important; 
            display: flex !important; 
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important; 
            border: 2px solid #ffffff !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 100000 !important;
        }
        .notification-admin-badge.hidden { display: none !important; }
        .notification-admin-dropdown { 
            position: absolute !important; 
            top: calc(100% + 10px) !important; 
            right: 0 !important; 
            width: 320px !important; 
            background: #ffffff !important; 
            border-radius: 12px !important; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important; 
            border: 1px solid #e2e8f0 !important; 
            z-index: 100001 !important; 
            overflow: hidden !important; 
            display: none !important; 
            flex-direction: column !important; 
            max-height: 450px !important; 
        }
        .notification-admin-dropdown.active { display: flex !important; }
        .notification-admin-header { 
            padding: 15px !important; 
            border-bottom: 1px solid #e2e8f0 !important; 
            background: #f8fafc !important; 
            font-weight: 800 !important; 
            color: #1a202c !important; 
            font-size: 13px !important;
            text-transform: uppercase !important;
        }
        .notification-admin-list { overflow-y: auto !important; display: flex !important; flex-direction: column !important; }
        .notification-admin-item { 
            padding: 12px 15px !important; 
            border-bottom: 1px solid #edf2f7 !important; 
            display: flex !important; 
            flex-direction: column !important; 
            gap: 4px !important; 
            font-size: 13px !important; 
            color: #4a5568 !important; 
            background: #ffffff !important;
        }
        .notification-admin-item.unread { background: #fff5f5 !important; border-left: 4px solid #ff0000 !important; }
        .notification-admin-title { font-weight: 700 !important; color: #1a202c !important; }
        .notification-admin-message { margin: 0 !important; line-height: 1.4 !important; font-size: 12px !important; }
        .notification-admin-actions { display: flex !important; gap: 10px !important; margin-top: 5px !important; }
        .notification-admin-btn { 
            background: transparent !important; 
            border: none !important; 
            color: #3182ce !important; 
            font-size: 11px !important; 
            cursor: pointer !important; 
            padding: 0 !important; 
            font-weight: 700 !important; 
            text-decoration: underline !important; 
        }
        .notification-admin-empty { padding: 30px 15px !important; text-align: center !important; color: #a0aec0 !important; font-size: 13px !important; font-style: italic !important; }
    `;
    document.head.appendChild(style);
}

/**
 * Actualiza la interfaz con los datos
 */
function updateUI() {
    const badge = document.getElementById('admin-notif-badge');
    const list = document.getElementById('admin-notif-list');

    if (!badge || !list) return;

    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.classList.remove('hidden');
        badge.style.display = 'flex';
    } else {
        badge.classList.add('hidden');
        badge.style.display = 'none';
    }

    if (notifications.length === 0) {
        list.innerHTML = '<div class="notification-admin-empty">No hay notificaciones recientes</div>';
        return;
    }

    list.innerHTML = notifications.map(n => {
        const isUnread = n.status === 'unread';
        return `
            <div class="notification-admin-item ${isUnread ? 'unread' : ''}">
                <span class="notification-admin-title">${n.title || 'Aviso'}</span>
                <p class="notification-admin-message">${n.message || ''}</p>
                <div class="notification-admin-actions">
                    ${isUnread ? `<button class="notification-admin-btn" onclick="window.handleAdminAction('read', '${n.id}')">Leída</button>` : ''}
                    <button class="notification-admin-btn" onclick="window.handleAdminAction('archive', '${n.id}')">Archivar</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Inicialización Principal
 */
export function initAdminNotifications() {
    console.info("⚡ [AdminNotificationsWidget] Initializing...");
    
    let container = document.getElementById('admin-notification-widget');
    
    // Auto-corrección de contenedor
    if (!container) {
        console.warn("⚠️ [AdminNotificationsWidget] No container found. Injecting into .top-nav");
        const nav = document.querySelector('.top-nav');
        if (nav) {
            container = document.createElement('div');
            container.id = 'admin-notification-widget';
            nav.appendChild(container);
        } else {
            console.error("❌ [AdminNotificationsWidget] No .top-nav found. CANNOT INITIALIZE.");
            return;
        }
    }

    injectStyles();
    
    container.innerHTML = `
        <div class="notification-admin-wrapper">
            <button id="admin-bell-btn" class="notification-admin-bell-btn" aria-label="Notificaciones">
                🔔
                <span id="admin-notif-badge" class="notification-admin-badge hidden">0</span>
            </button>
            <div id="admin-notif-dropdown" class="notification-admin-dropdown">
                <div class="notification-admin-header">Notificaciones Admin</div>
                <div id="admin-notif-list" class="notification-admin-list">
                    <div class="notification-admin-empty">Cargando...</div>
                </div>
            </div>
        </div>
    `;

    const btn = document.getElementById('admin-bell-btn');
    const dropdown = document.getElementById('admin-notif-dropdown');

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown?.classList.toggle('active');
        console.debug("🔔 [AdminNotificationsWidget] Toggle dropdown");
    });

    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.remove('active');
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (unsubscribeUnread) unsubscribeUnread();
        if (unsubscribeRecent) unsubscribeRecent();

        if (user) {
            console.info("👤 [AdminNotificationsWidget] Active user:", user.email);
            
            unsubscribeUnread = subscribeToUnreadNotifications(user.uid, (count) => {
                unreadCount = count;
                updateUI();
            });

            unsubscribeRecent = subscribeToRecentNotifications(user.uid, (data) => {
                notifications = data;
                updateUI();
            }, 5);

            window.handleAdminAction = async (type, id) => {
                try {
                    if (type === 'read') await markNotificationAsRead(user.uid, id);
                    if (type === 'archive') await archiveNotification(user.uid, id);
                } catch (err) {
                    console.error("❌ [AdminNotificationsWidget] Action Error:", err);
                }
            };
        } else {
            console.warn("👤 [AdminNotificationsWidget] No user authenticated.");
            unreadCount = 0;
            notifications = [];
            updateUI();
        }
    });
}
