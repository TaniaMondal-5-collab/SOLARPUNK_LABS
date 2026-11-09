// MEDBRIDGE - Firebase Service & Cloud Infrastructure Configuration
// Provides Auth, Cloud Firestore, and Firebase Storage with graceful offline/demo fallback

export interface FirebaseStatus {
  isConfigured: boolean;
  projectId?: string;
  authDomain?: string;
  statusMessage: string;
}

const firebaseConfig = {
  apiKey: (import.meta as any)?.env?.VITE_FIREBASE_API_KEY || '',
  authDomain: (import.meta as any)?.env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: (import.meta as any)?.env?.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: (import.meta as any)?.env?.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: (import.meta as any)?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any)?.env?.VITE_FIREBASE_APP_ID || ''
};

export function getFirebaseStatus(): FirebaseStatus {
  const hasKeys = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
  return {
    isConfigured: hasKeys,
    projectId: firebaseConfig.projectId || 'medbridge-health-hackathon',
    authDomain: firebaseConfig.authDomain || 'medbridge-health.firebaseapp.com',
    statusMessage: hasKeys 
      ? 'Live Cloud Firestore Connected' 
      : 'Demo Mode Active (In-Memory & LocalStorage persistence)'
  };
}

export { firebaseConfig };

