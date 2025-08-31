// frontend/src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "demo-only",
  authDomain: "demo-only.firebaseapp.com",
  projectId: "comp3820-codetrio",
  storageBucket: "comp3820-codetrio.appspot.com",
  appId: "1:demo:web:demo"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const fns = getFunctions(app, "australia-southeast1");
export const storage = getStorage(app);

// OPTIONAL: if you're running Firebase emulators locally
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(fns, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
  } catch {}
}
