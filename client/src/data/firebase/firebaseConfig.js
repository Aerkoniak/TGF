import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const FirebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_FB,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID_2,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_2,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_FB_ID,
};

firebase.initializeApp(FirebaseConfig);

export const Firebase = () => firebase.initializeApp(FirebaseConfig);

const db = firebase.firestore()
export const auth = firebase.auth()

export const FieldValue = firebase.firestore.FieldValue;

export const mailsDB = db.collection('mails');
export const storiesDB = db.collection('stories');
export const priveStoriesDB = db.collection('stories-prive');
export const tavernDB = db.collection('tavern');
export const playersDB = db.collection('players');
// export const auth = firebase.auth()