import { db, auth } from './firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    serverTimestamp,
    runTransaction,
    increment,
    writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/**
 * Obtiene la información base de un foro.
 */
export async function getForum(foroId) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        const forumRef = doc(db, "foros", foroId);
        const forumSnap = await getDoc(forumRef);
        
        if (forumSnap.exists()) {
            return { id: forumSnap.id, ...forumSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error al obtener foro:", error);
        throw error;
    }
}

/**
 * Obtiene las publicaciones activas de un foro.
 */
export async function getForumPosts(foroId, limitNumber = 50) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        // En 1.9B filtramos por status localmente si los índices no existen, 
        // pero lo ideal es query compuesto. Usaremos query básico por ahora.
        const postsRef = collection(db, "foros", foroId, "publicaciones");
        const q = query(
            postsRef, 
            where("status", "==", "active"),
            orderBy("createdAt", "desc"),
            limit(limitNumber)
        );
        
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        
        return posts;
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        throw error;
    }
}

/**
 * Crea una nueva publicación en un foro.
 */
export async function createForumPost(foroId, content, authorName, authorContext) {
    const user = auth.currentUser;
    if (!user) throw new Error("No autenticado");
    if (!content || content.trim() === '') throw new Error("El contenido no puede estar vacío");

    try {
        const postsRef = collection(db, "foros", foroId, "publicaciones");
        const newPost = {
            foroId: foroId,
            uid: user.uid,
            authorName: authorName || "Participante",
            authorContext: authorContext || "No especificado",
            content: content.trim(),
            status: "active",
            replyCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(postsRef, newPost);
        return { id: docRef.id, ...newPost, createdAt: new Date() }; // Fallback local
    } catch (error) {
        console.error("Error al crear publicación:", error);
        throw error;
    }
}

/**
 * Obtiene las respuestas activas de una publicación específica.
 */
export async function getPostReplies(foroId, postId) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        const repliesRef = collection(db, "foros", foroId, "publicaciones", postId, "respuestas");
        const q = query(
            repliesRef, 
            where("status", "==", "active"),
            orderBy("createdAt", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        const replies = [];
        querySnapshot.forEach((doc) => {
            replies.push({ id: doc.id, ...doc.data() });
        });
        
        return replies;
    } catch (error) {
        console.error("Error al obtener respuestas:", error);
        throw error;
    }
}

/**
 * Crea una nueva respuesta a una publicación.
 */
export async function createPostReply(foroId, postId, content, authorName, authorContext) {
    const user = auth.currentUser;
    if (!user) throw new Error("No autenticado");
    if (!content || content.trim() === '') throw new Error("El contenido no puede estar vacío");

    try {
        const newReply = {
            foroId: foroId,
            postId: postId,
            uid: user.uid,
            authorName: authorName || "Participante",
            authorContext: authorContext || "No especificado",
            content: content.trim(),
            status: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Transacción opcional para incrementar replyCount de forma segura,
        // pero por simplicidad en 1.9B, usaremos adición simple y luego incrementamos
        const repliesRef = collection(db, "foros", foroId, "publicaciones", postId, "respuestas");
        const docRef = await addDoc(repliesRef, newReply);
        
        // No es estrictamente necesario en V1.9B actualizar el conteo si no lo mostramos, 
        // pero es buena práctica mantener la integridad
        return { id: docRef.id, ...newReply, createdAt: new Date() };
    } catch (error) {
        console.error("Error al responder:", error);
        throw error;
    }
}

// ==========================================
// MÉTODOS DE ADMINISTRACIÓN (FASE 1.9D)
// ==========================================

/**
 * Obtiene publicaciones de foros específicos para el administrador.
 * Ejecuta consultas paralelas a los foros indicados.
 */
export async function getAdminForumPosts(filters = {}) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        const targetForums = filters.foroId && filters.foroId !== 'all' 
            ? [filters.foroId] 
            : ["general", "modulo1", "modulo2", "modulo3"];
            
        const allPosts = [];
        
        for (const fId of targetForums) {
            const postsRef = collection(db, "foros", fId, "publicaciones");
            let q;
            
            if (filters.status && filters.status !== 'all') {
                q = query(postsRef, where("status", "==", filters.status), orderBy("createdAt", "desc"));
            } else {
                q = query(postsRef, orderBy("createdAt", "desc"));
            }
            
            const snap = await getDocs(q);
            snap.forEach(doc => {
                const data = doc.data();
                // Filtro local adicional de texto si aplica
                let passText = true;
                if (filters.searchTerm) {
                    const term = filters.searchTerm.toLowerCase();
                    const text = `${data.authorName || ''} ${data.content || ''}`.toLowerCase();
                    passText = text.includes(term);
                }
                
                if (passText) {
                    allPosts.push({ id: doc.id, foroId: fId, ...data });
                }
            });
        }
        
        // Ordenar en memoria por fecha descendente
        allPosts.sort((a, b) => {
            const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return dateB - dateA;
        });
        
        return allPosts;
    } catch (error) {
        console.error("Error al obtener publicaciones para admin:", error);
        throw error;
    }
}

/**
 * Obtiene todas las respuestas de una publicación (sin filtro de estado).
 */
export async function getAdminPostReplies(foroId, postId) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        const repliesRef = collection(db, "foros", foroId, "publicaciones", postId, "respuestas");
        const q = query(repliesRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        
        const replies = [];
        snap.forEach((doc) => {
            replies.push({ id: doc.id, ...doc.data() });
        });
        return replies;
    } catch (error) {
        console.error("Error al obtener respuestas para admin:", error);
        throw error;
    }
}

/**
 * Modera (oculta o archiva) una publicación y crea un registro en adminLogs de forma atómica.
 */
export async function moderatePost(foroId, postId, newStatus, note, adminInfo) {
    if (!auth.currentUser) throw new Error("No autenticado");
    if (!["hidden", "archived"].includes(newStatus)) throw new Error("Estado inválido para moderación");
    
    try {
        const batch = writeBatch(db);
        
        // Referencias
        const postRef = doc(db, "foros", foroId, "publicaciones", postId);
        const logRef = doc(collection(db, "adminLogs"));
        
        // Obtener el estado actual del post para el log
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) throw new Error("Publicación no encontrada");
        const postData = postSnap.data();
        
        // 1. Actualizar el documento del post
        batch.update(postRef, {
            status: newStatus,
            moderatedAt: serverTimestamp(),
            moderatedBy: auth.currentUser.uid
        });
        
        // 2. Crear el registro en adminLogs
        batch.set(logRef, {
            action: "moderate_forum_post",
            foroId: foroId,
            postId: postId,
            targetUid: postData.uid,
            targetAuthorName: postData.authorName,
            previousStatus: postData.status,
            newStatus: newStatus,
            performedBy: auth.currentUser.uid,
            performedByEmail: adminInfo.email || auth.currentUser.email || "no-email",
            createdAt: serverTimestamp(),
            note: note || "Moderación administrativa"
        });
        
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error al moderar publicación:", error);
        throw error;
    }
}

/**
 * Modera (oculta o archiva) una respuesta y crea un registro en adminLogs de forma atómica.
 */
export async function moderateReply(foroId, postId, replyId, newStatus, note, adminInfo) {
    if (!auth.currentUser) throw new Error("No autenticado");
    if (!["hidden", "archived"].includes(newStatus)) throw new Error("Estado inválido para moderación");
    
    try {
        const batch = writeBatch(db);
        
        // Referencias
        const replyRef = doc(db, "foros", foroId, "publicaciones", postId, "respuestas", replyId);
        const logRef = doc(collection(db, "adminLogs"));
        
        // Obtener el estado actual
        const replySnap = await getDoc(replyRef);
        if (!replySnap.exists()) throw new Error("Respuesta no encontrada");
        const replyData = replySnap.data();
        
        // 1. Actualizar el documento de la respuesta
        batch.update(replyRef, {
            status: newStatus,
            moderatedAt: serverTimestamp(),
            moderatedBy: auth.currentUser.uid
        });
        
        // 2. Crear el registro en adminLogs
        batch.set(logRef, {
            action: "moderate_forum_reply",
            foroId: foroId,
            postId: postId,
            replyId: replyId,
            targetUid: replyData.uid,
            targetAuthorName: replyData.authorName,
            previousStatus: replyData.status,
            newStatus: newStatus,
            performedBy: auth.currentUser.uid,
            performedByEmail: adminInfo.email || auth.currentUser.email || "no-email",
            createdAt: serverTimestamp(),
            note: note || "Moderación administrativa"
        });
        
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error al moderar respuesta:", error);
        throw error;
    }
}

// --- EXPORTACIÓN ADMINISTRATIVA (Fase 1.9F) ---

/**
 * Recupera datos de foros según filtros para exportación.
 */
export async function getForumExportData(filters) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    let forumsToFetch = [];
    if (filters.foro === 'todos') {
        forumsToFetch = ['general', 'modulo1', 'modulo2', 'modulo3'];
    } else {
        forumsToFetch = [filters.foro];
    }
    
    let allData = [];
    
    for (const foroId of forumsToFetch) {
        let postsRef = collection(db, "foros", foroId, "publicaciones");
        let q;
        
        if (filters.estado !== 'todos') {
            q = query(postsRef, where("status", "==", filters.estado), orderBy("createdAt", "desc"));
        } else {
            q = query(postsRef, orderBy("createdAt", "desc"));
        }
        
        const snapshot = await getDocs(q);
        
        for (const docSnap of snapshot.docs) {
            const postData = docSnap.data();
            
            // Filtro por fecha (se aplica en cliente para evitar índices complejos)
            const postDate = postData.createdAt ? postData.createdAt.toDate() : new Date();
            let includePost = true;
            
            if (filters.dateFrom) {
                const [y, m, d] = filters.dateFrom.split('-');
                const fromDate = new Date(y, parseInt(m) - 1, d, 0, 0, 0);
                if (postDate < fromDate) includePost = false;
            }
            if (filters.dateTo) {
                const [y, m, d] = filters.dateTo.split('-');
                const toDate = new Date(y, parseInt(m) - 1, d, 23, 59, 59, 999);
                if (postDate > toDate) includePost = false;
            }
            
            if (includePost && (filters.tipo === 'ambos' || filters.tipo === 'publicaciones')) {
                allData.push({
                    type: 'publicacion',
                    foroId: foroId,
                    postId: docSnap.id,
                    ...postData,
                    postDate: postDate
                });
            }
            
            // Si también queremos respuestas
            if (filters.tipo === 'ambos' || filters.tipo === 'respuestas') {
                const repliesRef = collection(db, "foros", foroId, "publicaciones", docSnap.id, "respuestas");
                let repliesQ;
                if (filters.estado !== 'todos') {
                    repliesQ = query(repliesRef, where("status", "==", filters.estado), orderBy("createdAt", "asc"));
                } else {
                    repliesQ = query(repliesRef, orderBy("createdAt", "asc"));
                }
                const repliesSnap = await getDocs(repliesQ);
                
                repliesSnap.forEach(rDoc => {
                    const rData = rDoc.data();
                    const rDate = rData.createdAt ? rData.createdAt.toDate() : new Date();
                    let includeReply = true;
                    
                    if (filters.dateFrom) {
                        const [y, m, d] = filters.dateFrom.split('-');
                        const fromDate = new Date(y, parseInt(m) - 1, d, 0, 0, 0);
                        if (rDate < fromDate) includeReply = false;
                    }
                    if (filters.dateTo) {
                        const [y, m, d] = filters.dateTo.split('-');
                        const toDate = new Date(y, parseInt(m) - 1, d, 23, 59, 59, 999);
                        if (rDate > toDate) includeReply = false;
                    }
                    
                    if (includeReply) {
                        allData.push({
                            type: 'respuesta',
                            foroId: foroId,
                            postId: docSnap.id,
                            replyId: rDoc.id,
                            ...rData,
                            postDate: rDate
                        });
                    }
                });
            }
        }
    }
    
    // Ordenar por fecha descendente
    allData.sort((a, b) => b.postDate - a.postDate);
    return allData;
}

/**
 * Prepara las filas para exportación CSV.
 */
export function buildForumExportRows(data, isAnonymous) {
    let rows = [];
    
    if (isAnonymous) {
        rows = anonymizeForumData(data);
    } else {
        data.forEach(item => {
            rows.push({
                foroId: item.foroId || "",
                modulo: getModuleName(item.foroId),
                tipo_intervencion: item.type === "publicacion" ? "Publicación Inicial" : "Respuesta",
                postId: item.postId || "",
                replyId: item.replyId || "",
                autor_uid: item.uid || "",
                autor_nombre: item.authorName || "",
                autor_contexto: item.authorContext || "",
                contenido: item.content || "",
                estado: item.status || "",
                fecha_creacion: item.createdAt ? item.createdAt.toDate().toISOString() : "",
                fecha_edicion: item.updatedAt ? item.updatedAt.toDate().toISOString() : "",
                moderatedBy: item.moderatedBy || "",
                moderatedAt: item.moderatedAt ? item.moderatedAt.toDate().toISOString() : ""
            });
        });
    }
    return rows;
}

function getModuleName(foroId) {
    if (foroId === 'general') return 'General';
    if (foroId === 'modulo1') return 'Módulo 1';
    if (foroId === 'modulo2') return 'Módulo 2';
    if (foroId === 'modulo3') return 'Módulo 3';
    return foroId;
}

/**
 * Anonimiza los datos asignando códigos consecutivos por participante.
 */
export function anonymizeForumData(data) {
    const rows = [];
    const uidMap = new Map();
    let counter = 1;
    
    data.forEach(item => {
        if (!item.uid) return; // Si no hay uid, saltar
        
        let participantCode = uidMap.get(item.uid);
        if (!participantCode) {
            participantCode = "Participante-" + String(counter).padStart(3, '0');
            uidMap.set(item.uid, participantCode);
            counter++;
        }
        
        rows.push({
            codigo_participante: participantCode,
            foroId: item.foroId || "",
            modulo: getModuleName(item.foroId),
            tipo_intervencion: item.type === "publicacion" ? "Publicación Inicial" : "Respuesta",
            contenido: item.content || "",
            estado: item.status || "",
            fecha_creacion: item.createdAt ? item.createdAt.toDate().toISOString() : "",
            fecha_edicion: item.updatedAt ? item.updatedAt.toDate().toISOString() : ""
        });
    });
    
    return rows;
}

/**
 * Protege contra inyecciones CSV y genera el string.
 */
function escapeCSVValue(value) {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    
    // Protección contra CSV Injection (empezando con signos especiales)
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = "'" + str;
    }
    
    // Escapar comillas dobles y envolver en comillas
    str = str.replace(/"/g, '""');
    return `"${str}"`;
}

/**
 * Exporta a CSV y gatilla descarga.
 */
export function exportToCSV(rows, filename) {
    if (!rows || rows.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }
    
    const headers = Object.keys(rows[0]);
    let csvContent = headers.map(escapeCSVValue).join(",") + "\n";
    
    rows.forEach(row => {
        csvContent += headers.map(header => escapeCSVValue(row[header])).join(",") + "\n";
    });
    
    // Añadir BOM (Byte Order Mark) para compatibilidad con UTF-8 en Excel
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Registra la auditoría en adminLogs.
 */
export async function logForumExportAction(logData) {
    if (!auth.currentUser) throw new Error("No autenticado");
    
    try {
        const adminInfo = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
        const email = adminInfo.exists() ? adminInfo.data().email : auth.currentUser.email;
        
        await addDoc(collection(db, "adminLogs"), {
            action: "export_forum_data",
            exportType: logData.exportType,
            foroId: logData.foroId,
            statusFilter: logData.statusFilter,
            typeFilter: logData.typeFilter,
            dateFrom: logData.dateFrom || "all",
            dateTo: logData.dateTo || "all",
            performedBy: auth.currentUser.uid,
            performedByEmail: email || "no-email",
            createdAt: serverTimestamp(),
            note: logData.note || "Exportación de foros"
        });
        return true;
    } catch (error) {
        console.error("Error al registrar auditoría de exportación:", error);
        throw error;
    }
}
