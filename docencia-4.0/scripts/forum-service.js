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
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
