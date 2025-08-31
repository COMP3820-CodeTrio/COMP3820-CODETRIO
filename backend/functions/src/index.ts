import * as admin from 'firebase-admin';
import { onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { writeAudit } from './audit';

admin.initializeApp();
setGlobalOptions({ region: 'australia-southeast1' });

const isEmu = process.env.FUNCTIONS_EMULATOR === 'true';

/** Admin-only in prod; emulator allows anyone for setup */
export const setUserClaims = onCall(async (req) => {
  const caller = req.auth?.token as any;
  if (!isEmu && (!caller || caller.role !== 'admin')) throw new Error('forbidden');

  const { uid, role, teamId } = req.data as { uid: string; role: string; teamId: string };
  await admin.auth().setCustomUserClaims(uid, { role, teamId });
  await admin.firestore().doc(`users/${uid}`).set({ role, teamId }, { merge: true });
  return { ok: true };
});

/** Mark a communication as actioned (RBAC + team check + audit) */
export const markActioned = onCall(async (req) => {
  const auth = req.auth?.token as any;
  if (!auth) throw new Error('unauthenticated');

  const { commId } = req.data as { commId: string };
  const ref = admin.firestore().doc(`communications/${commId}`);
  const snap = await ref.get(); if (!snap.exists) throw new Error('not_found');
  const data = snap.data()!;

  if (auth.role !== 'admin' && data.teamId !== auth.teamId) throw new Error('forbidden');
  await ref.update({ status: 'actioned' });
  await writeAudit('mark_actioned', req.auth!.uid, commId);
  return { ok: true };
});

/** Local-only: seed emulator with a team, patient, and one communication */
export const seedLocal = onCall(async () => {
  const db = admin.firestore();
  const teamRef = await db.collection('teams').add({ name: 'Far North' });
  const patientRef = await db.collection('patients').add({
    teamId: teamRef.id,
    firstName: 'John',
    lastName: 'Barnes',
    presentingComplaint: 'Low mood'
  });
  const commRef = await db.collection('communications').add({
    teamId: teamRef.id,
    patientId: patientRef.id,
    title: 'Referral for John Barnes',
    type: 'referral',
    status: 'awaiting',
    dateReceived: admin.firestore.FieldValue.serverTimestamp()
  });
  return { ok: true, teamId: teamRef.id, patientId: patientRef.id, commId: commRef.id };
});
