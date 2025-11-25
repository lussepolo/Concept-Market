
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isConfigured } from './config';

// Singleton instances
let app;
let db: any = null;

if (isConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.log("⚠️ No Firebase config found. Running in LocalStorage Demo Mode.");
}

export { db };
