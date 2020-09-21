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
                let story = doc.data();
                storiesArray.push(story);
            })
            res.json({ storiesArray })
        })
})

app.post('/stories-update', (req, res) => {
    console.log("stories-update");

    if (req.body.chapter) {
        let chapter = req.body.chapter;
        let chaptersArray = [];
        let spectatorsArray = [];

        stories.doc(chapter.storyID).get()
            .then(doc => {
                let story = doc.data();
                chaptersArray = story.chapters;
                chaptersArray.push(chapter);
                spectatorsArray = story.spectators

                let isNewSpectator = false;
                // Ustawiamy isSpectator na false i tworzymy obiekt spec. 
                let spectator = {};
                spectator.name = chapter.author.name;
                spectator.id = chapter.author.id;
                spectator.seen = true;
                // Mapujemy tablicę obecnych spectatorów, jeśli jeden z nich ma to samo ID co osoba odpisująca to ustawiamy isNewSpectator na true, a jednocześnie temu samemu spectatorowi zmieniami seen na true.
                spectatorsArray.map(spectator => {
                    spectator.seen = false;
                    if (spectator.id === chapter.author.id) {
                        isNewSpectator = true;
                        spectator.seen = true;
                    }
                })
                // jeśli po zmapowaniu całej tablicy isNewSpectator wciąż jest false to pushujemy go do tablicy
                if (!isNewSpectator) {
                    spectatorsArray.push(spectator)
                }

                stories.doc(chapter.storyID).set({ chapters: chaptersArray, spectators: spectatorsArray }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                        }
                    })
            })
    } else if (req.body.seen) {
        let { id, refID } = req.body.seen;
        let spectatorsArray = [];

        stories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                spectatorsArray = story.spectators

                spectatorsArray.map(spectator => {
                    if (spectator.id === id) {
                        spectator.seen = true;
                    }
                })
                stories.doc(refID).set({ spectators: spectatorsArray }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                        }
                    })
            })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`));

