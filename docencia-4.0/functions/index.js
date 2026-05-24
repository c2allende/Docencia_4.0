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

const REAL_EMAIL_PHASE = 'participants_controlled';
const ENABLE_PARTICIPANT_REAL_SEND = true;
const MAX_REAL_RECIPIENTS_PER_SEND = 25;

async function sendEmailThroughProvider({ to, subject, html, text, replyTo }) {
  const apiKey = SENDGRID_API_KEY.value();
  // Strip whitespace and invisible BOM characters that might have been injected by PowerShell
  const fromAddress = (EMAIL_FROM_ADDRESS.value() || '').replace(/^\uFEFF/, '').trim();
  const fromName = (EMAIL_FROM_NAME.value() || 'Docencia 4.0').replace(/^\uFEFF/, '').trim();

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
    html
  };

  if (replyTo && replyTo.trim() !== '') {
    message.replyTo = replyTo;
  }

  console.log("SENDGRID PAYLOAD:", JSON.stringify(message, null, 2));

  const response = await sgMail.send(message);

  return {
    provider: 'sendgrid',
    statusCode: response?.[0]?.statusCode || null,
    messageId: response?.[0]?.headers?.['x-message-id'] || null
  };
}

function assertParticipantRealSendAllowed({ recipients, callerEmail }) {
  if (!ENABLE_PARTICIPANT_REAL_SEND) {
    throw new HttpsError(
      'failed-precondition',
      'El envío real a participantes no está habilitado.'
    );
  }

  if (REAL_EMAIL_PHASE !== 'participants_controlled') {
    throw new HttpsError(
      'failed-precondition',
      'La fase actual no permite envío real a participantes.'
    );
  }

  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw new HttpsError(
      'failed-precondition',
      'No hay destinatarios válidos para enviar.'
    );
  }

  if (recipients.length > MAX_REAL_RECIPIENTS_PER_SEND) {
    throw new HttpsError(
      'failed-precondition',
      `El máximo permitido por envío es ${MAX_REAL_RECIPIENTS_PER_SEND} destinatarios.`
    );
  }

  const invalidEmails = recipients.filter((recipient) => {
    const email = String(recipient.email || '').trim();
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  if (invalidEmails.length > 0) {
    throw new HttpsError(
      'failed-precondition',
      'Hay destinatarios con emails inválidos.'
    );
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

  if (!dryRun) {
    assertParticipantRealSendAllowed({ recipients, callerEmail });
  }

  const replyToResearcher = process.env.EMAIL_REPLY_TO_RESEARCHER || 'carmelo.allende@upr.edu';
  const replyTo = [
    callerEmail,
    replyToResearcher
  ].filter(Boolean);

  const batch = db.batch();

  batch.update(communicationRef, {
    mode: dryRun ? 'dry_run' : 'real_participant_send',
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
    batch.update(communicationRef, { status: 'dry_run_completed' });
  } else {
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        const emailResult = await sendEmailThroughProvider({
          to: recipient.email,
          subject: communication.subject || 'Comunicación Docencia 4.0',
          html: communication.messageBodyPreview || communication.messageBodyTemplate,
          text: communication.messageBodyRaw || communication.messageBodyTemplate,
          replyTo: replyTo[0] 
        });

        results.push({
          uid: recipient.uid || null,
          email: recipient.email || null,
          displayName: recipient.displayName || '',
          status: 'sent',
          provider: emailResult.provider,
          messageId: emailResult.messageId,
          sentAt: new Date().toISOString()
        });
        sentCount++;
      } catch (error) {
        console.error(`Email send failed for ${recipient.email}:`, error);
        results.push({
          uid: recipient.uid || null,
          email: recipient.email || null,
          displayName: recipient.displayName || '',
          status: 'failed',
          errorCode: 'provider_error',
          errorMessage: error.message
        });
        failedCount++;
      }
    }

    let finalStatus = 'real_send_sent';
    if (failedCount > 0 && sentCount > 0) finalStatus = 'real_send_partial';
    else if (failedCount > 0 && sentCount === 0) finalStatus = 'real_send_failed';

    batch.update(communicationRef, {
      status: finalStatus
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
