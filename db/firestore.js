const firebase = require("firebase/app");
const admin = require('firebase-admin');

const firebaseConfig = require('./firebaseConfig');
firebase.initializeApp(firebaseConfig);

const dbAdmin = require('./firebaseAdmin');
admin.initializeApp(dbAdmin);


const db = admin.firestore();

// db.settings({ ignoreUndefinedProperties: true })

const FieldValue = require('firebase-admin').firestore.FieldValue;

module.exports = db;

exports.FieldValue = FieldValue;

// const players = db.collection("players");
// const stories = db.collection('stories');
// const mails = db.collection('mails');
// const priveStories = db.collection('stories-prive');