const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config()

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const firebase = require("firebase/app");
const firebaseConfig = require('./firebaseConfig');
firebase.initializeApp(firebaseConfig);

const admin = require('firebase-admin');
const dbAdmin = require('./firebaseAdmin');
admin.initializeApp(dbAdmin);

const FieldValue = require('firebase-admin').firestore.FieldValue;


// FUNKCJE ZŁODZIEJSKIE 

const pickPocket = require('./pickpocketing');

// FIRESTORE 

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })
const players = db.collection("players");
const stories = db.collection('stories');
const mails = db.collection('mails');
const priveStories = db.collection('stories-prive');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, 'build')));


// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.post("/registerAccount", (req, res) => {
    console.log("/registerAccount")
    let account = req.body.account;
    account.rank = 5;
    account.profile = [{ name: "Pierwsza zakładka", text: "" }];
    account.diary = []
    account.priveField = 0;
    account.mailsField = 0;
    account.storyField = 0;
    players.get()
        .then(snapshot => {
            let size = snapshot.size + 1;
            account.id = size;
            players.add(account)
                .then(docRef => {
                    account.accountDocRef = docRef.id;
                    players.doc(docRef.id).update({ accountDocRef: docRef.id })
                        .then(ok => {
                            if (ok.writeTime) {
                                let player = {};
                                player = account;
                                console.log("/registerAccount --- response")
                                res.json({ player });
                            }
                        })
                })
        })
})

app.post('/login', (req, res) => {
    console.log("/login")
    let account = req.body.account;
    const { login, password, lastLogged } = account;

    players.where("login", "==", `${login}`).get()
        .then(snapshot => {
            if (snapshot.size === 0) {
                res.json({ msg: "Nie ma takiego gracza." })
            } else {
                snapshot.forEach(doc => {
                    const document = doc.data();

                    let player = {};
                    player = document;


                    let lastActiveDate = new Date();
                    let lastActiveTime = lastActiveDate.getTime();
                    let lastDayActive = lastActiveDate.getDate();

                    let change = {
                        lastLog: lastLogged,
                        lastActiveTime: lastActiveTime
                    }

                    if (lastDayActive > player.lastDayActive || !player.lastDayActive) {
                        change.lastDayActive = lastDayActive;
                        let points = player.actionPoints || 0;
                        if (points <= 8 || !points) {
                            points += 2
                            change.actionPoints = points;
                        }
                    }

                    players.doc(player.accountDocRef).set(change, { merge: true });
                    players.doc(player.accountDocRef).get()
                        .then(doc => {
                            let player = doc.data()
                            res.json({ player })
                        })



                })
            }
        });
})

app.post('/fetch-player', (req, res) => {
    3
    console.log("/fetch-player")
    let docRef = req.body.docRef;
    console.log(docRef)
    players.doc(docRef).get()
        .then(doc => {
            let player = doc.data()
            console.log("/fetch-player --- done")
            res.json({ player })
        })
})

app.post('/update-activeTime', (req, res) => {
    const { lastActiveTime, accountDocRef } = req.body.data;
    console.log("/update-activeTime", lastActiveTime, accountDocRef)
    if (!accountDocRef) {
        res.json({ data: "ok" })
    } else if (lastActiveTime && accountDocRef) {
        players.doc(accountDocRef).set({ lastActiveTime: lastActiveTime }, { merge: true })
            .catch(err => {
                console.log(err)
            })
        res.json({ data: "ok" });
        console.log("update-activeTime")
    }

})

app.post('/edit-account', (req, res) => {
    console.log("/edit-account")
    let character = req.body.character;

    switch (character.changed) {
        case "character - stageOne":
            {
                players.doc(character.accountDocRef).set({ name: character.name, race: character.race, class: character.class, origin: character.origin }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/edit-account -- stageOne --- done")
                        }
                    })
            }
            break;
        case 'character - stageTwo':
            {
                players.doc(character.accountDocRef).set({ age: character.age, height: character.height, posture: character.posture, hairColor: character.hairColor, eyeColor: character.eyeColor }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/edit-account -- stageTwo --- done")
                        }
                    })
            }
            break;
        case 'character - reset':
            {
                players.doc(character.accountDocRef).set({ name: "", race: "", class: "", age: null, height: null, posture: "", hairColor: "", eyeColor: "", stats: [], skills: [], FabularPoints: 100, }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {

                            console.log("/edit-account -- reset --- done")
                            players.doc(character.accountDocRef).get()
                                .then(doc => {
                                    let player = doc.data()
                                    res.json({ player })
                                })
                        }
                    })
            }
            break;
        case 'character - profile':
            {
                players.doc(character.docRef).set({ profile: character.profile }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            players.doc(character.docRef).get()
                                .then(doc => {
                                    let player = doc.data()
                                    res.json({ player })
                                })
                            console.log("/edit-account -- char-profile --- done")
                        }
                    })
            }
            break;
        case "name":
            players.doc(character.accountDocRef).set({ name: character.name }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
                        console.log("/edit-account -- name --- done")
                    }
                })
            break;
        case "profile":
            players.doc(character.accountDocRef).set({ profile: character.profile }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
                        console.log("/edit-account -- profile --- done")
                    }
                })
            break;
        case 'rank':
            players.doc(character.accountDocRef).set({ rank: character.newRank }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        // res.json({ saved: true })
                        players.doc(character.accountDocRef).get()
                            .then(doc => {
                                let player = doc.data()
                                res.json({ saved: true, player })
                                console.log("/edit-account -- rank --- done")
                            })
                    }
                })
            break;
        case 'skills':
            players.doc(character.docRef).set({ skills: character.skills, FabularPoints: character.PF }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        players.doc(character.docRef).get()
                            .then(doc => {
                                player = doc.data()
                                res.json(player)
                                console.log("/edit-account -- skills --- done")
                            })
                    }
                })
            break;
        case 'stats':
            players.doc(character.docRef).set({ stats: character.stats }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        let player = {};
                        players.doc(character.docRef).get()
                            .then(doc => {
                                player = doc.data()
                                res.json(player)
                                console.log("/edit-account -- stats --- done")
                            })
                    }
                })
            break;
        case 'diary':
            {
                players.doc(character.docRef).set({ diary: character.diary }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            players.orderBy("id").get()
                                .then(snapshot => {
                                    let characters = [];
                                    snapshot.forEach(doc => {
                                        let data = doc.data();
                                        if (data.name && data.race && data.class && (data.rank < 3 || data.rank === 10)) {
                                            let character = {};
                                            character = data;
                                            characters.push(character)
                                        }
                                    })
                                    res.json(characters);
                                    console.log("/edit-account -- diary --- done")
                                })
                        }
                    })
            }
            break;
        case 'equipment':
            {
                players.doc(character.docRef).set({
                    equipment: {
                        privEq: character.store,
                        body: character.body
                    }
                }, { merge: true })
                    .then(() => {
                        players.doc(character.docRef).get()
                            .then((doc) => {
                                let player = doc.data();
                                res.json(player)
                            })
                    })
            }
            break;

    }
})

app.post('/stories-fetch', (req, res) => {
    console.log("/stories-fetch")
    let storiesArray = [];
    stories.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let story = doc.data();
                storiesArray.push(story);
            })
            res.json({ storiesArray })
            console.log("/stories-fetch --- done")
        })
})

app.post('/stories-update', (req, res) => {
    console.log("/stories-update")
    const { newChapter, seen, deleteChapter, createStory, closeStory } = req.body;

    if (newChapter) {
        console.log("/stories-update --- newChapter")
        let chapter = req.body.newChapter;
        let chaptersArray = [];
        let spectatorsArray = [];

        stories.doc(chapter.storyID).get()
            .then(doc => {
                let story = doc.data();

                if (!story.openMsg) {
                    stories.doc(chapter.storyID).set({ openMsg: chapter.msg, isReady: true, nextTurn: chapter.nextTurn }, { merge: true })
                        .then(ok => {
                            if (ok.writeTime) {
                                res.json({ saved: true })
                                console.log("/stories-update --- newChapter --- done")
                            }
                        })
                } else {

                    chaptersArray = story.chapters;
                    chaptersArray.push(chapter);
                    spectatorsArray = story.spectators

                    let isNewSpectator = false;
                    // Ustawiamy isSpectator na false i tworzymy obiekt spec. 
                    let spectator = {};
                    spectator.name = chapter.author.name;
                    spectator.id = chapter.author.id;
                    spectator.seen = true;
                    spectator.docRef = chapter.author.docRef;
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

                    if (story.author.id === chapter.author.id) {
                        let lastReply = new Date().getTime();
                        stories.doc(chapter.storyID).set({ lastReply: lastReply, chapters: chaptersArray, spectators: spectatorsArray, nextTurn: chapter.nextTurn }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                    console.log("/stories-update --- newChapter --- done")
                                }
                            })
                    } else {
                        let lastReply = new Date().getTime();
                        stories.doc(chapter.storyID).set({ lastReply: lastReply, chapters: chaptersArray, spectators: spectatorsArray }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                    console.log("/stories-update --- newChapter --- done")
                                }
                            })
                    };
                    players.doc(story.author.docRef).update({
                        storyField: FieldValue.increment(1),
                        FabularPoints: FieldValue.increment(1)
                    })
                        .catch(err => console.log(err));

                    spectatorsArray.forEach(spectator => {
                        players.doc(spectator.docRef).update({
                            storyField: FieldValue.increment(1)
                        })
                            .catch(err => console.log(err));
                    })




                }
            })
    } else if (seen) {
        console.log("/stories-update --- seen --- done")
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
                            console.log("/stories-update --- seen --- done")
                        }
                    })
            })
    } else if (deleteChapter) {
        console.log("/stories-update --- deleteChapter")
        let { chapterIndex, refID } = req.body.deleteChapter;
        let chapters = [];
        stories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                chapters = story.chapters;
                chapters.splice(chapterIndex, 1);
                stories.doc(refID).set({ chapters: chapters }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/stories-update --- deleteChapter --- done")
                        }
                    })
            })
    } else if (createStory) {
        console.log("/stories-update --- createStory")

        let story = req.body.createStory;
        story.id = new Date().getTime();
        let spectator = {};
        spectator.name = story.author.name;
        spectator.id = story.author.id;
        spectator.seen = true;
        spectator.docRef = story.author.docRef;
        story.spectators = [];
        story.spectators.push(spectator);
        story.chapters = [];
        story.isReady = true;
        story.lastReply = new Date().getTime();
        stories.add(story)
            .then((docRef) => {
                stories.doc(docRef.id).update({ refID: docRef.id });
                res.json({ id: story.id });
                console.log("/stories-update --- createStory --- done")
            })
    } else if (closeStory) {
        console.log("/stories-update --- closeStory")

        const { refID, place, closeTime } = req.body.closeStory;

        stories.doc(refID).set({ closeTime: closeTime, place: place }, { merge: true })
            .then(ok => {
                if (ok.writeTime) {
                    res.json({ saved: true })
                    console.log("/stories-update --- closeStory --- done")
                }
            })
            .catch(err => console.log(err))
    }
})

app.post('/characters-fetch', (req, res) => {
    console.log("/characters-fetch")
    let characters = [];

    players.orderBy("id").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data();
                if (data.name && data.race && data.class && (data.rank < 3 || data.rank === 10)) {
                    let character = {};
                    character = data;
                    characters.push(character)
                }
            })
            res.json({ characters });
            console.log("/characters-fetch --- done")

        })

})

app.post('/mails-create', (req, res) => {
    console.log("/mails-create")

    const message = req.body.newMessage;
    const { addreesse, sender, text, title } = message;
    console.log(addreesse)

    let newMail = message;
    newMail.id = new Date().getTime();
    newMail.addreesse.read = false;
    newMail.sender.read = true;
    newMail.between = [addreesse.id, sender.id];
    newMail.records = [];
    newMail.lastReply = message.startDate;
    // console.log(newMail);

    mails.add(newMail)
        .then((docRef) => {
            mails.doc(docRef.id).update({ mailsDocRef: docRef.id });
            res.json({ isSaved: true });
            console.log("/mails-create --- done")

            players.doc(addreesse.docRef).update({
                mailsField: FieldValue.increment(1)
            })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

app.post('/mails-fetch', (req, res) => {
    console.log("/mails-fetch")
    const playerLogin = req.body.login;
    let mailsArray = [];

    players.where("login", "==", `${playerLogin}`).get()
        .then(snapshot => {
            if (snapshot.size === 0) {
                res.json({ msg: "Nie ma takiego gracza." })
            } else {
                snapshot.forEach(doc => {
                    const document = doc.data();
                    let playerID = document.id;
                    mails.where("between", 'array-contains', playerID).orderBy("id", "asc").get()
                        .then(snapshot => {
                            if (snapshot.size === 0) {
                            } else {
                                snapshot.forEach(doc => {
                                    let story = doc.data();
                                    mailsArray.push(story);
                                })
                            }
                            res.json({ mailsArray })
                            console.log("/mails-fetch --- done")
                        })
                })
            }
        })

})

app.post('/mails-update', (req, res) => {
    console.log("/mails-update")
    const { newMessage, read, newViewer, deletedPlayer } = req.body;
    if (newMessage) {
        console.log("/mails-update --- newMessage")
        const mailRecord = req.body.newMessage;
        let recordsArray = [];
        let addreesse = {};
        let sender = {};
        let viewers = [];
        mails.doc(mailRecord.mailsDocRef).get()
            .then(doc => {
                let mail = doc.data()
                console.log(mail);
                recordsArray = mail.records;
                viewers = mail.viewers;

                let inform = [];

                recordsArray.push(mailRecord);


                if (mailRecord.author.id === mail.sender.id) {
                    addreesse = mail.addreesse;
                    addreesse.read = false;
                    inform.push(addreesse.docRef);
                    sender = mail.sender;
                    sender.read = true;
                    viewers.map(viewer => {
                        viewer.read = false;
                        inform.push(viewer.docRef)
                    })
                } else if (mailRecord.author.id === mail.addreesse.id) {
                    sender = mail.sender;
                    sender.read = false;
                    inform.push(sender.docRef);
                    addreesse = mail.addreesse;
                    addreesse.read = true;
                    viewers.map(viewer => {
                        viewer.read = false;
                        inform.push(viewer.docRef)
                    })
                } else if (mailRecord.author.id != mail.sender.id && mail.addreesse.id) {
                    addreesse = mail.addreesse;
                    addreesse.read = false;
                    inform.push(addreesse.docRef);
                    sender = mail.sender;
                    sender.read = false;
                    inform.push(sender.docRef);
                    viewers.map(viewer => {
                        if (viewer.name === mailRecord.author.name) {
                            viewer.read = true;
                        } else {
                            viewer.read = false;
                            inform.push(viewer.docRef)
                        }
                    })
                }
                let lastReply = mailRecord.replyDate;

                mails.doc(mailRecord.mailsDocRef).set({ records: recordsArray, sender: sender, addreesse: addreesse, viewers: viewers, lastReply: lastReply }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/mails-update --- newMessage --- done")

                        }
                    })
                    .catch(err => console.log(err));
                inform.forEach(docRef => {
                    players.doc(docRef).update({
                        mailsField: FieldValue.increment(1)
                    })
                        .catch(err => console.log(err))
                })
            })
    } else if (read) {
        console.log("/mails-update --- read")

        const { id, refID } = req.body.read;
        let addreesse = {};
        let sender = {};
        let viewers = [];
        mails.doc(refID).get()
            .then(doc => {
                let mail = doc.data()
                viewers = mail.viewers;

                if (id === mail.sender.id) {
                    sender = mail.sender;
                    sender.read = true;
                    mails.doc(refID).set({ sender: sender }, { merge: true })
                } else if (id === mail.addreesse.id) {
                    addreesse = mail.addreesse;
                    addreesse.read = true;
                    mails.doc(refID).set({ addreesse: addreesse }, { merge: true })
                } else if (id != mail.sender.id && mail.addreesse.id) {
                    viewers.map(viewer => {
                        if (id === viewer.id) {
                            viewer.read = true;
                        }
                    })
                    mails.doc(refID).set({ viewers: viewers }, { merge: true })
                }


                res.json({ saved: true })
                console.log("/mails-update --- read --- done")

            })
    } else if (newViewer) {
        console.log("/mails-update --- newViewer")

        const { mailsDocRef, viewer } = req.body.newViewer;
        let between = [];
        let viewers = [];

        mails.doc(mailsDocRef).get()
            .then(doc => {
                let mail = doc.data();
                between = mail.between;
                between.push(viewer.id);
                viewers = mail.viewers;
                viewers.push(viewer);
                mails.doc(mailsDocRef).set({ between: between, viewers: viewers }, { merge: true })
                console.log("/mails-update --- newViewer --- done")

            })
        players.doc(viewer.docRef).update({
            mailsField: FieldValue.increment(1)
        })
            .catch(err => console.log(err))
    } else if (deletedPlayer) {
        console.log("/mails-update --- deletePlayer")

        const { name, mailsDocRef } = req.body.deletedPlayer;

        let between = [];
        let viewers = [];
        let removedIndex = null;
        let deletedID = null;

        mails.doc(mailsDocRef).get()
            .then(doc => {
                let mail = doc.data();
                between = mail.between;
                viewers = mail.viewers;
                viewers.map((viewer, index) => {
                    if (viewer.name === name) {
                        removedIndex = index;
                        deletedID = viewer.id;
                    }
                });
                viewers.splice(removedIndex, 1);
                between.map((id, index) => {
                    if (id === deletedID) removedIndex = index;
                })
                between.splice(removedIndex, 1)
                mails.doc(mailsDocRef).set({ between: between, viewers: viewers }, { merge: true })
                console.log("/mails-update --- deletePlayer --- done")

            })
    }

})

app.post('/stories/prive-create', (req, res) => {
    console.log("/stories/prive-create")

    let story = req.body.story;

    let priveStory = {};
    let author = {};
    author.id = story.author.id;
    author.name = story.author.name;
    author.rank = story.author.rank;
    author.docRef = story.author.accountDocRef;
    priveStory.author = author;
    priveStory.title = story.title;
    priveStory.id = new Date().getTime();
    priveStory.chapters = [];

    let spectators = [];

    let spectator = {};
    spectator.name = story.author.name;
    spectator.id = story.author.id;
    spectator.seen = true;
    spectator.docRef = story.author.accountDocRef;
    spectators.push(spectator);

    story.players.map(playerInside => {
        let spectator = {};
        spectator.id = playerInside.id;
        spectator.name = playerInside.name;
        spectator.seen = false;
        spectator.docRef = playerInside.accountDocRef;
        spectators.push(spectator)
    });

    priveStory.spectators = spectators;
    priveStory.openMsg = story.text;
    priveStory.startDate = story.startDate;
    priveStory.nextTurn = story.nextTurn;
    let between = []
    spectators.map(player => {
        between.push(player.id);
    })
    priveStory.between = between;

    priveStories.add(priveStory)
        .then((docRef) => {
            priveStories.doc(docRef.id).update({ refID: docRef.id });
            let id = priveStory.id;
            res.json({ id: id })
            console.log("/stories/prive-create --- done")

        })
    spectators.forEach(spectator => {
        players.doc(spectator.docRef).update({
            priveField: FieldValue.increment(1)
        })
            .catch(err => console.log(err));
    })

})

app.post('/stories/prive-fetch', (req, res) => {
    console.log("/stories/prive-fetch")

    let mail = req.body.mail;
    let priveStoriesArray = []


    players.where('login', "==", `${mail}`).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let player = doc.data();
                let playerID = player.id;

                priveStories.where('between', 'array-contains', playerID).orderBy('id', 'asc').get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            let story = doc.data()
                            priveStoriesArray.push(story);
                        })
                        res.json({ saved: true, priveStoriesArray });
                        console.log("/stories/prive-fetch --- done")

                    })
            })


        })

})

app.post('/stories/prive-update', (req, res) => {
    console.log("/stories/prive-update")

    const { newChapter, seen, deleteChapter, deletedPlayer, addedPlayer, closedPrive } = req.body;

    if (seen) {
        console.log("/stories/prive-update --- seen")

        let { id, refID } = req.body.seen;
        let spectatorsArray = [];

        priveStories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                spectatorsArray = story.spectators

                spectatorsArray.map(spectator => {
                    if (spectator.id === id) {
                        spectator.seen = true;
                    }
                })
                priveStories.doc(refID).set({ spectators: spectatorsArray }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            console.log("seen")
                            res.json({ saved: true })
                            console.log("/stories/prive-update --- seen --- done")

                        }
                    })
            })
    } else if (newChapter) {
        console.log("/stories/prive-update --- newChapter")

        let chapter = req.body.newChapter;
        let chaptersArray = [];
        let spectatorsArray = [];

        priveStories.doc(chapter.storyID).get()
            .then(doc => {
                let story = doc.data();

                if (!story.openMsg) {
                    priveStories.doc(chapter.storyID).set({ openMsg: chapter.msg, isReady: true, nextTurn: chapter.nextTurn }, { merge: true })
                        .then(ok => {
                            if (ok.writeTime) {
                                res.json({ saved: true })
                                console.log("/stories/prive-update --- newChapter --- done")

                            }
                        })
                } else {
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

                    if (story.author.id === chapter.author.id) {
                        priveStories.doc(chapter.storyID).set({ chapters: chaptersArray, spectators: spectatorsArray, nextTurn: chapter.nextTurn }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                }
                            })
                    } else {
                        priveStories.doc(chapter.storyID).set({ chapters: chaptersArray, spectators: spectatorsArray }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                }
                            })
                    }
                    spectatorsArray.forEach(spectator => {
                        players.doc(spectator.docRef).update({
                            priveField: FieldValue.increment(1)
                        })
                            .catch(err => console.log(err));
                    })


                }
            })
    } else if (deleteChapter) {
        console.log("/stories/prive-update --- deleteChapter")

        let { chapterIndex, refID } = req.body.deleteChapter;
        let chapters = [];
        priveStories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                chapters = story.chapters;
                chapters.splice(chapterIndex, 1);
                priveStories.doc(refID).set({ chapters: chapters }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/stories/prive-update --- deleteChapter --- done")

                        }
                    })
            })
    } else if (deletedPlayer) {
        console.log("/stories/prive-update --- deletedPlayer")

        const { name, refID } = req.body.deletedPlayer;

        let between = [];
        let spectators = [];
        let playerID = null;

        priveStories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                let deletedIndex = null;
                between = story.between;
                spectators = story.spectators;
                spectators.map((spectator, index) => {
                    if (spectator.name === name) {
                        deletedIndex = index;
                        playerID = spectator.id;
                    }
                });
                spectators.splice(deletedIndex, 1);
                between.map((player, index) => {
                    if (player === playerID) {
                        deletedIndex = index;
                    }
                });
                between.splice(deletedIndex, 1);
                console.log(between, spectators);
                priveStories.doc(refID).set({ between: between, spectators: spectators }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/stories/prive-update --- deletedPlayer  --- done")

                        }
                    })

            })
    } else if (addedPlayer) {
        console.log("/stories/prive-update --- addPlayer")

        const { player, refID } = req.body.addedPlayer;

        let between = [];
        let spectators = [];


        priveStories.doc(refID).get()
            .then(doc => {
                let story = doc.data();
                between = story.between;
                between.push(player.id);
                spectators = story.spectators;
                let spectator = {
                    name: player.name,
                    id: player.id,
                    seen: false,
                    docRef: player.accountDocRef
                }
                spectators.push(spectator);
                priveStories.doc(refID).set({ between: between, spectators: spectators }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                            console.log("/stories/prive-update --- addPlayer --- done")

                        }
                    })
                players.doc(player.accountDocRef).update({
                    priveField: FieldValue.increment(1)
                })
                    .catch(err => console.log(err));

            })
    } else if (closedPrive) {
        console.log("/stories/prive-update --- closedPrive")

        const { refID, closed, closeTime } = req.body.closedPrive;

        priveStories.doc(refID).set({ closed: closed, closeTime: closeTime }, { merge: true })
            .then(ok => {
                if (ok.writeTime) {
                    res.json({ saved: true })
                    console.log("/stories/prive-update --- closedPrive --- done")

                }
            })
    }
})




app.post('/atelier', (req, res) => {
    const { docRef, item, privEq } = req.body.data;

    switch (req.body.data.type) {
        case "magazine":
            {
                console.log("Wewnątrz magazine")
                players.doc(docRef).set({
                    equipment: {
                        privEq: privEq
                    }
                }, { merge: true })
                    .then(() => {
                        players.doc(docRef).get()
                            .then(doc => {
                                let player = doc.data()
                                res.json({ player })
                            })

                    })
                    .catch(err => console.log(err))
            }
            break;

        default: {
            res.json({ msg: "ok" })
        }
    }
})

app.post('/steal', (req, res) => {
    const { targetDocRef, thief, type } = req.body.data;

    switch (type) {
        case 'pocket':
            {
                players.doc(targetDocRef).get()
                    .then(doc => {
                        let victim = doc.data();

                        let effect = pickPocket(thief, victim);
                        console.log(effect)

                        res.json({ ok: true })
                    })

            }
            break;
        default: {
            res.json({ ok: true })
        }
    }

})





app.post(
    "/set-avatar",
    upload.single("avatar" /* name attribute of <file> element in your form */),
    (req, res) => {
        console.log(req.file)
        const tempPath = req.file.path;
        const targetPathJpg = path.join(__dirname, `./uploads/${req.file.originalname}`);
        const targetPathJpeg = path.join(__dirname, `./uploads/${req.file.originalname}`);

        let docRef = (req.file.originalname).split('.');
        console.log(docRef[0]);

        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
            fs.rename(tempPath, targetPathJpg, err => {
                if (err) return handleError(err, res);
            });
        } else if (path.extname(req.file.originalname).toLowerCase() === '.jpeg') {
            fs.rename(tempPath, targetPathJpeg, err => {
                if (err) return handleError(err, res);
            });
        }
        else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res.json({ saved: false })
            });
        };

        setTimeout(() => {
            let b64avatar = fs.readFileSync(`./uploads/${req.file.originalname}`, 'base64');
            players.doc(docRef[0]).set({ avatar64: b64avatar }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        console.log("Zapisano w bazie danych w formacie b64");
                        res.json({ saved: true });
                    }
                })
        }, 500)

    }
);



app.listen(port, () => console.log(`Listening on port ${port}`));

