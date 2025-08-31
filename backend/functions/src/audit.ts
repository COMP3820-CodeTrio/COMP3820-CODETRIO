import * as admin from 'firebase-admin';
export async function writeAudit(action: string, userId: string, commId: string) {
  await admin.firestore().collection('auditLogs').add({
    at: admin.firestore.FieldValue.serverTimestamp(),
    action, userId, commId
  });
}
