import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

/**
 * PURGE TEST DATA SCRIPT (Microfase 2.0F-5B)
 * Uso: 
 *   node scripts/maintenance/purge-test-data.js --dry-run  (Reporte preliminar)
 *   node scripts/maintenance/purge-test-data.js --execute  (BORRADO FÍSICO - REQUIERE APROBACIÓN)
 */

// --- CONFIGURACIÓN DE SEGURIDAD ---
const PROTECTED_UIDS = ['9l2MOKU8Y9ayX9yHmxtAcpGkzcJ2'];
const PROTECTED_EMAILS = ['carmelo.allende@gmail.com'];
const TEST_PATTERNS = /^(test|qa|alumno_qa|testusers|qatest|test_participant|test_progress|test_verify|test_final|example|ejemplo|participante prueba)/i;

const isDryRun = process.argv.includes('--dry-run') || !process.argv.includes('--execute');

async function runPurge() {
    console.log("---------------------------------------------------------");
    console.log("🔥 INICIANDO PURGA CONTROLADA DE DATOS DE PRUEBA");
    console.log(`MODO: ${isDryRun ? '🔍 DRY-RUN (AUDITORÍA)' : '⚠️ EJECUCIÓN REAL (BORRADO)'}`);
    console.log("---------------------------------------------------------");

    // Inicialización (Asume que tienes configurado el entorno local de Firebase Admin o ADC)
    // Nota: Para ejecutar localmente, asegúrate de haber corrido 'gcloud auth application-default login'
    // o tener la variable GOOGLE_APPLICATION_CREDENTIALS configurada.
    try {
        // Intento 1: Buscar archivo de service account local (no versionado)
        const fs = await import('fs');
        const path = await import('path');
        const saPath = path.join(process.cwd(), 'serviceAccountKey.json');
        
        if (fs.existsSync(saPath)) {
            console.log("🔑 Usando serviceAccountKey.json local...");
            initializeApp({
                credential: cert(saPath),
                projectId: "docencia-4-lms"
            });
        } else {
            // Intento 2: Usar credenciales por defecto (ADC)
            console.log("☁️ Intentando usar Application Default Credentials para 'docencia-4-lms'...");
            initializeApp({
                projectId: "docencia-4-lms"
            });
        }
    } catch (e) {
        if (e.code !== 'app/duplicate-app') {
            console.error("❌ Error de inicialización:", e.message);
            console.log("\n💡 TIP: Ejecuta 'gcloud auth application-default login' o coloca un 'serviceAccountKey.json' en la raíz.");
            process.exit(1);
        }
    }

    const db = getFirestore();
    const usersCol = db.collection('usuarios');
    const usersSnapshot = await usersCol.get();

    const candidates = [];
    const excluded = [];

    console.log(`Analizando ${usersSnapshot.size} usuarios...`);

    for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        const uid = doc.id;
        const email = userData.email || "";
        const displayName = userData.displayName || "";
        const role = userData.role || "participant";

        // 1. Verificación de Protección
        if (PROTECTED_UIDS.includes(uid) || PROTECTED_EMAILS.includes(email) || role === 'admin') {
            excluded.push({ uid, email, reason: "CUENTA PROTEGIDA / ADMIN" });
            continue;
        }

        // 2. Identificación de Candidatos
        const matchesEmail = TEST_PATTERNS.test(email);
        const matchesName = TEST_PATTERNS.test(displayName);
        const isTestFlag = userData.isTest === true;
        const isArchivedTest = userData.status === 'archived' && matchesEmail;

        if (matchesEmail || matchesName || isTestFlag || isArchivedTest) {
            // Analizar subcolecciones
            const subcollections = ['progresoPaginas', 'progresoModulos', 'notificaciones', 'anuncioLecturas'];
            const subStats = {};
            let totalSubDocs = 0;

            for (const sub of subcollections) {
                const subSnap = await usersCol.doc(uid).collection(sub).get();
                subStats[sub] = subSnap.size;
                totalSubDocs += subSnap.size;
            }

            candidates.push({
                uid,
                email,
                displayName,
                role,
                status: userData.status || 'active',
                isTest: userData.isTest || false,
                reason: matchesEmail ? "Patrón de Email" : (matchesName ? "Nombre de Prueba" : "Flag isTest"),
                subStats,
                totalSubDocs
            });
        }
    }

    // --- REPORTE DRY-RUN ---
    console.log("\n✅ AUDITORÍA COMPLETADA");
    console.log(`Candidatos detectados: ${candidates.length}`);
    console.log(`Usuarios excluidos por seguridad: ${excluded.length}\n`);

    if (candidates.length > 0) {
        console.table(candidates.map(c => ({
            UID: c.uid,
            Email: c.email,
            Nombre: c.displayName,
            Razón: c.reason,
            Docs: c.totalSubDocs
        })));

        if (!isDryRun) {
            console.log("\n⚠️⚠️⚠️ ATENCIÓN: PROCEDIENDO AL BORRADO FÍSICO EN 5 SEGUNDOS...");
            await new Promise(r => setTimeout(r, 5000));

            for (const cand of candidates) {
                console.log(`\nPurganado usuario: ${cand.email} (${cand.uid})`);
                
                // Borrar subcolecciones
                for (const subName of Object.keys(cand.subStats)) {
                    if (cand.subStats[subName] > 0) {
                        const subCol = usersCol.doc(cand.uid).collection(subName);
                        const docs = await subCol.get();
                        console.log(`  - Borrando ${docs.size} docs en ${subName}...`);
                        const batch = db.batch();
                        docs.forEach(d => batch.delete(d.ref));
                        await batch.commit();
                    }
                }

                // Borrar documento principal
                await usersCol.doc(cand.uid).delete();
                console.log(`  - Perfil de usuario eliminado.`);
            }
            console.log("\n✨ PURGA COMPLETADA CON ÉXITO.");
        } else {
            console.log("\n💡 Para ejecutar el borrado, usa el flag: --execute");
        }
    } else {
        console.log("No se encontraron candidatos para borrar.");
    }
}

runPurge().catch(console.error);
