import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA",
  authDomain: "docencia-4-lms.firebaseapp.com",
  projectId: "docencia-4-lms",
  storageBucket: "docencia-4-lms.firebasestorage.app",
  messagingSenderId: "933926490691",
  appId: "1:933926490691:web:75c43c1cb528448702baf6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncAllUsersProgress() {
    console.log("Iniciando sincronización masiva de progreso...");
    const usersCol = collection(db, "usuarios");
    const usersSnap = await getDocs(usersCol);
    
    let updatedCount = 0;

    for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const userData = userDoc.data();
        
        if (userData.role !== "participant" && userData.role !== "participante") continue;

        console.log(`Sincronizando: ${userData.email} (${uid})`);
        
        // Obtener progreso de módulos
        const progressCol = collection(db, "usuarios", uid, "progresoModulos");
        const progressSnap = await getDocs(progressCol);
        
        const progress = {
            modulo1: 0,
            modulo2: 0,
            modulo3: 0
        };

        progressSnap.forEach(modDoc => {
            if (progress.hasOwnProperty(modDoc.id)) {
                progress[modDoc.id] = modDoc.data().percentComplete || 0;
            }
        });

        // Actualizar documento raíz
        await updateDoc(doc(db, "usuarios", uid), {
            progress: progress,
            lastActivity: userData.lastActivity || serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        console.log(`- Progreso sincronizado: M1:${progress.modulo1}% M2:${progress.modulo2}% M3:${progress.modulo3}%`);
        updatedCount++;
    }

    console.log(`Sincronización completada. ${updatedCount} usuarios actualizados.`);
}

// syncAllUsersProgress();
