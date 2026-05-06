/**
 * Diagnóstico dirigido de bloqueadores QA participante
 * node scratch/diag_bloqueadores.mjs
 */
const API_KEY    = "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA";
const PROJECT_ID = "docencia-4-lms";
const FS         = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH       = `https://identitytoolkit.googleapis.com/v1/accounts`;

async function signIn(email, password) {
    const r = await fetch(`${AUTH}:signInWithPassword?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message);
    return { token: d.idToken, uid: d.localId };
}

async function fsGet(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status, data: await r.json() };
}

async function runQuery(token, structuredQuery) {
    const r = await fetch(`${FS}:runQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ structuredQuery })
    });
    return { status: r.status, data: await r.json() };
}

async function fsList(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status, data: await r.json() };
}

const ok   = (m) => console.log(`  ✅  ${m}`);
const fail = (m) => console.log(`  ❌  ${m}`);
const info = (m) => console.log(`  ℹ️   ${m}`);
const head = (m) => console.log(`\n── ${m} ──`);

async function main() {
    console.log("\n══════════════════════════════════════════════");
    console.log("  DIAGNÓSTICO DIRIGIDO — Bloqueadores Participante");
    console.log("══════════════════════════════════════════════\n");

    const part  = await signIn("test2@gmail.com", "123456");
    const admin = await signIn("carmelo.allende@gmail.com", "Lucas@10302");
    info(`Participante UID: ${part.uid}`);
    info(`Admin UID: ${admin.uid}`);

    // ── QX-01: Anuncios — query filtrada (simula SDK) ─────────────────────
    head("QX-01 — Anuncios con query filtrada (simula announcement-service.js)");

    const now = new Date();
    const safePublishBound = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const safeExpireBound  = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

    // Query 1: publicados, activos, publishAt <= now-5min, expiresAt == null
    const q1 = await runQuery(part.token, {
        from: [{ collectionId: "anuncios" }],
        where: {
            compositeFilter: {
                op: "AND",
                filters: [
                    { fieldFilter: { field: { fieldPath: "status" },   op: "EQUAL",              value: { stringValue: "published" } } },
                    { fieldFilter: { field: { fieldPath: "isActive" },  op: "EQUAL",              value: { booleanValue: true } } },
                    { fieldFilter: { field: { fieldPath: "publishAt" }, op: "LESS_THAN_OR_EQUAL", value: { timestampValue: safePublishBound } } },
                    { fieldFilter: { field: { fieldPath: "expiresAt" }, op: "EQUAL",              value: { nullValue: "NULL_VALUE" } } }
                ]
            }
        },
        limit: 50
    });

    if (q1.status === 200) {
        const docs = q1.data.filter(r => r.document);
        ok(`Query 1 anuncios (expiresAt==null) — ${docs.length} documentos`);
        docs.forEach(r => {
            const f = r.document.fields;
            info(`  [${r.document.name.split("/").pop()}] "${f?.title?.stringValue}" | priority: ${f?.priority?.stringValue}`);
        });
    } else {
        fail(`Query 1 anuncios FALLÓ — HTTP ${q1.status}: ${JSON.stringify(q1.data?.[0]?.error || q1.data?.error)}`);
        info("  Si el error es 'index required', faltan composite indexes en Firebase");
    }

    // Query 2: publicados, activos, publishAt <= now-5min, expiresAt > now+5min
    const q2 = await runQuery(part.token, {
        from: [{ collectionId: "anuncios" }],
        where: {
            compositeFilter: {
                op: "AND",
                filters: [
                    { fieldFilter: { field: { fieldPath: "status" },    op: "EQUAL",              value: { stringValue: "published" } } },
                    { fieldFilter: { field: { fieldPath: "isActive" },   op: "EQUAL",              value: { booleanValue: true } } },
                    { fieldFilter: { field: { fieldPath: "publishAt" },  op: "LESS_THAN_OR_EQUAL", value: { timestampValue: safePublishBound } } },
                    { fieldFilter: { field: { fieldPath: "expiresAt" },  op: "GREATER_THAN",       value: { timestampValue: safeExpireBound } } }
                ]
            }
        },
        limit: 50
    });

    if (q2.status === 200) {
        const docs = q2.data.filter(r => r.document);
        ok(`Query 2 anuncios (expiresAt>now) — ${docs.length} documentos`);
    } else {
        fail(`Query 2 anuncios FALLÓ — HTTP ${q2.status}: ${JSON.stringify(q2.data?.[0]?.error || q2.data?.error)}`);
    }

    // ── QX-02: Sessions — verificar si el documento sessions/actividad1_1 existe ──
    head("QX-02 — Tablero Actividad 1.1 (sessions/actividad1_1)");

    const sessionDoc = await fsGet("sessions/actividad1_1", part.token);
    if (sessionDoc.status === 200) {
        ok(`sessions/actividad1_1 existe — ${JSON.stringify(sessionDoc.data.fields?.title?.stringValue ?? "sin campo title")}`);
    } else if (sessionDoc.status === 404) {
        fail(`sessions/actividad1_1 NO existe — HTTP 404`);
        info("  El tablero necesita que el admin cree el documento sessions/actividad1_1");
        info("  Sin este documento, la sesión del tablero no tiene contexto base");
    } else {
        info(`sessions/actividad1_1 — HTTP ${sessionDoc.status}`);
    }

    // Verificar acceso a responses subcollection directamente
    const responsesQuery = await runQuery(part.token, {
        from: [{ collectionId: "responses" }],
        parent: `projects/${PROJECT_ID}/databases/(default)/documents/sessions/actividad1_1`,
        orderBy: [{ field: { fieldPath: "timestamp" }, direction: "DESCENDING" }],
        limit: 10
    });

    if (responsesQuery.status === 200) {
        const docs = responsesQuery.data.filter(r => r.document);
        ok(`sessions/actividad1_1/responses accesible — ${docs.length} respuestas`);
        if (docs.length > 0) {
            const f = docs[0].document.fields;
            info(`  Primera respuesta: "${f?.text?.stringValue?.substring(0, 50)}..." — autor: ${f?.displayName?.stringValue}`);
        } else {
            info("  Tablero vacío (sin respuestas aún)");
        }
    } else {
        fail(`sessions/actividad1_1/responses INACCESIBLE — HTTP ${responsesQuery.status}: ${JSON.stringify(responsesQuery.data?.[0]?.error || responsesQuery.data?.error)}`);
    }

    // ── QX-03: Foros — query filtrada (simula forum-service.js) ──────────────
    head("QX-03 — Foros con query filtrada status==active (simula forum-service.js)");

    for (const foroId of ["general", "modulo1"]) {
        const foroQuery = await runQuery(part.token, {
            from: [{ collectionId: "publicaciones" }],
            parent: `projects/${PROJECT_ID}/databases/(default)/documents/foros/${foroId}`,
            where: {
                fieldFilter: {
                    field: { fieldPath: "status" },
                    op: "EQUAL",
                    value: { stringValue: "active" }
                }
            },
            orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
            limit: 50
        });

        if (foroQuery.status === 200) {
            const docs = foroQuery.data.filter(r => r.document);
            ok(`Foro "${foroId}" con filtro status==active — ${docs.length} publicaciones`);
        } else {
            fail(`Foro "${foroId}" query filtrada FALLÓ — HTTP ${foroQuery.status}: ${JSON.stringify(foroQuery.data?.[0]?.error || foroQuery.data?.error)}`);
        }
    }

    // ── QX-04: configuracion/modulos — estructura real ────────────────────
    head("QX-04 — Estructura real de configuracion/modulos");

    const modConfig = await fsGet("configuracion/modulos", part.token);
    if (modConfig.status === 200) {
        const f = modConfig.data.fields;
        ok(`configuracion/modulos existe`);
        info(`  Campos presentes: ${Object.keys(f).join(", ")}`);
        ["modulo1", "modulo2", "modulo3"].forEach(m => {
            const mData = f[m]?.mapValue?.fields;
            if (mData) {
                const sections = Object.entries(mData).map(([k, v]) => `${k}:${v.booleanValue}`).join(", ");
                info(`  ${m}: { ${sections} }`);
            } else {
                info(`  ${m}: NO definido (defaults a todo habilitado en el servicio)`);
            }
        });
    } else if (modConfig.status === 404) {
        info(`configuracion/modulos NO existe — module-access-service devuelve defaults (todo habilitado)`);
        ok(`No es un bloqueador — comportamiento seguro`);
    } else {
        fail(`configuracion/modulos — HTTP ${modConfig.status}`);
    }

    // ── QX-04b: Admin puede leer/escribir configuracion/modulos ──────────────
    const modConfigAdmin = await fsGet("configuracion/modulos", admin.token);
    modConfigAdmin.status === 200 || modConfigAdmin.status === 404
        ? ok(`Admin puede acceder a configuracion/modulos — HTTP ${modConfigAdmin.status}`)
        : fail(`Admin no puede acceder — HTTP ${modConfigAdmin.status}`);

    // ── Resumen ────────────────────────────────────────────────────────────
    console.log("\n══════════════════════════════════════════════");
    console.log("  FIN DEL DIAGNÓSTICO");
    console.log("══════════════════════════════════════════════\n");
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
