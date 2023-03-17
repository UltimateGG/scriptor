import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


// Initialize Firebase
const app = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId:  process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
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
  name: string;
  description: string;
  completed: boolean;
}

export {
  app,
  auth,
  db,
};
