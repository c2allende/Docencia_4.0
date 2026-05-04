import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getUserProfile } from "./user-service.js";

/**
 * AUTH GUARD: Protege las páginas privadas.
 * Verifica autenticación y estado del perfil en Firestore.
 * La matrícula NO es relevante aquí — controla solo el registro de nuevas cuentas.
 */
onAuthStateChanged(auth, async (user) => {
    console.log("GUARD: Auth state changed. User:", user ? user.email : "none");

    if (!user) {
        // Espera breve para descartar retrasos del SDK antes de redirigir
        setTimeout(() => {
            if (!auth.currentUser) {
                console.warn("GUARD: No session after wait. Redirecting to login.");
                window.location.href = "index.html";
            }
        }, 1000);
        return;
    }

    try {
        console.log("GUARD: Loading Firestore profile for UID:", user.uid);
        const profile = await getUserProfile(user.uid);
        console.log("GUARD: Profile received:", profile);

        if (!profile) {
            console.error("GUARD: Profile NOT found in Firestore. UID:", user.uid);
            await signOut(auth);
            sessionStorage.setItem("auth_redirect_message", "Tu cuenta no tiene un perfil activo en el programa. Comunícate con el administrador.");
            window.location.href = "index.html";
            return;
        }

        if (profile.status === "inactive" || profile.status === "archived" || profile.accessRevoked === true) {
            console.warn("GUARD: Access denied — account inactive or revoked.");
            await signOut(auth);
            sessionStorage.setItem("auth_redirect_message", "Tu acceso al programa no está activo. Comunícate con el administrador.");
            window.location.href = "index.html";
            return;
        }

        // status === "active" (participant o admin) → acceso permitido
        console.log("GUARD: Access granted for", profile.role, profile.email);

    } catch (error) {
        console.error("GUARD: Unexpected error verifying user state:", error);
        try { await signOut(auth); } catch (_) { /* ignorar */ }
        window.location.href = "index.html";
    }
});
