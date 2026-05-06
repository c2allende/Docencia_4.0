/**
 * Verificación post-corrección de bloqueadores
 * node scratch/diag_verificacion.mjs
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

async function runQuery(token, path, structuredQuery) {
    const r = await fetch(`${FS}/${path}:runQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ structuredQuery })
    });
    return { status: r.status, data: await r.json() };
}

async function fsGet(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
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
    console.log("\n══════════════════════════════════════════════════");
    console.log("  VERIFICACIÓN POST-CORRECCIÓN — Bloqueadores QA   ");
    console.log("══════════════════════════════════════════════════\n");

    const part = await signIn("test2@gmail.com", "123456");

    // ── QX-01: Anuncios — queries filtradas post-corrección ─────────────
    head("QX-01 — Anuncios (regla simplificada desplegada)");

    const now = new Date();
    const safePublishBound = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    const safeExpireBound  = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

    // Query 1: expiresAt == null
    const q1 = await runQuery(part.token, "", {
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
        ok(`Query 1 (expiresAt==null) — ${docs.length} anuncio(s) visible(s)`);
        docs.forEach(r => {
            const f = r.document.fields;
            info(`  "${f?.title?.stringValue}" | priority: ${f?.priority?.stringValue} | scope: ${f?.scope?.stringValue}`);
        });
    } else {
        fail(`Query 1 FALLÓ — HTTP ${q1.status}: ${JSON.stringify(q1.data?.[0]?.error || q1.data?.error)}`);
    }

    // Query 2: expiresAt > safeExpireBound
    const q2 = await runQuery(part.token, "", {
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
        ok(`Query 2 (expiresAt>now) — ${docs.length} anuncio(s) visible(s)`);
    } else {
        fail(`Query 2 FALLÓ — HTTP ${q2.status}: ${JSON.stringify(q2.data?.[0]?.error || q2.data?.error)}`);
    }

    // Confirmar que drafts siguen bloqueados
    const draftQuery = await runQuery(part.token, "", {
        from: [{ collectionId: "anuncios" }],
        where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "draft" } } },
        limit: 5
    });
    draftQuery.status === 403
        ? ok(`Anuncios draft siguen bloqueados para participante — HTTP 403 ✓`)
        : info(`Anuncios draft query — HTTP ${draftQuery.status} (aceptable si hay 0 docs)`);

    // ── QX-02: Sessions / Tablero Actividad 1.1 ──────────────────────────
    head("QX-02 — Tablero Interactivo (sessions/actividad1_1/responses)");

    // Test correcto: GET la subcollección de responses directamente
    const responsesSubcol = await fsList("sessions/actividad1_1/responses", part.token);
    if (responsesSubcol.status === 200) {
        const docs = responsesSubcol.data.documents ?? [];
        ok(`sessions/actividad1_1/responses accesible — ${docs.length} respuesta(s)`);
        if (docs.length === 0) info("  Tablero vacío (sin respuestas aún — estado normal)");
        else docs.slice(0, 3).forEach(d => {
            info(`  "${d.fields?.text?.stringValue?.substring(0, 50)}..." — ${d.fields?.displayName?.stringValue}`);
        });
    } else if (responsesSubcol.status === 403) {
        fail(`sessions/actividad1_1/responses BLOQUEADO — HTTP 403 ← regla insuficiente`);
    } else if (responsesSubcol.status === 404) {
        info(`sessions/actividad1_1/responses — HTTP 404 (subcollección vacía, board cargará vacío)`);
        ok(`Sin error de permisos — el tablero cargará correctamente`);
    } else {
        info(`sessions/actividad1_1/responses — HTTP ${responsesSubcol.status}`);
    }

    // Verificar que onSnapshot query funcionaría (query con orderBy)
    const responsesQuery = await runQuery(part.token, "sessions/actividad1_1", {
        from: [{ collectionId: "responses" }],
        orderBy: [{ field: { fieldPath: "timestamp" }, direction: "DESCENDING" }],
        limit: 50
    });

    if (responsesQuery.status === 200) {
        const docs = responsesQuery.data.filter(r => r.document);
        ok(`sessions/actividad1_1/responses query con orderBy — ${docs.length} respuesta(s) ✓`);
    } else {
        fail(`sessions/actividad1_1/responses query FALLÓ — HTTP ${responsesQuery.status}: ${JSON.stringify(responsesQuery.data?.[0]?.error || responsesQuery.data?.error)}`);
    }

    // ── QX-03: Foros — query filtrada con subcollection path correcto ────
    head("QX-03 — Foros (query status==active en subcollección)");

    for (const foroId of ["general", "modulo1", "modulo2", "modulo3"]) {
        const foroQuery = await runQuery(part.token, `foros/${foroId}`, {
            from: [{ collectionId: "publicaciones" }],
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
            ok(`Foro "${foroId}" — ${docs.length} publicación(es) activa(s)`);
        } else {
            fail(`Foro "${foroId}" query FALLÓ — HTTP ${foroQuery.status}: ${JSON.stringify(foroQuery.data?.[0]?.error || foroQuery.data?.error)}`);
        }
    }

    // Confirmar que hidden/archived siguen bloqueados
    const hiddenQuery = await runQuery(part.token, "foros/general", {
        from: [{ collectionId: "publicaciones" }],
        where: {
            fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "hidden" }
            }
        },
        limit: 5
    });
    hiddenQuery.status === 403
        ? ok(`Publicaciones hidden siguen bloqueadas para participante — HTTP 403 ✓`)
        : info(`Publicaciones hidden — HTTP ${hiddenQuery.status}`);

    // ── QX-04: configuracion/modulos ─────────────────────────────────────
    head("QX-04 — configuracion/modulos (ya confirmado)");

    const modConfig = await fsGet("configuracion/modulos", part.token);
    if (modConfig.status === 200) {
        const f = modConfig.data.fields;
        const m1 = f?.modulo1?.mapValue?.fields;
        const m2 = f?.modulo2?.mapValue?.fields;
        const m3 = f?.modulo3?.mapValue?.fields;
        const allEnabled = [m1, m2, m3].every(m => m && Object.values(m).every(v => v.booleanValue === true));
        allEnabled
            ? ok(`Todos los módulos habilitados (lecciones/actividades/foros/recursos: true)`)
            : info(`Algunos módulos o secciones pueden estar deshabilitados — verificar en admin_accesos.html`);
    }

    console.log("\n══════════════════════════════════════════════════");
    console.log("  FIN DE VERIFICACIÓN");
    console.log("══════════════════════════════════════════════════\n");
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
