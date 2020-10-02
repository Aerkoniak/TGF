// import auth from '../firebase/firebaseConfig';
import axios from 'axios';
import { createDate } from '../usefullFN';

const firebase = require("firebase");





export const createFirebaseAccount = (account, email, password) => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Błąd o numerze ${errorCode} o treści ${errorMessage}`);
        })

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const user = firebase.auth().currentUser;
            if (user) {
                dispatch({ type: "LOG_IN_CHECKING" });
                delete account.password;
                delete account.repPass;
                axios.post('/registerAccount', { account })
                    .then(res => {
                        let player = res.data.player;
                        dispatch({ type: 'REGISTER_PLAYER', player })
                    })
                user.sendEmailVerification().then(function () { }).catch(function (error) {
                    // An error happened.
                });

            } else {
                // No user is signed in.
            }
        } else {
            console.log(`Nie ma użytkownika.`)
        }
    });

}

export const signInFirebase = (email, password, account) => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Błąd o numerze ${errorCode} o treści ${errorMessage}`);
    })
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const user = firebase.auth().currentUser;
            if (user) {
                account.lastLogged = createDate();
                axios.post('/login', { account })
                    .then(res => {
                        let msg = false;
                        let player = false;
                        if (res.data.msg) {
                            msg = res.data.msg;
                            dispatch({ type: 'LOG_IN_NOT', msg })
                        } else {
                            player = res.data.player;
                            dispatch({ type: "LOG_IN", player })
                        }
                    })
            } else {
                // No user is signed in.
            }
        } else {
            // No user is signed in.
        }
    });

}