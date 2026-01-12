import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validación de claves críticas
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID'
];

const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

if (missingKeys.length > 0) {
  console.error(`❌ FIREBASE ERROR: Faltan variables de entorno: ${missingKeys.join(', ')}`);
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error);
  // Fallback app para evitar crash total, aunque no conectará
  app = initializeApp({}); 
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
