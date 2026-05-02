import { auth } from "./firebase-config.js";
import { logout } from "./auth.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getUserProfile, createUserProfile, updateUserProfile } from "./user-service.js";

// ─── Utilidades ───────────────────────────────────────────────────────────────

function getInitials(value) {
    const text = (value || '').trim();
    if (!text) return 'P';
    return text.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function showMessage(text, type = 'info') {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = text;
    el.className = `auth-message is-visible is-${type}`;
    setTimeout(() => { el.className = 'auth-message'; }, 5000);
}

function formatDate(value) {
    if (!value) return 'No disponible';
    try {
        const d = value?.toDate ? value.toDate() : new Date(value);
        if (isNaN(d.getTime())) return 'No disponible';
        return d.toLocaleString('es-PR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return 'No disponible'; }
}

function roleLabel(role) {
    if (role === 'admin') return 'Administrador';
    if (role === 'participant') return 'Participante';
    return role ? role : 'No definido';
}

// ─── Renderizado ──────────────────────────────────────────────────────────────

function renderProfile(user, profile) {
    // Fuente única de verdad: role viene de Firestore
    const role = profile?.role || 'participant';
    const displayName = profile?.displayName
        || user.displayName
        || user.email.split('@')[0];

    // --- Tarjeta izquierda ---
    const avatarEl = document.getElementById('profileAvatar');
    const nameEl = document.getElementById('profile-summary-title');
    const emailTextEl = document.getElementById('profileEmailText');
    const roleBadgeEl = document.getElementById('profileRoleBadge');

    if (avatarEl) avatarEl.textContent = getInitials(displayName);
    if (nameEl) nameEl.textContent = displayName;
    if (emailTextEl) emailTextEl.textContent = user.email;
    if (roleBadgeEl) {
        roleBadgeEl.textContent = roleLabel(role);
        roleBadgeEl.className = `profile-role${role === 'admin' ? ' admin-badge' : ''}`;
    }

    // Botones administrativos (solo si es admin)
    if (role === 'admin') {
        const adminSidebarLink = document.getElementById('adminSidebarLink');
        const adminProfileBtn = document.getElementById('adminProfileBtn');
        if (adminSidebarLink) adminSidebarLink.style.display = 'block';
        if (adminProfileBtn) adminProfileBtn.style.display = 'inline-flex';
    }

    // Botón de reenvío: ocultar si ya está verificado
    const resendBtn = document.getElementById('resendVerificationBtn');
    if (resendBtn) resendBtn.style.display = user.emailVerified ? 'none' : 'inline-flex';

    // --- Estado de cuenta ---

    // Badge sesión activa
    const sessionBadge = document.getElementById('sessionBadge');
    if (sessionBadge) {
        sessionBadge.textContent = 'Sesión activa';
        sessionBadge.style.cssText = 'background: var(--color-brand-primary, #3182ce); color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;';
    }

    // Verificación de email (desde Auth)
    const emailStatus = document.getElementById('emailStatus');
    if (emailStatus) emailStatus.textContent = user.emailVerified ? 'Verificado' : 'No verificado';

    // Rol (desde Firestore — fuente única)
    const roleStatus = document.getElementById('roleStatus');
    if (roleStatus) roleStatus.textContent = roleLabel(role);

    // Último acceso: Auth primero, luego Firestore, luego fallback
    const lastAccessStatus = document.getElementById('lastAccessStatus');
    if (lastAccessStatus) {
        const fromAuth = user.metadata?.lastSignInTime;
        const fromFirestore = profile?.lastLoginAt || profile?.lastAccessAt;
        lastAccessStatus.textContent = fromAuth
            ? formatDate(fromAuth)
            : fromFirestore
                ? formatDate(fromFirestore)
                : 'No disponible';
    }

    // --- Formulario Información básica ---

    const displayNameInput = document.getElementById('displayName');
    const roleContextSelect = document.getElementById('roleContext');
    const emailInput = document.getElementById('email');

    if (displayNameInput) displayNameInput.value = profile?.displayName || user.displayName || '';

    // Email siempre de solo lectura, desde Auth
    if (emailInput) {
        emailInput.value = user.email;
        emailInput.readOnly = true;
    }

    // Preseleccionar roleContext desde Firestore
    if (roleContextSelect && profile?.roleContext) {
        const match = Array.from(roleContextSelect.options)
            .find(o => o.value === profile.roleContext);
        if (match) {
            roleContextSelect.value = profile.roleContext;
        } else {
            // Si el valor guardado no está en el select, agregar dinámicamente
            const opt = document.createElement('option');
            opt.value = profile.roleContext;
            opt.textContent = profile.roleContext;
            roleContextSelect.appendChild(opt);
            roleContextSelect.value = profile.roleContext;
        }
    }
}

// ─── Carga de datos ───────────────────────────────────────────────────────────

async function loadProfile(user) {
    try {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
            console.log('[Profile] Perfil no encontrado — creando perfil mínimo…');
            profile = await createUserProfile(user);
        }
        renderProfile(user, profile);
    } catch (err) {
        console.error('[Profile] Error al cargar perfil:', err);
        showMessage('Error al conectar con la base de datos de usuario.', 'error');
    }
}

// ─── Inicialización ───────────────────────────────────────────────────────────

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadProfile(user);
    }
    // Si no hay usuario, auth-guard.js ya redirige al login
});

// ─── Guardar cambios (solo campos permitidos) ─────────────────────────────────

document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const displayName = document.getElementById('displayName')?.value.trim() || '';
    const roleContext = document.getElementById('roleContext')?.value || '';

    if (!displayName) {
        showMessage('El nombre visible no puede estar vacío.', 'error');
        return;
    }

    try {
        // SOLO se actualizan campos permitidos — role, status, email, uid NUNCA se envían
        await updateUserProfile(user.uid, { displayName, roleContext });
        showMessage('Perfil actualizado correctamente.', 'success');
        // Refrescar UI desde Firestore para confirmar persistencia
        await loadProfile(user);
    } catch (err) {
        console.error('[Profile] Error al guardar:', err);
        if (err.code === 'permission-denied') {
            showMessage('Sin permiso para guardar. Contacta al administrador.', 'error');
        } else {
            showMessage('Error al guardar los cambios. Intenta de nuevo.', 'error');
        }
    }
});

// ─── Actualizar datos sin recargar página ─────────────────────────────────────

document.getElementById('reloadProfileBtn')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    showMessage('Actualizando datos…', 'info');
    await loadProfile(user);
    showMessage('Datos actualizados correctamente.', 'success');
});

// ─── Cerrar sesión ────────────────────────────────────────────────────────────

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await logout();
        window.location.href = 'index.html';
    } catch (err) {
        showMessage('Error al cerrar sesión.', 'error');
    }
});

// ─── Reenviar email de verificación ──────────────────────────────────────────

document.getElementById('resendVerificationBtn')?.addEventListener('click', async () => {
    if (auth.currentUser) {
        try {
            await sendEmailVerification(auth.currentUser);
            showMessage('Email de verificación enviado. Revisa tu bandeja de entrada.', 'success');
        } catch (err) {
            showMessage('Error al enviar el email. Intenta más tarde.', 'error');
        }
    }
});
