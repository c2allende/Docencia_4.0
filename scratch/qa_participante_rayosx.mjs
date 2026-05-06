/**
 * QA RAYOS X — Participante
 * Prueba exhaustiva del flujo de participante contra Firebase REST API
 * node scratch/qa_participante_rayosx.mjs
 */

const API_KEY    = "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA";
const PROJECT_ID = "docencia-4-lms";
const FS         = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH       = `https://identitytoolkit.googleapis.com/v1/accounts`;

// ── Helpers ────────────────────────────────────────────────────────────────
let passed = 0, failed = 0, warned = 0;
const results = [];

function ok(id, label)   { console.log(`  ✅  [${id}] ${label}`); passed++; results.push({ id, status: "PASS", label }); }
function fail(id, label) { console.log(`  ❌  [${id}] ${label}`); failed++; results.push({ id, status: "FAIL", label }); }
function warn(id, label) { console.log(`  ⚠️   [${id}] ${label}`); warned++; results.push({ id, status: "WARN", label }); }
function info(msg)       { console.log(`  ℹ️   ${msg}`); }
function head(title)     { console.log(`\n${"─".repeat(60)}\n  ${title}\n${"─".repeat(60)}`); }

async function signIn(email, password) {
    const r = await fetch(`${AUTH}:signInWithPassword?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "signIn failed");
    return { token: d.idToken, uid: d.localId, email, refreshToken: d.refreshToken };
}

async function signUp(email, password) {
    const r = await fetch(`${AUTH}:signUp?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "signUp failed");
    return { token: d.idToken, uid: d.localId };
}

async function deleteAccount(token) {
    await fetch(`${AUTH}:delete?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token })
    });
}

async function fsGet(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return { status: r.status, data: await r.json() };
}

async function fsList(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status, data: await r.json() };
}

async function fsPatch(path, fields, token) {
    const r = await fetch(`${FS}/${path}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fields })
    });
    return { status: r.status, data: await r.json() };
}

async function fsDelete(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status };
}

async function fsAdd(path, fields, token) {
    const r = await fetch(`${FS}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fields })
    });
    return { status: r.status, data: await r.json() };
}

function fsStr(v)       { return { stringValue:  v }; }
function fsBool(v)      { return { booleanValue: v }; }
function fsInt(v)       { return { integerValue:  String(v) }; }
function fsTs()         { return { timestampValue: new Date().toISOString() }; }
function fsRef(v)       { return { referenceValue: `projects/${PROJECT_ID}/databases/(default)/documents/${v}` }; }

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║  QA RAYOS X — PARTICIPANTE — Docencia 4.0                ║");
    console.log("║  " + new Date().toLocaleString("es") + "                         ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    // ── SETUP: Verificar usuario de prueba ────────────────────────────────
    head("SETUP: Verificar usuario de prueba");

    let part; // participante
    try {
        part = await signIn("test2@gmail.com", "123456");
        ok("S01", `Participante login OK — UID: ${part.uid}`);
    } catch(e) {
        fail("S01", `Participante login FALLÓ: ${e.message}`);
        info("Sin participante de prueba, abortando QA.");
        process.exit(1);
    }

    let admin;
    try {
        admin = await signIn("carmelo.allende@gmail.com", "Lucas@10302");
        ok("S02", `Admin login OK — UID: ${admin.uid}`);
    } catch(e) { fail("S02", `Admin login: ${e.message}`); }

    // Verificar perfil del participante
    const profileRes = await fsGet(`usuarios/${part.uid}`, part.token);
    if (profileRes.status === 200) {
        const p = profileRes.data.fields;
        const role    = p?.role?.stringValue;
        const status  = p?.status?.stringValue;
        const rc      = p?.roleContext?.stringValue;
        const revoked = p?.accessRevoked?.booleanValue ?? false;
        const email   = p?.email?.stringValue;

        ok("S03", `Perfil Firestore existe — UID: ${part.uid}`);
        info(`  role: ${role} | status: ${status} | roleContext: ${rc} | accessRevoked: ${revoked} | email: ${email}`);

        role === "participant"          ? ok("S04", `role == "participant"`) : fail("S04", `role inesperado: "${role}"`);
        rc === "Participante"           ? ok("S05", `roleContext == "Participante"`) : fail("S05", `roleContext: "${rc}"`);
        status === "active"             ? ok("S06", `status == "active"`) : fail("S06", `status: "${status}"`);
        !revoked                        ? ok("S07", `accessRevoked no está en true`) : fail("S07", `accessRevoked == true — usuario bloqueado`);
        role !== "admin"                ? ok("S08", `No tiene permisos admin`) : fail("S08", `¡tiene role admin!`);
    } else {
        fail("S03", `Perfil NO encontrado — HTTP ${profileRes.status}. Creando perfil básico...`);
        // Crear perfil básico para continuar QA
        const create = await fsPatch(`usuarios/${part.uid}`, {
            uid: fsStr(part.uid), email: fsStr("test2@gmail.com"),
            displayName: fsStr("Test Participante"), role: fsStr("participant"),
            roleContext: fsStr("Participante"), status: fsStr("active"), emailVerified: fsBool(false)
        }, part.token);
        create.status === 200
            ? ok("S03b", "Perfil creado para continuar QA")
            : fail("S03b", `Error creando perfil: HTTP ${create.status}`);
    }

    // Verificar matrícula
    const enrollRes = await fsGet("configuracion/registro", admin.token);
    if (enrollRes.status === 200) {
        const d = enrollRes.data.fields;
        const enabled = d?.enrollmentEnabled?.booleanValue;
        const startTs = d?.enrollmentStartAt?.timestampValue;
        const endTs   = d?.enrollmentEndAt?.timestampValue;
        const now     = new Date();
        const start   = startTs ? new Date(startTs) : null;
        const end     = endTs   ? new Date(endTs)   : null;
        const isOpen  = enabled && start && end && now >= start && now <= end;
        ok("S09", `Configuración matrícula legible — isOpen: ${isOpen}`);
        info(`  enabled: ${enabled}, start: ${start?.toLocaleString("es")}, end: ${end?.toLocaleString("es")}`);
        if (!isOpen) warn("S09w", "Matrícula CERRADA — QA de registro nuevo no será posible");
    } else {
        fail("S09", `No se puede leer configuracion/registro — HTTP ${enrollRes.status}`);
    }

    // ── FASE 1: LOGIN Y AUTENTICACIÓN ─────────────────────────────────────
    head("FASE 1 — Login y Autenticación");

    // 1.1 Login con credenciales incorrectas
    try {
        await signIn("test2@gmail.com", "WRONG_PASSWORD");
        fail("F1-01", "Login con contraseña incorrecta NO fue rechazado — vulnerabilidad de seguridad");
    } catch(e) {
        ok("F1-01", `Login con contraseña incorrecta rechazado: "${e.message}"`);
    }

    // 1.2 Login con email inexistente
    try {
        await signIn("noexiste@noexiste.com", "password123");
        fail("F1-02", "Login con email inexistente NO fue rechazado");
    } catch(e) {
        ok("F1-02", `Email inexistente rechazado: "${e.message}"`);
    }

    // 1.3 Confirmación de token válido
    const meRes = await fetch(`${AUTH}:lookup?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: part.token })
    });
    const meData = await meRes.json();
    if (meRes.ok && meData.users?.[0]) {
        ok("F1-03", `Token activo — email: ${meData.users[0].email}, emailVerified: ${meData.users[0].emailVerified}`);
    } else {
        fail("F1-03", "Token no válido para el participante");
    }

    // ── FASE 2: LECTURA DE PERFIL Y DASHBOARD ────────────────────────────
    head("FASE 2 — Perfil y Dashboard");

    // 2.1 Participante lee su propio perfil
    const ownProfile = await fsGet(`usuarios/${part.uid}`, part.token);
    ownProfile.status === 200
        ? ok("F2-01", "Participante lee su propio perfil — HTTP 200")
        : fail("F2-01", `Perfil ilegible — HTTP ${ownProfile.status}: ${JSON.stringify(ownProfile.data?.error)}`);

    // 2.2 Participante NO puede leer perfil de otro usuario
    const otherProfile = await fsGet(`usuarios/${admin.uid}`, part.token);
    otherProfile.status === 403
        ? ok("F2-02", "Participante bloqueado al leer perfil de otro usuario — HTTP 403 ✓")
        : fail("F2-02", `Aislamiento ROTO — HTTP ${otherProfile.status} al leer perfil admin`);

    // 2.3 Participante NO puede listar colección usuarios
    const listUsers = await fsList("usuarios", part.token);
    listUsers.status === 403
        ? ok("F2-03", "Participante no puede listar colección usuarios — HTTP 403 ✓")
        : warn("F2-03", `Participante puede listar usuarios — HTTP ${listUsers.status}`);

    // 2.4 Leer configuracion/modulos (control de acceso a módulos)
    const modulesConfig = await fsGet("configuracion/modulos", part.token);
    if (modulesConfig.status === 200) {
        ok("F2-04", "Configuración de módulos legible para participante");
        const d = modulesConfig.data.fields;
        info(`  modulo1: ${d?.modulo1?.mapValue?.fields?.enabled?.booleanValue ?? "no definido"}`);
        info(`  modulo2: ${d?.modulo2?.mapValue?.fields?.enabled?.booleanValue ?? "no definido"}`);
        info(`  modulo3: ${d?.modulo3?.mapValue?.fields?.enabled?.booleanValue ?? "no definido"}`);
    } else if (modulesConfig.status === 404) {
        warn("F2-04", "configuracion/modulos no existe — módulos pueden estar sin configurar");
    } else {
        fail("F2-04", `configuracion/modulos ilegible — HTTP ${modulesConfig.status}`);
    }

    // ── FASE 3: PROGRESO ─────────────────────────────────────────────────
    head("FASE 3 — Progreso de Páginas y Módulos");

    // 3.1 Leer progresoPaginas
    const pgListRes = await fsList(`usuarios/${part.uid}/progresoPaginas`, part.token);
    if (pgListRes.status === 200) {
        const count = pgListRes.data.documents?.length ?? 0;
        ok("F3-01", `Participante lee progresoPaginas — ${count} documentos`);
    } else {
        fail("F3-01", `progresoPaginas ilegible — HTTP ${pgListRes.status}`);
    }

    // 3.2 Leer progresoModulos
    const modListRes = await fsList(`usuarios/${part.uid}/progresoModulos`, part.token);
    if (modListRes.status === 200) {
        const mods = modListRes.data.documents ?? [];
        ok("F3-02", `Participante lee progresoModulos — ${mods.length} documentos`);
        mods.forEach(m => {
            const mId     = m.name.split("/").pop();
            const fields  = m.fields;
            const pct     = fields?.percentComplete?.integerValue ?? fields?.percentComplete?.doubleValue ?? "?";
            const status  = fields?.status?.stringValue ?? "?";
            info(`  ${mId}: ${pct}% — ${status}`);
        });
    } else {
        fail("F3-02", `progresoModulos ilegible — HTTP ${modListRes.status}`);
    }

    // 3.3 Crear registro progresoPaginas (simula abrir una lección)
    const testPageId = `test-leccion1_1-qa-${Date.now()}`;
    const pgCreate = await fsPatch(
        `usuarios/${part.uid}/progresoPaginas/${testPageId}`,
        {
            uid: fsStr(part.uid), pageId: fsStr(testPageId),
            moduleId: fsStr("modulo1"), pageType: fsStr("lesson"),
            title: fsStr("Lección 1.1 QA Test"), url: fsStr("leccion1_1.html"),
            status: fsStr("started"), visitCount: fsInt(1),
            firstOpenedAt: fsTs(), lastOpenedAt: fsTs(), updatedAt: fsTs()
        },
        part.token
    );
    pgCreate.status === 200
        ? ok("F3-03", `Crear progresoPaginas (status:started) — HTTP 200`)
        : fail("F3-03", `No se puede crear progresoPaginas — HTTP ${pgCreate.status}: ${JSON.stringify(pgCreate.data?.error)}`);

    // 3.4 Actualizar a completado
    if (pgCreate.status === 200) {
        const pgUpdate = await fsPatch(
            `usuarios/${part.uid}/progresoPaginas/${testPageId}`,
            {
                uid: fsStr(part.uid), pageId: fsStr(testPageId),
                moduleId: fsStr("modulo1"), pageType: fsStr("lesson"),
                title: fsStr("Lección 1.1 QA Test"), url: fsStr("leccion1_1.html"),
                status: fsStr("completed"), visitCount: fsInt(2),
                firstOpenedAt: fsTs(), lastOpenedAt: fsTs(),
                updatedAt: fsTs(), completedAt: fsTs()
            },
            part.token
        );
        pgUpdate.status === 200
            ? ok("F3-04", `Actualizar progresoPaginas a completed — HTTP 200`)
            : fail("F3-04", `No se puede actualizar progresoPaginas — HTTP ${pgUpdate.status}: ${JSON.stringify(pgUpdate.data?.error)}`);
    }

    // 3.5 Intentar cambiar moduleId en update (debe fallar)
    if (pgCreate.status === 200) {
        const illegalUpdate = await fsPatch(
            `usuarios/${part.uid}/progresoPaginas/${testPageId}`,
            {
                uid: fsStr(part.uid), pageId: fsStr(testPageId),
                moduleId: fsStr("modulo2"), // ← intento de cambiar moduleId
                pageType: fsStr("lesson"), title: fsStr("Hack"), url: fsStr("hack.html"),
                status: fsStr("completed"), visitCount: fsInt(1),
                firstOpenedAt: fsTs(), lastOpenedAt: fsTs(), updatedAt: fsTs()
            },
            part.token
        );
        illegalUpdate.status === 403
            ? ok("F3-05", `Cambiar moduleId en update BLOQUEADO — HTTP 403 ✓`)
            : warn("F3-05", `Cambiar moduleId en update devolvió HTTP ${illegalUpdate.status} (esperado 403)`);
    }

    // 3.6 Crear progresoModulos (simula progreso de módulo)
    const modCreate = await fsPatch(
        `usuarios/${part.uid}/progresoModulos/modulo1`,
        {
            uid: fsStr(part.uid), moduleId: fsStr("modulo1"),
            moduleTitle: fsStr("Módulo 1 QA"), completedPages: fsInt(1),
            totalPages: fsInt(8), percentComplete: fsInt(12),
            status: fsStr("in_progress"), updatedAt: fsTs(), startedAt: fsTs()
        },
        part.token
    );
    modCreate.status === 200
        ? ok("F3-06", `Crear/actualizar progresoModulos — HTTP 200`)
        : fail("F3-06", `No se puede crear progresoModulos — HTTP ${modCreate.status}: ${JSON.stringify(modCreate.data?.error)}`);

    // 3.7 Intentar cambiar role en perfil (debe fallar)
    const illegalRoleChange = await fsPatch(
        `usuarios/${part.uid}`,
        {
            uid: fsStr(part.uid), email: fsStr("test2@gmail.com"),
            displayName: fsStr("Hacker"), roleContext: fsStr("Admin"),
            role: fsStr("admin"), status: fsStr("active"), // ← intento de escalar privilegios
            emailVerified: fsBool(false), createdAt: fsTs(), updatedAt: fsTs()
        },
        part.token
    );
    illegalRoleChange.status === 403
        ? ok("F3-07", `Cambio de role a admin BLOQUEADO — HTTP 403 ✓`)
        : fail("F3-07", `Cambio de role NO fue bloqueado — HTTP ${illegalRoleChange.status} — VULNERABILIDAD`);

    // 3.8 Actualizar solo displayName en perfil (debe funcionar)
    // Primero leer valores actuales para no violar restricción de diff
    const currentProfile = (await fsGet(`usuarios/${part.uid}`, part.token)).data?.fields;
    const legalUpdate = await fsPatch(
        `usuarios/${part.uid}`,
        {
            uid:           currentProfile?.uid ?? fsStr(part.uid),
            email:         currentProfile?.email ?? fsStr("test2@gmail.com"),
            displayName:   fsStr("Test Participante QA"),
            roleContext:   currentProfile?.roleContext ?? fsStr("Participante"),
            role:          currentProfile?.role ?? fsStr("participant"),
            status:        currentProfile?.status ?? fsStr("active"),
            emailVerified: currentProfile?.emailVerified ?? fsBool(false),
            createdAt:     currentProfile?.createdAt ?? fsTs(),
            updatedAt:     fsTs()
        },
        part.token
    );
    legalUpdate.status === 200
        ? ok("F3-08", `Actualizar displayName permitido — HTTP 200`)
        : warn("F3-08", `Actualizar displayName devolvió HTTP ${legalUpdate.status}: ${JSON.stringify(legalUpdate.data?.error)}`);

    // ── FASE 4: ANUNCIOS ─────────────────────────────────────────────────
    head("FASE 4 — Anuncios");

    // 4.1 Leer colección de anuncios (acceso público autenticado)
    const anunciosRes = await fsList("anuncios", part.token);
    if (anunciosRes.status === 200) {
        const docs = anunciosRes.data.documents ?? [];
        ok("F4-01", `Anuncios legibles — ${docs.length} documentos totales`);
        let visibles = 0;
        docs.forEach(d => {
            const f = d.fields;
            if (f?.status?.stringValue === "published" && f?.isActive?.booleanValue) visibles++;
        });
        info(`  ${visibles} anuncios published+active (candidatos a mostrarse)`);
    } else {
        fail("F4-01", `Anuncios ilegibles — HTTP ${anunciosRes.status}`);
    }

    // 4.2 Participante NO puede crear anuncio
    const createAnuncio = await fsAdd(
        "anuncios",
        {
            title: fsStr("Hack Anuncio"), message: fsStr("Esto no debería poder crearse"),
            scope: fsStr("global"), priority: fsStr("normal"),
            status: fsStr("published"), isActive: fsBool(true),
            createdBy: fsStr(part.uid), createdAt: fsTs(), updatedAt: fsTs()
        },
        part.token
    );
    createAnuncio.status === 403
        ? ok("F4-02", `Crear anuncio BLOQUEADO para participante — HTTP 403 ✓`)
        : fail("F4-02", `Participante pudo crear anuncio — HTTP ${createAnuncio.status} — VULNERABILIDAD`);

    // 4.3 Participante puede leer anuncios individuales
    const firstAnuncio = anunciosRes.data?.documents?.[0];
    if (firstAnuncio) {
        const anuncioId = firstAnuncio.name.split("/").pop();
        const readAnuncio = await fsGet(`anuncios/${anuncioId}`, part.token);
        if (readAnuncio.status === 200) {
            const f = readAnuncio.data.fields;
            const isVisible = f?.status?.stringValue === "published" && f?.isActive?.booleanValue;
            ok("F4-03", `Leer anuncio individual — HTTP 200, isVisible: ${isVisible}`);
        } else if (readAnuncio.status === 403) {
            info("F4-03: anuncio no activo o no publicado — acceso denegado como esperado");
        }
    }

    // 4.4 Leer lectura de anuncio propio
    const anuncioLecturas = await fsList(`usuarios/${part.uid}/anuncioLecturas`, part.token);
    anuncioLecturas.status === 200
        ? ok("F4-04", `anuncioLecturas legibles — ${anuncioLecturas.data.documents?.length ?? 0} docs`)
        : fail("F4-04", `anuncioLecturas ilegibles — HTTP ${anuncioLecturas.status}`);

    // ── FASE 5: NOTIFICACIONES ────────────────────────────────────────────
    head("FASE 5 — Notificaciones");

    // 5.1 Leer notificaciones propias
    const notifRes = await fsList(`usuarios/${part.uid}/notificaciones`, part.token);
    if (notifRes.status === 200) {
        const notifs = notifRes.data.documents ?? [];
        ok("F5-01", `Notificaciones legibles — ${notifs.length} docs`);
        const unread = notifs.filter(n => n.fields?.status?.stringValue === "unread").length;
        info(`  ${unread} no leídas`);
    } else {
        fail("F5-01", `Notificaciones ilegibles — HTTP ${notifRes.status}`);
    }

    // 5.2 Participante NO puede crear notificaciones genéricas (requiere condiciones específicas)
    const createNotif = await fsPatch(
        `usuarios/${part.uid}/notificaciones/hack_test_123`,
        {
            type: fsStr("system_alert"), title: fsStr("Hack"),
            message: fsStr("Test"), status: fsStr("unread"),
            priority: fsStr("normal"), sourceType: fsStr("system"),
            createdAt: fsTs()
        },
        part.token
    );
    createNotif.status === 403
        ? ok("F5-02", `Crear notificación arbitraria BLOQUEADA — HTTP 403 ✓`)
        : warn("F5-02", `Participante pudo crear notificación con ID arbitrario — HTTP ${createNotif.status}`);

    // ── FASE 6: FOROS ─────────────────────────────────────────────────────
    head("FASE 6 — Foros");

    const foros = ["general", "modulo1", "modulo2", "modulo3"];
    let validForoId = null;
    let validPostId = null;

    for (const foroId of foros) {
        // 6.1 Verificar que el foro existe y está activo
        const foroRes = await fsGet(`foros/${foroId}`, part.token);
        if (foroRes.status === 200) {
            const isActive = foroRes.data.fields?.isActive?.booleanValue;
            ok(`F6-${foroId}-01`, `Foro "${foroId}" legible — isActive: ${isActive}`);
            if (isActive && !validForoId) validForoId = foroId;
        } else {
            warn(`F6-${foroId}-01`, `Foro "${foroId}" — HTTP ${foroRes.status}`);
        }

        // 6.2 Leer publicaciones del foro
        const postsRes = await fsList(`foros/${foroId}/publicaciones`, part.token);
        if (postsRes.status === 200) {
            const posts = postsRes.data.documents ?? [];
            const activePosts = posts.filter(p => p.fields?.status?.stringValue === "active");
            ok(`F6-${foroId}-02`, `Publicaciones "${foroId}" — ${posts.length} total, ${activePosts.length} activas`);
            if (activePosts.length > 0 && !validPostId) {
                validPostId = activePosts[0].name.split("/").pop();
                info(`  Primer postId activo: ${validPostId} (foro: ${foroId})`);
            }
        } else {
            warn(`F6-${foroId}-02`, `Publicaciones "${foroId}" — HTTP ${postsRes.status}`);
        }
    }

    // 6.3 Crear publicación en foro activo
    if (validForoId) {
        const createPost = await fsAdd(
            `foros/${validForoId}/publicaciones`,
            {
                foroId: fsStr(validForoId), uid: fsStr(part.uid),
                authorName: fsStr("Test Participante QA"),
                authorContext: fsStr("Participante"),
                content: fsStr("Publicación de prueba QA - puede ignorarse"),
                status: fsStr("active"), replyCount: fsInt(0),
                createdAt: fsTs(), updatedAt: fsTs()
            },
            part.token
        );
        if (createPost.status === 200) {
            const newPostId = createPost.data.name?.split("/").pop();
            ok("F6-post-01", `Crear publicación en foro "${validForoId}" — HTTP 200, postId: ${newPostId}`);
            validPostId = validPostId || newPostId;

            // 6.4 Leer la publicación recién creada
            const readNewPost = await fsGet(`foros/${validForoId}/publicaciones/${newPostId}`, part.token);
            readNewPost.status === 200
                ? ok("F6-post-02", `Leer publicación recién creada — HTTP 200`)
                : fail("F6-post-02", `No se puede leer post propio — HTTP ${readNewPost.status}`);

            // Limpiar post de prueba (como admin)
            if (admin) {
                // Primero archivar, luego delete (según reglas)
                await fsPatch(`foros/${validForoId}/publicaciones/${newPostId}`, {
                    foroId: fsStr(validForoId), uid: fsStr(part.uid),
                    authorName: fsStr("Test"), authorContext: fsStr("Participante"),
                    content: fsStr("QA test"), status: fsStr("archived"),
                    replyCount: fsInt(0), createdAt: fsTs(), updatedAt: fsTs(),
                    moderatedAt: fsTs(), moderatedBy: fsStr(admin.uid)
                }, admin.token);
                const delPost = await fsDelete(`foros/${validForoId}/publicaciones/${newPostId}`, admin.token);
                info(`  Post de prueba limpiado — HTTP ${delPost.status}`);
            }
        } else {
            fail("F6-post-01", `Crear publicación FALLÓ — HTTP ${createPost.status}: ${JSON.stringify(createPost.data?.error)}`);
        }
    } else {
        warn("F6-post-01", "No hay foro activo para probar creación de publicaciones");
    }

    // 6.5 Participante NO puede moderar (archivar post de otro)
    if (validForoId && validPostId) {
        const moderateAttempt = await fsPatch(
            `foros/${validForoId}/publicaciones/${validPostId}`,
            {
                foroId: fsStr(validForoId), uid: fsStr("otro-usuario"),
                authorName: fsStr("Otro"), authorContext: fsStr("Participante"),
                content: fsStr("modificado"), status: fsStr("archived"),
                replyCount: fsInt(0), createdAt: fsTs(), updatedAt: fsTs(),
                moderatedAt: fsTs(), moderatedBy: fsStr(part.uid)
            },
            part.token
        );
        moderateAttempt.status === 403
            ? ok("F6-sec-01", `Moderación por participante BLOQUEADA — HTTP 403 ✓`)
            : warn("F6-sec-01", `Participante pudo moderar post — HTTP ${moderateAttempt.status}`);
    }

    // 6.6 Responder a publicación existente
    if (validForoId && validPostId) {
        const createReply = await fsAdd(
            `foros/${validForoId}/publicaciones/${validPostId}/respuestas`,
            {
                foroId: fsStr(validForoId), postId: fsStr(validPostId),
                uid: fsStr(part.uid), authorName: fsStr("Test Participante QA"),
                authorContext: fsStr("Participante"),
                content: fsStr("Respuesta de prueba QA — puede ignorarse"),
                status: fsStr("active"), createdAt: fsTs(), updatedAt: fsTs()
            },
            part.token
        );
        if (createReply.status === 200) {
            const replyId = createReply.data.name?.split("/").pop();
            ok("F6-reply-01", `Crear respuesta en foro "${validForoId}" — HTTP 200, replyId: ${replyId}`);
            // Limpiar respuesta
            if (admin) {
                await fsPatch(
                    `foros/${validForoId}/publicaciones/${validPostId}/respuestas/${replyId}`,
                    {
                        foroId: fsStr(validForoId), postId: fsStr(validPostId),
                        uid: fsStr(part.uid), authorName: fsStr("Test"),
                        authorContext: fsStr("Participante"), content: fsStr("QA"),
                        status: fsStr("archived"), createdAt: fsTs(), updatedAt: fsTs(),
                        moderatedAt: fsTs(), moderatedBy: fsStr(admin.uid)
                    },
                    admin.token
                );
                const delReply = await fsDelete(
                    `foros/${validForoId}/publicaciones/${validPostId}/respuestas/${replyId}`,
                    admin.token
                );
                info(`  Respuesta de prueba limpiada — HTTP ${delReply.status}`);
            }
        } else {
            fail("F6-reply-01", `Crear respuesta FALLÓ — HTTP ${createReply.status}: ${JSON.stringify(createReply.data?.error)}`);
        }
    }

    // ── FASE 7: TABLERO INTERACTIVO (Sessions) ────────────────────────────
    head("FASE 7 — Tablero Interactivo (Actividad 1.1)");

    // 7.1 Leer sesiones activas
    const sessionsRes = await fsList("sessions", part.token);
    if (sessionsRes.status === 200) {
        const sessions = sessionsRes.data.documents ?? [];
        ok("F7-01", `Colección sessions legible — ${sessions.length} sesiones`);
        if (sessions.length > 0) {
            const sid = sessions[0].name.split("/").pop();
            const sessionFields = sessions[0].fields;
            info(`  Primera sesión: ${sid} — title: ${sessionFields?.title?.stringValue ?? "sin título"}`);

            // 7.2 Leer respuestas de la primera sesión
            const responsesRes = await fsList(`sessions/${sid}/responses`, part.token);
            responsesRes.status === 200
                ? ok("F7-02", `Respuestas de sesión legibles — ${responsesRes.data.documents?.length ?? 0} docs`)
                : fail("F7-02", `Respuestas ilegibles — HTTP ${responsesRes.status}`);

            // 7.3 Crear respuesta en tablero
            const createResponse = await fsAdd(
                `sessions/${sid}/responses`,
                {
                    text: fsStr("Respuesta QA de prueba"), uid: fsStr(part.uid),
                    displayName: fsStr("Test QA"), timestamp: fsTs(),
                    likes: fsInt(0), colorIndex: fsInt(0),
                    pageId: fsStr("actividad1_1"), moduleId: fsStr("modulo1"),
                    status: fsStr("active")
                },
                part.token
            );
            if (createResponse.status === 200) {
                ok("F7-03", `Crear respuesta en tablero — HTTP 200`);
                // Limpiar
                if (admin) {
                    const rId = createResponse.data.name?.split("/").pop();
                    await fsDelete(`sessions/${sid}/responses/${rId}`, admin.token);
                    info(`  Respuesta de prueba limpiada`);
                }
            } else {
                fail("F7-03", `Crear respuesta en tablero FALLÓ — HTTP ${createResponse.status}: ${JSON.stringify(createResponse.data?.error)}`);
            }
        } else {
            warn("F7-01b", "No hay sesiones activas — tablero interactivo vacío");
        }
    } else if (sessionsRes.status === 403) {
        fail("F7-01", `Sessions inaccesible para participante — HTTP 403`);
    } else {
        warn("F7-01", `Sessions — HTTP ${sessionsRes.status}`);
    }

    // ── FASE 8: SEGURIDAD — INTENTOS DE ESCALACIÓN ───────────────────────
    head("FASE 8 — Seguridad: Intentos de Escalación de Privilegios");

    // 8.1 Participante intenta leer adminLogs
    const adminLogsRead = await fsList("adminLogs", part.token);
    adminLogsRead.status === 403
        ? ok("F8-01", `adminLogs ilegible para participante — HTTP 403 ✓`)
        : fail("F8-01", `Participante puede leer adminLogs — HTTP ${adminLogsRead.status} — VULNERABILIDAD`);

    // 8.2 Participante intenta crear log en adminLogs
    const adminLogsWrite = await fsAdd("adminLogs", {
        action: fsStr("hack"), performedBy: fsStr(part.uid),
        performedByEmail: fsStr("test2@gmail.com"), createdAt: fsTs(), note: fsStr("hack")
    }, part.token);
    adminLogsWrite.status === 403
        ? ok("F8-02", `Crear adminLog BLOQUEADO — HTTP 403 ✓`)
        : fail("F8-02", `Participante pudo crear adminLog — HTTP ${adminLogsWrite.status} — VULNERABILIDAD`);

    // 8.3 Participante intenta crear anuncio con status "published"
    const createPubAnuncio = await fsAdd("anuncios", {
        title: fsStr("Hack"), message: fsStr("Hack"),
        scope: fsStr("global"), priority: fsStr("urgente"),
        status: fsStr("published"), isActive: fsBool(true),
        createdBy: fsStr(part.uid), createdAt: fsTs(), updatedAt: fsTs()
    }, part.token);
    createPubAnuncio.status === 403
        ? ok("F8-03", `Crear anuncio publicado BLOQUEADO — HTTP 403 ✓`)
        : fail("F8-03", `Participante pudo crear anuncio — HTTP ${createPubAnuncio.status} — VULNERABILIDAD`);

    // 8.4 Participante intenta borrar su propio progreso (debe fallar)
    const pgDeleteAttempt = await fsDelete(`usuarios/${part.uid}/progresoPaginas/leccion1_1`, part.token);
    pgDeleteAttempt.status === 403 || pgDeleteAttempt.status === 404
        ? ok("F8-04", `Borrar progresoPaginas BLOQUEADO para participante — HTTP ${pgDeleteAttempt.status} ✓`)
        : fail("F8-04", `Participante puede borrar progreso — HTTP ${pgDeleteAttempt.status}`);

    // 8.5 Participante intenta crear otro usuario en Firestore (con su uid como admin)
    const impersonateAdmin = await fsPatch(`usuarios/${admin.uid}`, {
        uid: fsStr(admin.uid), email: fsStr("carmelo.allende@gmail.com"),
        displayName: fsStr("Hack"), roleContext: fsStr("Admin"),
        role: fsStr("admin"), status: fsStr("inactive"),
        emailVerified: fsBool(false), createdAt: fsTs(), updatedAt: fsTs()
    }, part.token);
    impersonateAdmin.status === 403
        ? ok("F8-05", `Modificar perfil admin BLOQUEADO — HTTP 403 ✓`)
        : fail("F8-05", `Participante pudo modificar perfil admin — HTTP ${impersonateAdmin.status} — VULNERABILIDAD CRÍTICA`);

    // 8.6 Crear perfil con role:admin (debe fallar siempre)
    const tmpUser = await signUp(`hack-admin-${Date.now()}@qa.invalid`, "QaHack@123456");
    const hackAdmin = await fsPatch(`usuarios/${tmpUser.uid}`, {
        uid: fsStr(tmpUser.uid), email: fsStr("hack@qa.invalid"),
        displayName: fsStr("Hacker"), roleContext: fsStr("Participante"),
        role: fsStr("admin"), status: fsStr("active"), emailVerified: fsBool(false)
    }, tmpUser.token);
    hackAdmin.status === 403
        ? ok("F8-06", `Crear perfil con role:admin BLOQUEADO — HTTP 403 ✓`)
        : fail("F8-06", `Se creó perfil con role:admin — HTTP ${hackAdmin.status} — VULNERABILIDAD CRÍTICA`);
    await deleteAccount(tmpUser.token);

    // ── FASE 9: MATRÍCULA CERRADA — USUARIO EXISTENTE ────────────────────
    head("FASE 9 — Matrícula Cerrada: Usuario Existente Conserva Acceso");

    // Cerrar matrícula temporalmente
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const originalEndAt = enrollRes.data?.fields?.enrollmentEndAt?.timestampValue;

    const closeEnroll = await fsPatch(
        "configuracion/registro",
        { enrollmentEndAt: { timestampValue: yesterday } },
        admin.token,
        ["enrollmentEndAt"]
    );

    if (closeEnroll.status === 200) {
        info("Matrícula cerrada temporalmente para prueba");

        // 9.1 Participante existente activo SÍ puede leer su perfil
        const profileClosed = await fsGet(`usuarios/${part.uid}`, part.token);
        profileClosed.status === 200
            ? ok("F9-01", `[Matrícula CERRADA] Participante activo lee su perfil — HTTP 200 ✓`)
            : fail("F9-01", `Perfil BLOQUEADO con matrícula cerrada — HTTP ${profileClosed.status}`);

        // 9.2 Participante existente SÍ puede leer progreso
        const pgClosed = await fsList(`usuarios/${part.uid}/progresoPaginas`, part.token);
        pgClosed.status === 200
            ? ok("F9-02", `[Matrícula CERRADA] progresoPaginas accesible — HTTP 200 ✓`)
            : fail("F9-02", `progresoPaginas BLOQUEADO con matrícula cerrada — HTTP ${pgClosed.status}`);

        const modClosed = await fsList(`usuarios/${part.uid}/progresoModulos`, part.token);
        modClosed.status === 200
            ? ok("F9-03", `[Matrícula CERRADA] progresoModulos accesible — HTTP 200 ✓`)
            : fail("F9-03", `progresoModulos BLOQUEADO con matrícula cerrada — HTTP ${modClosed.status}`);

        // 9.3 Nuevo registro BLOQUEADO con matrícula cerrada
        const newUserClosed = await signUp(`qa-closed-${Date.now()}@qa.invalid`, "QaTest@123456");
        const profileClosed2 = await fsPatch(`usuarios/${newUserClosed.uid}`, {
            uid: fsStr(newUserClosed.uid), email: fsStr("qa@qa.invalid"),
            displayName: fsStr("QA"), role: fsStr("participant"),
            roleContext: fsStr("Participante"), status: fsStr("active"), emailVerified: fsBool(false)
        }, newUserClosed.token);
        profileClosed2.status === 403
            ? ok("F9-04", `[Matrícula CERRADA] Nuevo registro BLOQUEADO — HTTP 403 ✓`)
            : fail("F9-04", `[Matrícula CERRADA] Nuevo perfil creado cuando NO debería — HTTP ${profileClosed2.status}`);
        await deleteAccount(newUserClosed.token);

        // Restaurar matrícula
        const restoreEndAt = originalEndAt ?? new Date(Date.now() + 86400000).toISOString();
        const restore = await fsPatch(
            "configuracion/registro",
            { enrollmentEndAt: { timestampValue: restoreEndAt } },
            admin.token, ["enrollmentEndAt"]
        );
        restore.status === 200
            ? info("Matrícula restaurada")
            : fail("F9-RESTORE", `⚠️ No se pudo restaurar matrícula — verificar manualmente`);
    } else {
        warn("F9-01", `No se pudo cerrar matrícula para prueba — HTTP ${closeEnroll.status}`);
    }

    // ── FASE 10: ACCESO A CONFIGURACION ──────────────────────────────────
    head("FASE 10 — Configuración de Plataforma");

    // 10.1 Participante puede leer configuracion/registro (para banner de matrícula)
    const cfgRegRead = await fsGet("configuracion/registro", part.token);
    cfgRegRead.status === 200
        ? ok("F10-01", `configuracion/registro legible para participante — HTTP 200 ✓`)
        : fail("F10-01", `configuracion/registro ilegible — HTTP ${cfgRegRead.status}`);

    // 10.2 Participante NO puede crear/editar configuracion/registro
    const cfgEdit = await fsPatch("configuracion/registro", {
        enrollmentEnabled: fsBool(false) // intento de deshabilitar matrícula
    }, part.token, ["enrollmentEnabled"]);
    cfgEdit.status === 403
        ? ok("F10-02", `Editar configuracion BLOQUEADO para participante — HTTP 403 ✓`)
        : fail("F10-02", `Participante pudo editar configuracion — HTTP ${cfgEdit.status} — VULNERABILIDAD`);

    // ── LIMPIEZA FINAL ────────────────────────────────────────────────────
    head("Limpieza");

    // Limpiar progreso de prueba creado
    if (pgCreate.status === 200) {
        const cleanPg = await fsDelete(`usuarios/${part.uid}/progresoPaginas/${testPageId}`, admin.token);
        info(`Limpieza progresoPaginas QA — HTTP ${cleanPg.status}`);
    }

    // ── RESUMEN FINAL ─────────────────────────────────────────────────────
    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log(`║  RESULTADO QA PARTICIPANTE                               ║`);
    console.log(`║  ✅ Pasadas: ${String(passed).padEnd(4)} ❌ Fallidas: ${String(failed).padEnd(4)} ⚠️  Avisos: ${String(warned).padEnd(4)}  ║`);
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    console.log("DETALLE DE FALLOS:");
    results.filter(r => r.status === "FAIL").forEach(r => console.log(`  ❌  [${r.id}] ${r.label}`));
    console.log("\nDETALLE DE AVISOS:");
    results.filter(r => r.status === "WARN").forEach(r => console.log(`  ⚠️   [${r.id}] ${r.label}`));
}

main().catch(e => {
    console.error("\n⛔ ERROR FATAL:", e.message);
    process.exit(1);
});
