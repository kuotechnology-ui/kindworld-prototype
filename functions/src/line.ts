import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Send LINE messages to multiple users via the LINE Messaging API multicast endpoint.
 * The LINE channel token is stored securely in Firebase Functions config
 * (set with: firebase functions:config:set line.token="YOUR_TOKEN")
 * and never exposed to the client.
 *
 * Called from the frontend with httpsCallable — replaces the nginx /api/line-multicast proxy.
 */
export const sendLineNotification = functions.https.onCall(async (data, _context) => {
  const { userIds, messages, callerEmail } = data as {
    userIds: string[];
    messages: Array<{ type: string; text?: string }>;
    callerEmail: string;
  };

  // Basic input validation
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'userIds must be a non-empty array');
  }
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'messages must be a non-empty array');
  }
  if (!callerEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'callerEmail is required');
  }

  // Verify the caller is an NGO or admin in Firestore
  const usersSnap = await db.collection('users').where('email', '==', callerEmail).limit(1).get();
  if (usersSnap.empty) {
    throw new functions.https.HttpsError('permission-denied', 'Caller not found in users collection');
  }
  const callerRole = usersSnap.docs[0].data().role as string | undefined;
  if (!callerRole || !['ngo', 'admin'].includes(callerRole)) {
    throw new functions.https.HttpsError('permission-denied', 'Only NGO admins can send LINE notifications');
  }

  // Retrieve the LINE token from Firebase Functions config (kept server-side only)
  const token: string | undefined = functions.config().line?.token;
  if (!token) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'LINE channel token is not configured. Run: firebase functions:config:set line.token="YOUR_TOKEN"'
    );
  }

  const failed: string[] = [];

  // LINE multicast supports up to 500 recipients per request
  for (let i = 0; i < userIds.length; i += 500) {
    const batch = userIds.slice(i, i + 500);
    try {
      const res = await fetch('https://api.line.me/v2/bot/message/multicast', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: batch, messages }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.status.toString());
        functions.logger.warn('LINE multicast batch failed', { batch, status: res.status, err });
        failed.push(...batch);
      }
    } catch (e) {
      functions.logger.error('LINE multicast network error', { batch, e });
      failed.push(...batch);
    }
  }

  return { ok: failed.length === 0, failed };
});
