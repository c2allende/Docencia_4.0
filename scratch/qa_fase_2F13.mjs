/**
 * QA Script — Fase 2.0F-13 (corrección)
 * Usa Firebase Auth REST API + Firestore REST API.
 * Ejecutar: node scratch/qa_fase_2F13.mjs
 */

const API_KEY    = "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA";
const PROJECT_ID = "docencia-4-lms";
const FS         = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH       = `https://identitytoolkit.googleapis.com/v1/accounts`;

// ── Helpers ────────────────────────────────────────────────────────────────

let passed = 0, failed = 0;
function ok(label)   { console.log(`  ✅  ${label}`); passed++; }
function fail(label) { console.log(`  ❌  ${label}`); failed++; }
function info(label) { console.log(`  ℹ️   ${label}`); }
function head(label) { console.log(`\n── ${label} ──`); }

async function signIn(email, password) {
    const r = await fetch(`${AUTH}:signInWithPassword?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(`signIn failed (${email}): ${d.error?.message}`);
    return { token: d.idToken, uid: d.localId, email };
}

async function signUp(email, password) {
    const r = await fetch(`${AUTH}:signUp?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(`signUp failed: ${d.error?.message}`);
    return { token: d.idToken, uid: d.localId };
}

async function deleteAccount(token) {
    await fetch(`${AUTH}:delete?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token })
    });
}

async function fsGet(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return { status: r.status, data: await r.json() };
}

async function fsPatch(path, fields, token, fieldMask = null) {
    const url = fieldMask
        ? `${FS}/${path}?${fieldMask.map(f => `updateMask.fieldPaths=${f}`).join("&")}`
        : `${FS}/${path}`;
    const r = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fields })
    });
    return { status: r.status, data: await r.json() };
}


async function fsList(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status, data: await r.json() };
}

function fsStr(v)       { return { stringValue:  v }; }
function fsBool(v)      { return { booleanValue: v }; }
function fsTs(isoDate)  { return { timestampValue: isoDate }; }

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
    console.log("═══════════════════════════════════════════");
    console.log(" QA Fase 2.0F-13 — Control de Matrícula    ");
    console.log("═══════════════════════════════════════════");

    // ── 0. Login ──────────────────────────────────────────────────────────
    head("0. Login de cuentas existentes");
    let admin, participant;
    try {
        admin = await signIn("carmelo.allende@gmail.com", "Lucas@10302");
        ok(`Admin login OK (uid: ${admin.uid})`);
    } catch(e) { fail(`Admin login FALLÓ: ${e.message}`); process.exit(1); }

    try {
        participant = await signIn("test2@gmail.com", "123456");
        ok(`Participante login OK (uid: ${participant.uid})`);
    } catch(e) { fail(`Participante login FALLÓ: ${e.message}`); process.exit(1); }

    // ── 1. Estado del perfil del participante ─────────────────────────────
    head("1. Diagnóstico — perfil de participante en Firestore");

    let partProfileCheck = await fsGet(`usuarios/${participant.uid}`, participant.token);
    const profileExists = partProfileCheck.status === 200;
    if (profileExists) {
        const d = partProfileCheck.data.fields;
        ok(`Perfil existente — role:${d?.role?.stringValue}, status:${d?.status?.stringValue}`);
    } else if (partProfileCheck.status === 404) {
        info(`Perfil NO existe en Firestore (404) — se creará ahora vía regla allow create`);
    } else {
        fail(`Error inesperado leyendo perfil: HTTP ${partProfileCheck.status}`);
    }

    // ── 2. Crear perfil si no existe (prueba allow create con matrícula abierta) ──
    if (!profileExists) {
        head("2. Crear perfil del participante (Escenario A — matrícula abierta)");

        const profileFields = {
            uid:          fsStr(participant.uid),
            email:        fsStr(participant.email),
            displayName:  fsStr("Test Participante"),
            role:         fsStr("participant"),
            roleContext:  fsStr("Participante"),
            status:       fsStr("active"),
            emailVerified: fsBool(false)
        };
        let createRes = await fsPatch(`usuarios/${participant.uid}`, profileFields, participant.token);
        if (createRes.status === 200) {
            ok(`Perfil creado exitosamente con matrícula abierta`);
        } else {
            fail(`Creación de perfil FALLÓ — HTTP ${createRes.status}: ${JSON.stringify(createRes.data?.error)}`);
            info("Verificar que configuracion/registro tenga matrícula abierta");
        }
    } else {
        head("2. Perfil ya existe — skip creación");
        info("El perfil ya existía, no se prueba allow create aquí");
    }

    // ── 3. Lectura de perfil propio (admin y participante) ─────────────────
    head("3. Lectura de perfil propio");

    let adminProf = await fsGet(`usuarios/${admin.uid}`, admin.token);
    if (adminProf.status === 200) {
        const d = adminProf.data.fields;
        ok(`Admin lee su perfil — role:${d?.role?.stringValue}, status:${d?.status?.stringValue}`);
    } else {
        fail(`Admin NO puede leer su perfil — HTTP ${adminProf.status}`);
    }

    let partProf = await fsGet(`usuarios/${participant.uid}`, participant.token);
    if (partProf.status === 200) {
        const d = partProf.data.fields;
        ok(`Participante lee su perfil — role:${d?.role?.stringValue}, status:${d?.status?.stringValue}`);
    } else {
        fail(`Participante NO puede leer su perfil — HTTP ${partProf.status}: ${JSON.stringify(partProf.data?.error)}`);
    }

    // ── 4. Lectura de progresoPaginas y progresoModulos ────────────────────
    head("4. Lectura de subcolecciones de progreso (reglas corregidas)");

    let pgList = await fsList(`usuarios/${participant.uid}/progresoPaginas`, participant.token);
    if (pgList.status === 200) {
        ok(`progresoPaginas accesible — ${pgList.data.documents?.length ?? 0} docs`);
    } else {
        fail(`progresoPaginas BLOQUEADO — HTTP ${pgList.status}: ${JSON.stringify(pgList.data?.error)}`);
    }

    let modList = await fsList(`usuarios/${participant.uid}/progresoModulos`, participant.token);
    if (modList.status === 200) {
        ok(`progresoModulos accesible — ${modList.data.documents?.length ?? 0} docs`);
    } else {
        fail(`progresoModulos BLOQUEADO — HTTP ${modList.status}: ${JSON.stringify(modList.data?.error)}`);
    }

    // ── 5. Aislamiento ─────────────────────────────────────────────────────
    head("5. Aislamiento — participante no lee perfil ajeno");

    let crossRead = await fsGet(`usuarios/${admin.uid}`, participant.token);
    if (crossRead.status === 403) {
        ok(`Participante bloqueado al leer perfil del admin (403)`);
    } else if (crossRead.status === 200) {
        fail(`Participante pudo leer perfil del admin — FALLA DE AISLAMIENTO`);
    } else {
        info(`HTTP ${crossRead.status} (inesperado)`);
    }

    // ── 6. Config de matrícula y escenario ABIERTA ─────────────────────────
    head("6. Estado de matrícula actual");

    let enrollCfg = await fsGet("configuracion/registro", admin.token);
    let enrollmentOpen = false;
    let originalEndAt = null;
    if (enrollCfg.status === 200) {
        const d = enrollCfg.data.fields;
        const enabled  = d?.enrollmentEnabled?.booleanValue;
        const startAt  = d?.enrollmentStartAt?.timestampValue;
        const endAt    = d?.enrollmentEndAt?.timestampValue;
        originalEndAt  = endAt;
        const now      = new Date();
        const start    = startAt ? new Date(startAt) : null;
        const end      = endAt   ? new Date(endAt)   : null;
        enrollmentOpen = enabled && start && end && now >= start && now <= end;
        ok(`Config leída — enabled:${enabled}, evaluado: ${enrollmentOpen ? "ABIERTA" : "CERRADA"}`);
        info(`  startAt: ${start?.toLocaleString("es") ?? "no definido"}`);
        info(`  endAt  : ${end?.toLocaleString("es")   ?? "no definido"}`);
        info(`  adminEmail: ${d?.adminContactEmail?.stringValue ?? "(vacío)"}`);
    } else {
        fail(`No se pudo leer configuracion/registro — HTTP ${enrollCfg.status}`);
    }

    // ── 7. Escenario B — matrícula cerrada: usuario existente SÍ puede leer ──
    head("7. Escenario B — cerrar matrícula temporalmente y verificar usuario existente");

    // Cerrar matrícula poniendo endAt en el pasado
    const closedEndAt  = new Date(Date.now() - 86400000).toISOString(); // ayer
    const closedResult = await fsPatch(
        "configuracion/registro",
        { enrollmentEndAt: fsTs(closedEndAt) },
        admin.token,
        ["enrollmentEndAt"]
    );

    if (closedResult.status === 200) {
        info(`Matrícula cerrada temporalmente (endAt = ayer)`);

        // Verificar que participante sigue pudiendo leer su perfil
        let profWhileClosed = await fsGet(`usuarios/${participant.uid}`, participant.token);
        if (profWhileClosed.status === 200) {
            ok(`[Matrícula CERRADA] Participante activo SÍ puede leer su perfil — sin bloqueo`);
        } else {
            fail(`[Matrícula CERRADA] Perfil bloqueado — HTTP ${profWhileClosed.status} — regla no corregida`);
        }

        // Verificar que progreso sigue siendo accesible
        let pgWhileClosed = await fsList(`usuarios/${participant.uid}/progresoPaginas`, participant.token);
        if (pgWhileClosed.status === 200) {
            ok(`[Matrícula CERRADA] progresoPaginas sigue accesible`);
        } else {
            fail(`[Matrícula CERRADA] progresoPaginas BLOQUEADO — HTTP ${pgWhileClosed.status}`);
        }

        let modWhileClosed = await fsList(`usuarios/${participant.uid}/progresoModulos`, participant.token);
        if (modWhileClosed.status === 200) {
            ok(`[Matrícula CERRADA] progresoModulos sigue accesible`);
        } else {
            fail(`[Matrícula CERRADA] progresoModulos BLOQUEADO — HTTP ${modWhileClosed.status}`);
        }

        // Verificar que nuevo registro SÍ se bloquea
        head("8. Escenario B — nuevo registro bloqueado con matrícula cerrada");
        let tmpUser;
        try {
            tmpUser = await signUp(`qa-closed-${Date.now()}@qa.invalid`, "QaTest@123456");
            info(`Cuenta Auth temporal creada (uid: ${tmpUser.uid})`);
        } catch(e) {
            fail(`Error creando cuenta temporal: ${e.message}`);
        }

        if (tmpUser) {
            const profileFields = {
                uid:         fsStr(tmpUser.uid),
                email:       fsStr("qa-closed@qa.invalid"),
                displayName: fsStr("QA Closed Test"),
                role:        fsStr("participant"),
                roleContext: fsStr("Participante"),
                status:      fsStr("active"),
                emailVerified: fsBool(false)
            };
            let createWhileClosed = await fsPatch(`usuarios/${tmpUser.uid}`, profileFields, tmpUser.token);
            if (createWhileClosed.status === 403) {
                ok(`[Matrícula CERRADA] Nuevo registro de perfil correctamente bloqueado (403)`);
            } else if (createWhileClosed.status === 200) {
                fail(`[Matrícula CERRADA] Nuevo perfil creado cuando NO debería — enrollmentIsOpen() falla`);
            } else {
                info(`HTTP ${createWhileClosed.status}: ${JSON.stringify(createWhileClosed.data?.error?.status)}`);
            }
            await deleteAccount(tmpUser.token);
            info(`Cuenta temporal eliminada`);
        }

        // Restaurar matrícula original
        const restoreEndAt = originalEndAt ?? new Date(Date.now() + 86400000).toISOString();
        const restoreResult = await fsPatch(
            "configuracion/registro",
            { enrollmentEndAt: fsTs(restoreEndAt) },
            admin.token,
            ["enrollmentEndAt"]
        );
        if (restoreResult.status === 200) {
            info(`Matrícula restaurada a endAt original`);
        } else {
            fail(`⚠️  No se pudo restaurar matrícula — verificar manualmente en admin_configuracion.html`);
        }
    } else {
        fail(`No se pudo cerrar matrícula temporalmente — HTTP ${closedResult.status}`);
    }

    // ── 9. Seguridad — creación con role:admin debe rechazarse ────────────
    head("9. Seguridad — role:admin rechazado en allow create");

    let tmpUser2;
    try {
        tmpUser2 = await signUp(`qa-role-${Date.now()}@qa.invalid`, "QaTest@123456");
    } catch(e) { fail(`Error: ${e.message}`); }

    if (tmpUser2) {
        const hackerFields = {
            uid:         fsStr(tmpUser2.uid),
            email:       fsStr("qa-role@qa.invalid"),
            displayName: fsStr("Hacker"),
            role:        fsStr("admin"),           // ← campo prohibido
            roleContext: fsStr("Participante"),
            status:      fsStr("active"),
            emailVerified: fsBool(false)
        };
        let adminRoleRes = await fsPatch(`usuarios/${tmpUser2.uid}`, hackerFields, tmpUser2.token);
        if (adminRoleRes.status === 403) {
            ok(`Creación con role:admin bloqueada correctamente (403)`);
        } else if (adminRoleRes.status === 200) {
            fail(`⚠️  VULNERABILIDAD — se creó perfil con role:admin`);
        } else {
            info(`HTTP ${adminRoleRes.status} (otro código de rechazo)`);
        }
        await deleteAccount(tmpUser2.token);
        info(`Cuenta temporal eliminada`);
    }

    // ── 10. Regresión admin ────────────────────────────────────────────────
    head("10. Regresión — admin lee configuracion/registro y usuarios (list)");

    let cfgRead = await fsGet("configuracion/registro", admin.token);
    cfgRead.status === 200
        ? ok(`Admin lee configuracion/registro`)
        : fail(`Admin NO puede leer configuracion/registro — HTTP ${cfgRead.status}`);

    let usersRead = await fsList("usuarios", admin.token);
    usersRead.status === 200
        ? ok(`Admin lista usuarios — ${usersRead.data.documents?.length ?? 0} perfiles`)
        : fail(`Admin NO puede listar usuarios — HTTP ${usersRead.status}`);

    // ── Resumen ────────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════");
    console.log(` RESULTADO: ${passed} ✅  ${failed} ❌`);
    console.log("═══════════════════════════════════════════\n");
    if (failed > 0) process.exit(1);
}

main().catch(e => { console.error("ERROR FATAL:", e); process.exit(1); });
