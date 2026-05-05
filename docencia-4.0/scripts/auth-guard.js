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
        // PASO 6: Logs temporales para diagnóstico
        console.log("[AUTH_GUARD] auth uid", user?.uid);
        let profile = null;

        const isNewRegistration = sessionStorage.getItem("registration_just_completed") === "true";
        
        if (isNewRegistration) {
            console.log("[AUTH_GUARD] Registro reciente detectado. Iniciando ciclo de estabilización...");
            
            for (let attempt = 1; attempt <= 6; attempt++) {
                try {
                    // En cada intento fallido de registro nuevo, forzamos un refresh del estado de Auth
                    if (attempt > 1) {
                        console.log(`[AUTH_GUARD] Forzando refresco de token (Intento ${attempt})...`);
                        await user.getIdToken(true);
                        await user.reload();
                    }

                    profile = await getUserProfile(user.uid);
                    if (profile) {
                        console.log(`[AUTH_GUARD] Perfil sincronizado en intento ${attempt}`);
                        break;
                    }
                } catch (e) {
                    const isPermissionDenied = e.code === "permission-denied" || e.message?.includes("permissions");
                    console.warn(`[AUTH_GUARD] Intento ${attempt} falló (${e.code || "error"}):`, e.message);
                    
                    if (!isPermissionDenied && attempt > 2) break;
                }
                
                if (attempt < 6) {
                    const delay = attempt === 1 ? 1200 : 1000;
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        } else {
            // Usuario existente: lectura directa sin reintentos agresivos
            profile = await getUserProfile(user.uid);
        }

        if (isNewRegistration && profile) {
            console.log("[AUTH_GUARD] Estabilización completada. Limpiando bandera.");
            sessionStorage.removeItem("registration_just_completed");
        }

        // PASO 6: Log del resultado final del perfil
        console.log("[AUTH_GUARD] profile result", profile);

        if (!profile) {
            console.error("[AUTH_GUARD] Perfil inaccesible o inexistente. UID:", user.uid);
            sessionStorage.removeItem("registration_just_completed"); // Limpieza por seguridad
            await signOut(auth);
            sessionStorage.setItem("auth_redirect_message", "No pudimos confirmar tu perfil en este momento. Intenta iniciar sesión nuevamente o comunícate con el administrador.");
            window.location.href = "index.html";
            return;
        }

        // Validación de estado (NO de matrícula)
        if (profile.status === "inactive" || profile.status === "archived" || profile.accessRevoked === true) {
            console.warn("[AUTH_GUARD] Acceso denegado: cuenta inactiva o revocada.", profile.status);
            await signOut(auth);
            sessionStorage.setItem("auth_redirect_message", "Tu acceso al programa no está activo. Comunícate con el administrador.");
            window.location.href = "index.html";
            return;
        }

        console.log("[AUTH_GUARD] Acceso concedido:", profile.role, profile.email);

    } catch (error) {
        console.error("[AUTH_GUARD] Error inesperado en verificación:", error);
        try { await signOut(auth); } catch (_) { /* ignorar */ }
        window.location.href = "index.html";
    }
});
