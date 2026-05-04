import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getUserProfile } from "./user-service.js";

/**
 * AUTH GUARD: Protege las páginas privadas.
 * Verifica autenticación y estado del usuario en Firestore.
 * Sin perfil válido en Firestore → cierre de sesión y redirección.
 */
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const profile = await getUserProfile(user.uid);

        if (!profile) {
            await signOut(auth);
            sessionStorage.setItem("auth_redirect_message", "Tu cuenta no tiene un perfil activo. Comunícate con el administrador.");
            window.location.href = "index.html";
            return;
        }

        // 1. Verificar si el usuario es administrador (bypass de periodo de matrícula)
        const userIsAdmin = profile.role === "admin";

        // 2. Si no es admin, verificar si la matrícula está abierta
        if (!userIsAdmin) {
            const { getEnrollmentConfig, evaluateEnrollmentStatus } = await import("./enrollment-service.js");
            const config = await getEnrollmentConfig();
            const enrollmentStatus = evaluateEnrollmentStatus(config);

            if (!enrollmentStatus.isOpen) {
                console.warn("Acceso denegado: Periodo de matrícula cerrado.");
                await signOut(auth);
                alert(enrollmentStatus.message);
                window.location.href = "index.html";
                return;
            }
        }

        // 3. Bloqueo por estado o revocación manual
        if (profile.status === "inactive" || profile.status === "archived" || profile.accessRevoked === true) {
            console.warn("Acceso denegado: cuenta inactiva o acceso revocado.");
            await signOut(auth);
            alert("Tu acceso al programa no está activo. Comunícate con el administrador.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error al verificar estado del usuario:", error);
        // Ante error inesperado, cerrar sesión por seguridad
        try { await signOut(auth); } catch (_) { /* ignorar */ }
        window.location.href = "index.html";
    }
});
