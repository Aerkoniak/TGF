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
    let account = req.body.account;
    account.rank = 5;
    account.profile = "";
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

                                res.json({ player });
                            }
                        })
                })
        })
})

app.post('/login', (req, res) => {
    let account = req.body.account;
    const { login, password, lastLogged } = account;
    let lastActiveTime = new Date().getTime();
    players.where("login", "==", `${login}`).get()
        .then(snapshot => {
            if (snapshot.size === 0) {
                res.json({ msg: "Nie ma takiego gracza." })
            } else {
                snapshot.forEach(doc => {
                    const document = doc.data();

                    let player = {};
                    player = document;

                    players.doc(player.accountDocRef).set({ lastLog: lastLogged, lastActiveTime: lastActiveTime }, { merge: true })
                        .then(ok => {
                            if (ok.writeTime) {
                                console.log("Zalogowano")
                                res.json({ player })
                            }
                        })

                })
            }
        });
})

app.post('/update-activeTime', (req, res) => {
    const { lastActiveTime, accountDocRef } = req.body.data;
    if (!accountDocRef) {
        res.json({ data: "ok" })
    } else if (lastActiveTime && accountDocRef) {
        players.doc(accountDocRef).set({ lastActiveTime: lastActiveTime }, { merge: true })
        res.json({ data: "ok" });
    }

})

app.post('/edit-account', (req, res) => {
    let character = req.body.character;

    switch (character.changed) {
        case "character":
            players.doc(character.accountDocRef).set({ name: character.name, age: character.age, race: character.race, class: character.class }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
                    }
                })

            break;
        case "name":
            players.doc(character.accountDocRef).set({ name: character.name }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
                    }
                })
            break;
        case "profile":
            players.doc(character.accountDocRef).set({ profile: character.profile }, { merge: true })
                .then(ok => {
                    if (ok.writeTime) {
                        res.json({ saved: true })
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

                            })
                    }
                })
    }


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
    const { newChapter, seen, deleteChapter, createStory } = req.body;

    if (newChapter) {
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
                        stories.doc(chapter.storyID).set({ chapters: chaptersArray, spectators: spectatorsArray, nextTurn: chapter.nextTurn }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                }
                            })
                    } else {
                        stories.doc(chapter.storyID).set({ chapters: chaptersArray, spectators: spectatorsArray }, { merge: true })
                            .then(ok => {
                                if (ok.writeTime) {
                                    res.json({ saved: true })
                                }
                            })
                    }



                }
            })
    } else if (seen) {
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
    } else if (deleteChapter) {
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
                        }
                    })
            })
    } else if (createStory) {

        let story = req.body.createStory;
        story.id = new Date().getTime();
        let spectator = {};
        spectator.name = story.author.name;
        spectator.id = story.author.id;
        spectator.seen = true;
        story.spectators = [];
        story.spectators.push(spectator);
        story.chapters = [];
        story.isReady = false;
        console.log(story);
        stories.add(story)
            .then((docRef) => {
                stories.doc(docRef.id).update({ refID: docRef.id });
                res.json({ id: story.id });
            })
    }
})

app.post('/characters-fetch', (req, res) => {
    let characters = [];

    players.orderBy("id").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data();
                if (data.name && data.race && data.class && data.age && data.profile) {
                    let character = {};
                    character = data;
                    characters.push(character)
                }
            })
            res.json({ characters });
        })

})

app.post('/mails-create', (req, res) => {
    const message = req.body.newMessage;
    const { addreesse, sender, text, title } = message;
    console.log(addreesse.id)

    let newMail = message;
    newMail.id = new Date().getTime();
    newMail.addreesse.read = false;
    newMail.sender.read = true;
    newMail.between = [addreesse.id, sender.id];
    newMail.records = [];
    console.log(newMail);

    mails.add(newMail)
        .then((docRef) => {
            mails.doc(docRef.id).update({ mailsDocRef: docRef.id });
            res.json({ isSaved: true });
        })
});

app.post('/mails-fetch', (req, res) => {
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
                        })
                })
            }
        })

    // if (playerID === undefined) {
    //     console.log("Nie moge pobrać maili")
    //     res.json({ failed: true })
    // } else {
    //     mails.where("between", 'array-contains', playerID).orderBy("id", "asc").get()
    //         .then(snapshot => {
    //             if (snapshot.size === 0) {
    //                 console.log("Nie ma maili")
    //             } else {
    //                 snapshot.forEach(doc => {
    //                     let story = doc.data();
    //                     mailsArray.push(story);
    //                 })
    //             }
    //             res.json({ mailsArray })
    //         })
    // }

})

app.post('/mails-update', (req, res) => {
    const { newMessage, read, newViewer, deletedPlayer } = req.body;
    if (newMessage) {
        const mailRecord = req.body.newMessage;
        let recordsArray = [];
        let addreesse = {};
        let sender = {};
        let viewers = [];
        mails.doc(mailRecord.mailsDocRef).get()
            .then(doc => {
                let mail = doc.data()
                recordsArray = mail.records;
                viewers = mail.viewers;
                recordsArray.push(mailRecord);


                if (mailRecord.author.id === mail.sender.id) {
                    addreesse = mail.addreesse;
                    addreesse.read = false;
                    sender = mail.sender;
                    sender.read = true;
                    viewers.map(viewer => {
                        viewer.read = false;
                    })
                } else if (mailRecord.author.id === mail.addreesse.id) {
                    sender = mail.sender;
                    sender.read = false;
                    addreesse = mail.addreesse;
                    addreesse.read = true;
                    viewers.map(viewer => {
                        viewer.read = false;
                    })
                } else if (mailRecord.author.id != mail.sender.id && mail.addreesse.id) {
                    addreesse = mail.addreesse;
                    addreesse.read = false;
                    sender = mail.sender;
                    sender.read = false;
                    viewers.map(viewer => {
                        if (viewer.name === mailRecord.author.name) {
                            viewer.read = true;
                        } else {
                            viewer.read = false;
                        }
                    })
                }


                mails.doc(mailRecord.mailsDocRef).set({ records: recordsArray, sender: sender, addreesse: addreesse, viewers: viewers }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                        }
                    })
            })
    } else if (read) {
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
            })
    } else if (newViewer) {
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
            })
    } else if (deletedPlayer) {
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
            })
    }

})

app.post('/stories/prive-create', (req, res) => {
    let story = req.body.story;

    let priveStory = {};
    let author = {};
    author.id = story.author.id;
    author.name = story.author.name;
    author.rank = story.author.rank;
    priveStory.author = author;
    priveStory.title = story.title;
    priveStory.id = new Date().getTime();
    priveStory.chapters = [];

    let spectators = [];

    let spectator = {};
    spectator.name = story.author.name;
    spectator.id = story.author.id;
    spectator.seen = true;
    spectators.push(spectator);

    story.players.map(playerInside => {
        let spectator = {};
        spectator.id = playerInside.id;
        spectator.name = playerInside.name;
        spectator.seen = false;
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
        })

})

app.post('/stories/prive-fetch', (req, res) => {
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
                    })
            })


        })

})

app.post('/stories/prive-update', (req, res) => {
    const { newChapter, seen, deleteChapter, deletedPlayer, addedPlayer } = req.body;

    if (seen) {
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
                        }
                    })
            })
    } else if (newChapter) {
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



                }
            })
    } else if (deleteChapter) {
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
                        }
                    })
            })
    } else if (deletedPlayer) {
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
                        }
                    })

            })
    } else if (addedPlayer) {
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
                }
                spectators.push(spectator);
                priveStories.doc(refID).set({ between: between, spectators: spectators }, { merge: true })
                    .then(ok => {
                        if (ok.writeTime) {
                            res.json({ saved: true })
                        }
                    })

            })
    }
})









app.listen(port, () => console.log(`Listening on port ${port}`));

