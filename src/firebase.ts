import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


// Initialize Firebase
const env = import.meta.env;
const app = initializeApp({
  apiKey: env.VITE_API_KEY,
  authDomain: env.VITE_AUTH_DOMAIN,
  projectId: env.VITE_PROJECT_ID,
  storageBucket: env.VITE_STORAGE_BUCKET,
  messagingSenderId:  env.VITE_MESSAGING_SENDER_ID,
  appId: env.VITE_APP_ID
});

const auth = getAuth(app);
const db = getDatabase(app);


// Types
export interface Script {
  id: string;
  name: string;
  description: string;
  shots: Shot[];
  productionMode: boolean;
}

export interface Shot {
  id: string;
  order: number;
  name: string;
  description: string;
  completed: boolean;
}

export {
  app,
  auth,
  db,
};
