const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

const SENDGRID_API_KEY = defineSecret('SENDGRID_API_KEY');
const EMAIL_FROM_ADDRESS = defineSecret('EMAIL_FROM_ADDRESS');
const EMAIL_FROM_NAME = defineSecret('EMAIL_FROM_NAME');
const EMAIL_REPLY_TO_RESEARCHER = defineSecret('EMAIL_REPLY_TO_RESEARCHER');

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const sgMail = require('@sendgrid/mail');

const REAL_EMAIL_PHASE = 'admin_test_only'; // Fase 6
const ENABLE_PARTICIPANT_REAL_SEND = false; // Kill switch backend

async function sendEmailThroughProvider({ to, subject, html, text, replyTo }) {
  const apiKey = SENDGRID_API_KEY.value();
  const fromAddress = EMAIL_FROM_ADDRESS.value();
  const fromName = EMAIL_FROM_NAME.value() || 'Docencia 4.0';

  if (!apiKey || !fromAddress) {
    throw new Error('Email provider secrets are not configured.');
  }

  sgMail.setApiKey(apiKey);

  const message = {
    to,
    from: {
      email: fromAddress,
      name: fromName
    },
    subject,
    text,
    html,
    replyTo
  };

  const response = await sgMail.send(message);

  return {
    provider: 'sendgrid',
    statusCode: response?.[0]?.statusCode || null,
    messageId: response?.[0]?.headers?.['x-message-id'] || null
  };
}

function assertAdminOnlyRealTest({ dryRun, recipients, callerEmail }) {
  if (dryRun) return;

  const allowedAdminEmails = new Set([
    callerEmail,
    'carmelo.allende@gmail.com'
  ].filter(Boolean));

  if (REAL_EMAIL_PHASE !== 'admin_test_only') {
    throw new HttpsError('failed-precondition', 'Real email phase is not enabled.');
  }

  if (!Array.isArray(recipients) || recipients.length !== 1) {
    throw new HttpsError('failed-precondition', 'Real email test requires exactly one recipient.');
  }

  const recipientEmail = String(recipients[0]?.email || '').toLowerCase();
  const allowed = Array.from(allowedAdminEmails)
    .map((email) => String(email || '').toLowerCase())
    .includes(recipientEmail);

  if (!allowed) {
    throw new HttpsError('permission-denied', 'Real email test is restricted to administrator email only.');
  }
}

function assertNoUnexpectedParticipantSend({ recipients, allowParticipantSend }) {
  if (!allowParticipantSend) {
    const nonAdminRecipients = recipients.filter((recipient) => {
      const email = String(recipient.email || '').toLowerCase();
      return ![
        'carmelo.allende@gmail.com'
      ].includes(email);
    });

    if (nonAdminRecipients.length > 0) {
      throw new HttpsError(
        'failed-precondition',
        'El envío real a participantes no está autorizado en esta fase.'
      );
    }
  }
}

exports.sendCommunicationEmail = onCall(
  {
    region: 'us-central1',
    invoker: 'public',
    secrets: [
      SENDGRID_API_KEY,
      EMAIL_FROM_ADDRESS,
      EMAIL_FROM_NAME,
      EMAIL_REPLY_TO_RESEARCHER
    ]
  },
  async (request) => {
    const { auth, data } = request;

    if (!auth) {
      throw new HttpsError(
        'unauthenticated',
        'Debe iniciar sesión para enviar comunicaciones.'
      );
    }

  const { communicationId, dryRun = true } = data || {};

  if (!communicationId || typeof communicationId !== 'string') {
    throw new HttpsError(
      'invalid-argument',
      'communicationId es requerido.'
    );
  }

  const callerUid = auth.uid;
  const callerEmail = auth.token.email || '';

  const callerSnap = await db.collection('usuarios').doc(callerUid).get();

  if (!callerSnap.exists) {
    throw new HttpsError(
      'permission-denied',
      'No se pudo validar el usuario administrador.'
    );
  }

  const caller = callerSnap.data();
  const role = caller.role || caller.rol || '';

  const allowedRoles = ['admin', 'administrador', 'investigador'];

  if (!allowedRoles.includes(role)) {
    throw new HttpsError(
      'permission-denied',
      'No tiene permisos para enviar comunicaciones.'
    );
  }

  const communicationRef = db.collection('comunicaciones').doc(communicationId);
  const communicationSnap = await communicationRef.get();

  if (!communicationSnap.exists) {
    throw new HttpsError(
      'not-found',
      'La comunicación no existe.'
    );
  }

  const communication = communicationSnap.data();

  const recipients = Array.isArray(communication.recipients)
    ? communication.recipients
    : [];

  if (!recipients.length) {
    throw new HttpsError(
      'failed-precondition',
      'La comunicación no tiene destinatarios.'
    );
  }

  // Verificación estricta de Fase 9
  assertAdminOnlyRealTest({
    dryRun,
    recipients,
    callerEmail
  });

  if (!dryRun) {
    assertNoUnexpectedParticipantSend({
      recipients,
      allowParticipantSend: ENABLE_PARTICIPANT_REAL_SEND
    });
  }

  const replyToResearcher = process.env.EMAIL_REPLY_TO_RESEARCHER || 'carmelo.allende@upr.edu';
  const replyTo = [
    callerEmail,
    replyToResearcher
  ].filter(Boolean);

  const batch = db.batch();

  batch.update(communicationRef, {
    mode: dryRun ? 'dry_run' : 'real_admin_test',
    status: dryRun ? 'dry_run_completed' : 'real_admin_test_sent',
    realSendPhase: dryRun ? null : REAL_EMAIL_PHASE,
    backendRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
    backendRequestedByUid: callerUid,
    backendRequestedByEmail: callerEmail,
    replyTo
  });

  const results = [];

  if (dryRun) {
    for (const recipient of recipients) {
      results.push({
        uid: recipient.uid || null,
        email: recipient.email || null,
        displayName: recipient.displayName || '',
        status: 'dry_run'
      });
    }
  } else {
    // Fase 10 & 11 - Construcción segura del mensaje y envío real
    const recipient = recipients[0];
    try {
      const emailResult = await sendEmailThroughProvider({
        to: recipient.email,
        subject: communication.subject || 'Prueba',
        html: communication.messageBodyPreview || communication.messageBodyTemplate,
        text: communication.messageBodyRaw || communication.messageBodyTemplate,
        replyTo: replyTo[0] // SendGrid sólo acepta un solo email o un objeto en v3
      });

      results.push({
        uid: recipient.uid || null,
        email: recipient.email || null,
        displayName: recipient.displayName || '',
        status: 'sent_test',
        provider: emailResult.provider,
        messageId: emailResult.messageId,
        sentAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Email send failed:", error);
      batch.update(communicationRef, {
        status: 'real_admin_test_failed'
      });
      results.push({
        uid: recipient.uid || null,
        email: recipient.email || null,
        displayName: recipient.displayName || '',
        status: 'failed',
        errorCode: 'provider_error',
        errorMessage: 'El envío real de prueba falló. Revise los secretos.'
      });
    }
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
