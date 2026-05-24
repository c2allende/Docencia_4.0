const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Función interna placeholder (Fase 7)
async function sendEmailThroughProvider({ to, subject, html, text, replyTo }) {
  throw new Error('Email provider not configured.');
}

exports.sendCommunicationEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debe iniciar sesión para enviar comunicaciones.'
    );
  }

  const { communicationId, dryRun = true } = data || {};

  if (!communicationId || typeof communicationId !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'communicationId es requerido.'
    );
  }

  const callerUid = context.auth.uid;
  const callerEmail = context.auth.token.email || '';

  const callerSnap = await db.collection('usuarios').doc(callerUid).get();

  if (!callerSnap.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No se pudo validar el usuario administrador.'
    );
  }

  const caller = callerSnap.data();
  const role = caller.role || caller.rol || '';

  const allowedRoles = ['admin', 'administrador', 'investigador'];

  if (!allowedRoles.includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No tiene permisos para enviar comunicaciones.'
    );
  }

  const communicationRef = db.collection('comunicaciones').doc(communicationId);
  const communicationSnap = await communicationRef.get();

  if (!communicationSnap.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      'La comunicación no existe.'
    );
  }

  const communication = communicationSnap.data();

  const recipients = Array.isArray(communication.recipients)
    ? communication.recipients
    : [];

  if (!recipients.length) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'La comunicación no tiene destinatarios.'
    );
  }

  const replyTo = [
    callerEmail,
    'carmelo.allende@upr.edu'
  ].filter(Boolean);

  const batch = db.batch();

  batch.update(communicationRef, {
    mode: dryRun ? 'dry_run' : 'real_pending_backend',
    status: dryRun ? 'dry_run_completed' : 'processing',
    backendRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
    backendRequestedByUid: callerUid,
    backendRequestedByEmail: callerEmail,
    replyTo
  });

  const results = [];

  for (const recipient of recipients) {
    const recipientStatus = dryRun ? 'dry_run' : 'queued';

    results.push({
      uid: recipient.uid || null,
      email: recipient.email || null,
      displayName: recipient.displayName || '',
      status: recipientStatus
    });
  }

  batch.update(communicationRef, {
    backendResults: results,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await batch.commit();

  return {
    ok: true,
    dryRun,
    communicationId,
    recipientCount: recipients.length,
    results
  };
});
