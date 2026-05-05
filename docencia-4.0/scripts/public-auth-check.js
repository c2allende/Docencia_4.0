import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // PASO CRÍTICO: Leer banderas DENTRO del callback para capturar el estado actual
        const isRegistering = 
            sessionStorage.getItem("registration_in_progress") === "true" ||
            sessionStorage.getItem("registration_just_completed") === "true";
        
        if (isRegistering) {
            console.log("[PUBLIC_AUTH] Registro detectado (banderas activas). Delegando control a register-handler...");
            return; // Detener redirección automática
        }

        console.log("[PUBLIC_AUTH] Usuario autenticado detectado. Redirigiendo a dashboard...");
        window.location.href = "dashboard.html";
    }
});
