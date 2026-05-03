/**
 * module-access-guard.js
 * Guard de control de acceso por módulo — Docencia 4.0
 * Se incluye como <script type="module"> en páginas de módulo.
 * No afecta páginas sin data-module-id.
 * v1.0.0 — Microfase 2.0F-1
 */

import { auth } from './firebase-config.js';
import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { canAccessSection, mapPageTypeToSection } from './module-access-service.js';

// ─── Leer atributos de la página ──────────────────────────────────────────────
const body = document.body;
const moduleId  = body?.dataset?.moduleId  ?? null;
const pageType  = body?.dataset?.pageType  ?? null;
const pageTitle = body?.dataset?.title     ?? 'este contenido';

// Si la página no declara módulo, el guard no actúa
if (!moduleId || !pageType) {
    // No es una página de módulo controlada → salir silenciosamente
} else {
    // ─── Inyectar overlay bloqueador (oculto por defecto) ─────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'access-blocked-overlay';
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.style.cssText = [
        'display:none',
        'position:fixed',
        'inset:0',
        'z-index:9999',
        'background:var(--color-background-page,#0f172a)',
        'color:var(--color-text-primary,#f8fafc)',
        'font-family:var(--font-family-body,sans-serif)',
        'align-items:center',
        'justify-content:center',
        'flex-direction:column',
        'gap:1.5rem',
        'padding:2rem',
        'text-align:center',
    ].join(';');

    overlay.innerHTML = `
        <div style="font-size:3rem;line-height:1" aria-hidden="true">🔒</div>
        <h1 style="margin:0;font-size:1.5rem;font-weight:800;color:var(--color-text-display,#f8fafc)">
            Contenido no disponible
        </h1>
        <p style="margin:0;max-width:480px;color:var(--color-text-secondary,#94a3b8);line-height:1.6">
            Este contenido no está disponible en este momento.<br>
            Consulta con el facilitador del programa.
        </p>
        <a href="dashboard.html"
           style="display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;
                  background:var(--color-brand-primary,#6366f1);color:#fff;border-radius:9999px;
                  font-weight:700;text-decoration:none;transition:opacity .2s"
           onmouseover="this.style.opacity='.85'"
           onmouseout="this.style.opacity='1'">
            ← Volver al Dashboard
        </a>
    `;
    document.body.appendChild(overlay);

    // ─── Función para mostrar el bloqueo ──────────────────────────────────────
    function showBlockedUI(isAdminMode = false) {
        if (isAdminMode) {
            // Admin ve el contenido pero con aviso discreto en top
            const adminBanner = document.createElement('div');
            adminBanner.style.cssText = [
                'position:fixed',
                'top:80px',
                'left:50%',
                'transform:translateX(-50%)',
                'z-index:8888',
                'background:var(--color-brand-secondary,#f59e0b)',
                'color:#000',
                'padding:.5rem 1.25rem',
                'border-radius:9999px',
                'font-size:.8rem',
                'font-weight:700',
                'box-shadow:0 4px 12px rgba(0,0,0,.3)',
                'pointer-events:none',
            ].join(';');
            adminBanner.textContent = '⚠️ Modo Admin — este contenido está bloqueado para participantes';
            document.body.appendChild(adminBanner);
        } else {
            overlay.style.display = 'flex';
            // Ocultar el contenido principal para evitar flash antes de que cargue el guard
            document.querySelectorAll('main, .module-main, .content-main, .lesson-content').forEach(el => {
                el.style.visibility = 'hidden';
            });
        }
    }

    // ─── Verificar si el usuario es admin ────────────────────────────────────
    async function isUserAdmin(uid) {
        try {
            const snap = await getDoc(doc(db, 'usuarios', uid));
            if (!snap.exists()) return false;
            return snap.data().role === 'admin' && snap.data().status === 'active';
        } catch {
            return false;
        }
    }

    // ─── Lógica principal ─────────────────────────────────────────────────────
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Sin sesión → redirige al login (auth-guard ya lo maneja, pero por si acaso)
            return;
        }

        const [adminFlag, allowed] = await Promise.all([
            isUserAdmin(user.uid),
            canAccessSection(moduleId, pageType),
        ]);

        if (allowed) {
            // Acceso permitido → asegurar que overlay esté oculto y contenido visible
            overlay.style.display = 'none';
            document.querySelectorAll('main, .module-main, .content-main, .lesson-content').forEach(el => {
                el.style.visibility = '';
            });
            return;
        }

        // Acceso bloqueado
        showBlockedUI(adminFlag);
    });
}
