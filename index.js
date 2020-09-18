const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config()

const firebase = require("firebase/app");
const firebaseConfig = require('./firebaseConfig');
firebase.initializeApp(firebaseConfig);

const admin = require('firebase-admin');
const dbAdmin = require('./firebaseAdmin');
admin.initializeApp(dbAdmin);

const db = admin.firestore()
const players = db.collection("players");
const stories = db.collection('stories')


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.post("/registerAccount", (req, res) => {
    let account = req.body.account;
    account.rank = 5;
    players.get()
        .then(snapshot => {
            let size = snapshot.size;
            account.id = size;
            players.add(account)
                .then(docRef => {
                    account.accountDocRef = docRef.id;
                    players.doc(docRef.id).update({ accountDocRef: docRef.id })
                        .then(ok => {
                            if (ok.writeTime) {
                                let player = {};
                                player = account;
                                delete player.password;
                                delete player.repPass;

                                res.json({ player });
                            }
                        })
                })
        })
})

app.post('/login', (req, res) => {
    let account = req.body.account;
    const { login, password } = account;
    console.log(account);
    players.where("login", "==", `${login}`).get()
        .then(snapshot => {
            if (snapshot.size === 0) {
                res.json({ msg: "Nie ma takiego gracza." })
            } else {
                snapshot.forEach(doc => {
                    const document = doc.data();
                    if (password === document.password) {
                        let player = {};
                        player = document;
                        delete player.password;
                        delete player.repPass;

                        res.json({ player });
                        console.log("Zalogowano")
                    } else {
                        console.log("Złe hasło");
                        res.json({ msg: "Złe hasło" })
                    }
                })
            }
        })
})


app.post('/edit-account', (req, res) => {
    let character = req.body.character;

    players.doc(character.accountDocRef).set({ name: character.name }, { merge: true })
        .then(ok => {
            if (ok.writeTime) {
                res.json({ saved: true })
            }
        })
})

app.post('/stories-fetch', (req, res) => {
    let storiesArray = [];
    stories.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.data())
                let story = doc.data();
                storiesArray.push(story);
            })
            res.json({ storiesArray })
        })
})

app.post('/stories-update', (req, res) => {
    let chapter = req.body.chapter;
    let chaptersArray = [];
    console.log(chapter.msg)

    stories.doc(chapter.storyID).get()
        .then(doc => {
            let story = doc.data();
            console.log(story.chapters)
            chaptersArray = story.chapters;
            chaptersArray.push(chapter);
            console.log(chaptersArray);
            console.log(chaptersArray[6].msg);
            res.json(chaptersArray[6].msg)
            stories.doc(chapter.storyID).set({ chapters: chaptersArray }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
                    }
                })
        })
})

app.listen(port, () => console.log(`Listening on port ${port}`));

