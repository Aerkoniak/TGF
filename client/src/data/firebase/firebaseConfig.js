const firebase = require("firebase");
require("firebase/firestore");



const FirebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_FB,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID_2,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_2,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_FB_ID,
};



export const Firebase = firebase.initializeApp(FirebaseConfig);

const db = firebase.firestore()


export const mailsDB = db.collection('mails');
export const storiesDB = db.collection('stories');
export const tavernDB = db.collection('tavern');
// export const auth = firebase.auth()