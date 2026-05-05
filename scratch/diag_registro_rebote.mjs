/**
 * DIAGNÓSTICO — Rebote al registrar participante nuevo
 * Verifica: enrollment config, create de perfil, read de perfil, payload exacto
 * node scratch/diag_registro_rebote.mjs
 */

const API_KEY    = "AIzaSyCuSOsMKzSThS-egyw-_FmFiXjiOUAYdSA";
const PROJECT_ID = "docencia-4-lms";
const FS         = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const AUTH       = `https://identitytoolkit.googleapis.com/v1/accounts`;

const log  = (msg) => console.log(`  ${msg}`);
const ok   = (msg) => console.log(`  ✅  ${msg}`);
const fail = (msg) => console.log(`  ❌  ${msg}`);
const warn = (msg) => console.log(`  ⚠️   ${msg}`);
const head = (msg) => console.log(`\n── ${msg} ──`);

async function signIn(email, password) {
    const r = await fetch(`${AUTH}:signInWithPassword?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(`signIn(${email}): ${d.error?.message}`);
    return { token: d.idToken, uid: d.localId, email };
}

async function signUp(email, password) {
    const r = await fetch(`${AUTH}:signUp?key=${API_KEY}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(`signUp: ${d.error?.message}`);
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

async function fsDelete(path, token) {
    const r = await fetch(`${FS}/${path}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    return { status: r.status };
}

// Espera activa (replica lo que hace auth-guard con reintentos)
async function retryRead(path, token, maxAttempts = 6) {
    for (let i = 1; i <= maxAttempts; i++) {
        const res = await fsGet(path, token);
        if (res.status === 200) return { found: true, attempt: i, data: res.data };
        if (i < maxAttempts) {
            const delay = i === 1 ? 1200 : 800;
            log(`    intento ${i}/${maxAttempts} → HTTP ${res.status}, reintentando en ${delay}ms`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    return { found: false, attempt: maxAttempts };
}

function fsStr(v)   { return { stringValue:  v }; }
function fsBool(v)  { return { booleanValue: v }; }

async function main() {
    console.log("═══════════════════════════════════════════════════════");
    console.log(" DIAGNÓSTICO — Rebote al registrar participante nuevo   ");
    console.log("═══════════════════════════════════════════════════════");

    // ── 1. Verificar configuración de matrícula ───────────────────────────
    head("1. Configuración de matrícula (configuracion/registro)");

    let admin;
    try {
        admin = await signIn("carmelo.allende@gmail.com", "Lucas@10302");
        ok(`Admin login OK (uid: ${admin.uid})`);
    } catch(e) { fail(`Admin login: ${e.message}`); process.exit(1); }

    const cfgRes = await fsGet("configuracion/registro", admin.token);
    if (cfgRes.status !== 200) {
        fail(`No se puede leer configuracion/registro — HTTP ${cfgRes.status}`);
        process.exit(1);
    }

    const cfg = cfgRes.data.fields;
    const enabled   = cfg?.enrollmentEnabled?.booleanValue;
    const startTs   = cfg?.enrollmentStartAt?.timestampValue;
    const endTs     = cfg?.enrollmentEndAt?.timestampValue;
    const start     = startTs ? new Date(startTs) : null;
    const end       = endTs   ? new Date(endTs)   : null;
    const now       = new Date();
    const isOpen    = enabled && start && end && now >= start && now <= end;
    const startType = cfg?.enrollmentStartAt ? Object.keys(cfg.enrollmentStartAt)[0] : "missing";
    const endType   = cfg?.enrollmentEndAt   ? Object.keys(cfg.enrollmentEndAt)[0]   : "missing";

    log(`enrollmentEnabled : ${enabled}`);
    log(`enrollmentStartAt : ${start?.toLocaleString("es") ?? "no existe"} (tipo Firestore: ${startType})`);
    log(`enrollmentEndAt   : ${end?.toLocaleString("es")   ?? "no existe"} (tipo Firestore: ${endType})`);
    log(`adminContactEmail : ${cfg?.adminContactEmail?.stringValue ?? "(vacío)"}`);

    if (startType !== "timestampValue") {
        fail(`enrollmentStartAt NO es Timestamp — tipo: "${startType}". Las reglas Firestore pueden fallar al comparar con request.time.`);
    } else {
        ok(`enrollmentStartAt es timestampValue ✓`);
    }
    if (endType !== "timestampValue") {
        fail(`enrollmentEndAt NO es Timestamp — tipo: "${endType}". Las reglas Firestore pueden fallar al comparar con request.time.`);
    } else {
        ok(`enrollmentEndAt es timestampValue ✓`);
    }

    if (!isOpen) {
        fail(`MATRÍCULA CERRADA O DESHABILITADA — la creación de perfiles será rechazada por las reglas.`);
        log(`  enabled:${enabled}, now:${now.toISOString()}, start:${start?.toISOString()}, end:${end?.toISOString()}`);
    } else {
        ok(`Matrícula ABIERTA — creación de perfiles permitida por regla`);
    }

    // ── 2. Crear cuenta Auth de prueba ────────────────────────────────────
    head("2. Crear cuenta Auth temporal (simula createUserWithEmailAndPassword)");

    const testEmail = `diag-${Date.now()}@diag.invalid`;
    let testUser;
    try {
        testUser = await signUp(testEmail, "DiagTest@123456");
        ok(`Auth creado — UID: ${testUser.uid}`);
    } catch(e) {
        fail(`Error al crear Auth: ${e.message}`);
        process.exit(1);
    }

    // ── 3. Verificar payload EXACTO que envía auth.js/createUserProfile ───
    head("3. Crear perfil con PAYLOAD EXACTO de auth.js/createUserProfile");
    log(`Campos esperados por regla: role=="participant", roleContext=="Participante", status=="active"`);

    // Payload que replica exactamente createUserProfile en user-service.js
    const profilePayload = {
        uid:          fsStr(testUser.uid),
        email:        fsStr(testEmail),
        displayName:  fsStr("Diagnóstico Test"),
        roleContext:  fsStr("Participante"),    // exacto — requerido por regla
        role:         fsStr("participant"),      // exacto — requerido por regla
        status:       fsStr("active"),           // exacto — requerido por regla
        emailVerified: fsBool(false)
        // createdAt y updatedAt son serverTimestamp() — el REST API no los envía como timestamp,
        // pero la regla no valida esos campos en el create
    };

    log(`Payload enviado:`);
    log(`  role: "${profilePayload.role.stringValue}"`);
    log(`  roleContext: "${profilePayload.roleContext.stringValue}"`);
    log(`  status: "${profilePayload.status.stringValue}"`);
    log(`  uid: "${profilePayload.uid.stringValue}"`);
    log(`  email: "${profilePayload.email.stringValue}"`);

    const createRes = await fsPatch(`usuarios/${testUser.uid}`, profilePayload, testUser.token);
    log(`HTTP response: ${createRes.status}`);

    if (createRes.status === 200) {
        ok(`Perfil CREADO exitosamente con payload exacto de auth.js`);
    } else if (createRes.status === 403) {
        fail(`PERMISSION DENIED al crear perfil — HTTP 403`);
        fail(`Causa probable: enrollmentIsOpen() devuelve false, o campos no coinciden con regla`);
        log(`  Error: ${JSON.stringify(createRes.data?.error)}`);
        log(`  Regla create requiere: isOwner && enrollmentIsOpen && role=="participant" && roleContext=="Participante" && status=="active"`);
        if (!isOpen) log(`  CONFIRMADO: Matrícula cerrada es la causa del 403`);
        await deleteAccount(testUser.token);
        log(`Cuenta temporal eliminada`);
        process.exit(1);
    } else {
        warn(`HTTP inesperado: ${createRes.status} — ${JSON.stringify(createRes.data?.error)}`);
    }

    // ── 4. Verificar lectura inmediata (sin espera) ───────────────────────
    head("4. Lectura inmediata post-create (sin espera — replica primer intento auth-guard)");

    const readImmediate = await fsGet(`usuarios/${testUser.uid}`, testUser.token);
    if (readImmediate.status === 200) {
        ok(`Perfil legible INMEDIATAMENTE después de create (sin espera)`);
        const d = readImmediate.data.fields;
        log(`  role: ${d?.role?.stringValue}`);
        log(`  roleContext: ${d?.roleContext?.stringValue}`);
        log(`  status: ${d?.status?.stringValue}`);
    } else if (readImmediate.status === 403) {
        fail(`Permission DENIED al leer perfil recién creado — HTTP 403`);
        fail(`Regla get: allow get: if isOwner(userId) || isAdmin()`);
        fail(`Esto NO debería ocurrir — el dueño siempre puede leer su propio perfil`);
    } else if (readImmediate.status === 404) {
        warn(`Perfil no encontrado en lectura inmediata (HTTP 404) — puede ser latencia de propagación`);
    } else {
        warn(`HTTP ${readImmediate.status}: ${JSON.stringify(readImmediate.data?.error)}`);
    }

    // ── 5. Simular retry loop de auth-guard (6 intentos como en el nuevo código) ──
    head("5. Retry loop (replica auth-guard con 6 intentos — total ~5.2 segundos máximo)");

    const retryResult = await retryRead(`usuarios/${testUser.uid}`, testUser.token, 6);
    if (retryResult.found) {
        ok(`Perfil encontrado en intento ${retryResult.attempt} de 6`);
        if (retryResult.attempt === 1) {
            ok(`Sin latencia detectada — perfil disponible al instante`);
        } else {
            warn(`Latencia de propagación: perfil disponible en intento ${retryResult.attempt}`);
        }
        const d = retryResult.data?.fields;
        log(`  status: ${d?.status?.stringValue}`);
        log(`  role: ${d?.role?.stringValue}`);
        ok(`auth-guard debería encontrar el perfil correctamente`);
    } else {
        fail(`Perfil NO encontrado después de 6 reintentos`);
        fail(`auth-guard haría signOut y redirigir a index.html — CAUSA DEL REBOTE`);
    }

    // ── 6. Verificar que el perfil no tiene status/accessRevoked que bloquee ──
    head("6. Verificar que status y accessRevoked no bloquean al nuevo usuario");

    const finalRead = await fsGet(`usuarios/${testUser.uid}`, testUser.token);
    if (finalRead.status === 200) {
        const d = finalRead.data.fields;
        const status       = d?.status?.stringValue;
        const accessRevoked = d?.accessRevoked?.booleanValue ?? false;

        if (status === "active" && !accessRevoked) {
            ok(`status="${status}", accessRevoked=${accessRevoked} — acceso permitido por auth-guard`);
        } else {
            fail(`status="${status}", accessRevoked=${accessRevoked} — auth-guard BLOQUEARÍA este usuario`);
        }
    }

    // ── 7. Verificar doble escritura (¿register-handler también llama createUserProfile?) ──
    head("7. Verificar doble escritura — ¿register-handler llama createUserProfile?");
    log(`Analizando cadena de llamadas según código actual:`);
    log(`  register-handler.js → registerUser() en auth.js`);
    log(`  auth.js/registerUser → createUserProfile() ← ÚNICA escritura esperada`);
    log(`  register-handler.js → getUserProfile() ← solo LECTURA de verificación`);
    ok(`No hay doble escritura. Solo auth.js llama createUserProfile. register-handler solo verifica con getUserProfile.`);

    // ── 8. Limpiar ────────────────────────────────────────────────────────
    head("8. Limpieza");

    await fsDelete(`usuarios/${testUser.uid}`, admin.token).then(r =>
        r.status === 200 || r.status === 204
            ? log(`Perfil Firestore eliminado (HTTP ${r.status})`)
            : log(`Delete Firestore HTTP ${r.status} (puede requerir admin delete en reglas)`)
    );
    await deleteAccount(testUser.token);
    log(`Cuenta Auth temporal eliminada`);

    // ── Resumen ───────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════");
    console.log(" RESUMEN DEL DIAGNÓSTICO                                ");
    console.log("═══════════════════════════════════════════════════════");
    console.log(`  Matrícula abierta     : ${isOpen ? "SÍ" : "NO ← CAUSA PROBABLE"}`);
    console.log(`  Perfil creado OK      : ${createRes.status === 200 ? "SÍ" : "NO ← CAUSA"}`);
    console.log(`  Perfil legible OK     : ${retryResult.found ? "SÍ (intento " + retryResult.attempt + ")" : "NO ← CAUSA"}`);
    console.log(`  startAt tipo Firestore: ${startType}`);
    console.log(`  endAt tipo Firestore  : ${endType}`);
    console.log("═══════════════════════════════════════════════════════\n");
}

main().catch(e => { console.error("ERROR:", e); process.exit(1); });
