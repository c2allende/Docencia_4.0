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
    increment
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
