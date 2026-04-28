import { auth } from "./firebase-config.js";
import { logout } from "./auth.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getUserProfile, createUserProfile } from "./user-service.js";

const authMessage = document.getElementById('authMessage');
const profileNameDisplay = document.getElementById('profile-summary-title');
const profileEmailDisplay = document.getElementById('profileEmailText');
const roleDisplay = document.getElementById('profileRoleBadge');
const statusDisplay = document.getElementById('accountStatus');
const verificationStatus = document.getElementById('verificationStatus');
const resendVerificationBtn = document.getElementById('resendVerificationBtn');
const logoutBtn = document.getElementById('logoutBtn');

function showMessage(text, type = 'info') {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message is-visible is-${type}`;
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // 1. Intentar obtener perfil de Firestore
            let profile = await getUserProfile(user.uid);

            // 2. Si no existe, crear uno mínimo (Auto-migración)
            if (!profile) {
                console.log("Perfil no encontrado, creando perfil mínimo...");
                profile = await createUserProfile(user);
            }

            // 3. Actualizar Interfaz
            if (profileNameDisplay) profileNameDisplay.textContent = profile.displayName || 'Participante';
            if (profileEmailDisplay) profileEmailDisplay.textContent = profile.email || '';
            const avatar = document.getElementById('profileAvatar');
            if (avatar && profile.displayName) avatar.textContent = profile.displayName.charAt(0).toUpperCase();
            
            if (roleDisplay) {
                roleDisplay.textContent = profile.role === 'admin' ? 'Administrador' : 'Participante';
                roleDisplay.className = `profile-role ${profile.role === 'admin' ? 'admin-badge' : ''}`;
            }

            if (statusDisplay) {
                statusDisplay.textContent = profile.status === 'active' ? 'Cuenta Activa' : 'Inactiva';
            }

            // 4. Mostrar botones administrativos si aplica
            if (profile.role === "admin" || user.email === "carmelo.allende@gmail.com") {
                const adminSidebarLink = document.getElementById('adminSidebarLink');
                const adminProfileBtn = document.getElementById('adminProfileBtn');
                if (adminSidebarLink) adminSidebarLink.style.display = 'block';
                if (adminProfileBtn) adminProfileBtn.style.display = 'inline-flex';
            }
            
            // 5. Estado de verificación
            if (verificationStatus) {
                verificationStatus.textContent = user.emailVerified ? 'Verificado' : 'Pendiente de verificación';
                verificationStatus.className = user.emailVerified ? 'status-badge verified' : 'status-badge pending';
            }

            if (resendVerificationBtn) {
                resendVerificationBtn.style.display = user.emailVerified ? 'none' : 'inline-block';
            }

        } catch (error) {
            console.error("Error al cargar perfil:", error);
            showMessage('Error al conectar con la base de datos de usuario.', 'error');
        }
    }
});

logoutBtn?.addEventListener('click', async () => {
    try {
        await logout();
        window.location.href = "index.html";
    } catch (error) {
        showMessage('Error al cerrar sesión.', 'error');
    }
});

resendVerificationBtn?.addEventListener('click', async () => {
    if (auth.currentUser) {
        try {
            await sendEmailVerification(auth.currentUser);
            showMessage('Email de verificación enviado. Revisa tu bandeja de entrada.', 'success');
        } catch (error) {
            showMessage('Error al enviar el email. Intenta más tarde.', 'error');
        }
    }
});
