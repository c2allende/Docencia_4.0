import { db } from "../docencia-4.0/scripts/firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function checkConfig() {
    console.log("--- Diagnóstico de Configuración de Matrícula ---");
    try {
        const ref = doc(db, "configuracion", "registro");
        const snap = await getDoc(ref);
        
        if (!snap.exists()) {
            console.error("ERROR: El documento configuracion/registro no existe.");
            return;
        }

        const data = snap.data();
        console.log("Datos encontrados:", data);

        const start = data.enrollmentStartAt;
        const end = data.enrollmentEndAt;

        console.log("enrollmentStartAt type:", typeof start, start?.constructor?.name);
        console.log("enrollmentEndAt type:", typeof end, end?.constructor?.name);
        
        if (start?.toDate) {
            console.log("Fecha inicio (objeto):", start.toDate().toLocaleString());
        }
        if (end?.toDate) {
            console.log("Fecha fin (objeto):", end.toDate().toLocaleString());
        }

        const now = new Date();
        console.log("Hora actual del sistema:", now.toLocaleString());

    } catch (error) {
        console.error("Error durante el diagnóstico:", error);
    }
}

checkConfig();
