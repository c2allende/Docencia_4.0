import { db } from "../firebase-config.js";
import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * MIGRACIÓN ONE-TIME: Sincroniza progreso de subcolecciones al documento raíz.
 * Esto habilita la reactividad del nuevo Centro de Operaciones.
 */
async function syncAllParticipantsProgress() {
    console.log("🚀 Iniciando sincronización de métricas para Centro de Operaciones...");
    
    try {
        const usersCol = collection(db, "usuarios");
        // Traemos todos los usuarios para filtrar de forma flexible en el cliente
        const snapshot = await getDocs(usersCol);
        
        console.log(`Analizando ${snapshot.size} usuarios totales...`);
        
        for (const userDoc of snapshot.docs) {
            const userData = userDoc.data();
            const role = (userData.role || "").toLowerCase();
            const isParticipant = role === "participant" || role === "participante";

            if (!isParticipant) continue;
            const uid = userDoc.id;
            const email = userDoc.data().email;
            console.log(`Procesando: ${email} (${uid})...`);
            
            const progress = {};
            const subcollections = ["modulo1", "modulo2", "modulo3"];
            
            for (const mid of subcollections) {
                const modRef = doc(db, "usuarios", uid, "progresoModulos", mid);
                const modSnap = await getDocs(query(collection(db, "usuarios", uid, "progresoModulos"), where("moduleId", "==", mid)));
                
                if (!modSnap.empty) {
                    const data = modSnap.docs[0].data();
                    progress[mid] = data.percentComplete || 0;
                } else {
                    progress[mid] = 0;
                }
            }
            
            await updateDoc(doc(db, "usuarios", uid), {
                progress: progress,
                lastSync: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            console.log(`✅ ${email} sincronizado:`, progress);
        }
        
        console.log("🎉 Sincronización completada con éxito.");
    } catch (error) {
        console.error("❌ Error en la sincronización:", error);
    }
}

// Exponer globalmente para ejecutar desde la consola si es necesario
window.runProgressSync = syncAllParticipantsProgress;
