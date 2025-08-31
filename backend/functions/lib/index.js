"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLocal = exports.markActioned = exports.setUserClaims = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const options_1 = require("firebase-functions/v2/options");
const audit_1 = require("./audit");
admin.initializeApp();
(0, options_1.setGlobalOptions)({ region: 'australia-southeast1' });
const isEmu = process.env.FUNCTIONS_EMULATOR === 'true';
/** Admin-only in prod; emulator allows anyone for setup */
exports.setUserClaims = (0, https_1.onCall)(async (req) => {
    const caller = req.auth?.token;
    if (!isEmu && (!caller || caller.role !== 'admin'))
        throw new Error('forbidden');
    const { uid, role, teamId } = req.data;
    await admin.auth().setCustomUserClaims(uid, { role, teamId });
    await admin.firestore().doc(`users/${uid}`).set({ role, teamId }, { merge: true });
    return { ok: true };
});
/** Mark a communication as actioned (RBAC + team check + audit) */
exports.markActioned = (0, https_1.onCall)(async (req) => {
    const auth = req.auth?.token;
    if (!auth)
        throw new Error('unauthenticated');
    const { commId } = req.data;
    const ref = admin.firestore().doc(`communications/${commId}`);
    const snap = await ref.get();
    if (!snap.exists)
        throw new Error('not_found');
    const data = snap.data();
    if (auth.role !== 'admin' && data.teamId !== auth.teamId)
        throw new Error('forbidden');
    await ref.update({ status: 'actioned' });
    await (0, audit_1.writeAudit)('mark_actioned', req.auth.uid, commId);
    return { ok: true };
});
/** Local-only: seed emulator with a team, patient, and one communication */
exports.seedLocal = (0, https_1.onCall)(async () => {
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
//# sourceMappingURL=index.js.map