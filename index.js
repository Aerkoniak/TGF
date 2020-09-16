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


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


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
                                player.login = account.login;
                                player.id = account.id;
                                player.rank = account.rank;
                                player.registrationDay = account.registrationDay;
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
                        player.login = document.login;
                        player.id = document.id;
                        player.rank = document.rank;
                        player.registrationDay = document.registrationDay;
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


app.listen(port, () => console.log(`Listening on port ${port}`));

