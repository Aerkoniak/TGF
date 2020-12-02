// import auth from '../firebase/firebaseConfig';
import axios from 'axios';
import { createDate } from '../usefullFN';

import firebase from 'firebase/app';
import 'firebase/auth';
import { auth } from './firebaseConfig';





export const createFirebaseAccount = (account, email, password) => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            if (res.operationType === "signIn") {
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
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Błąd o numerze ${errorCode} o treści ${errorMessage}`);
        })



}

export const signInFirebase = (email, password, account) => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
            if (res.operationType === "signIn") {
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
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Błąd o numerze ${errorCode} o treści ${errorMessage}`);
            let msg = "Złe dane logowania."
            dispatch({ type: 'LOG_IN_NOT', msg })
        })

}

export const signOut = () => dispatch => {
    dispatch({ type: "LOG_OUT" });
    auth.signOut();
}

export const sendVerification = email => dispatch => {
    console.log(auth.currentUser.email)
    const actionCodeSettings = {
        url: 'http://aarde.link/email' + auth.currentUser.email,
        // iOS: {
        //     bundleId: 'com.example.ios'
        // },
        // android: {
        //     packageName: 'com.example.android',
        //     installApp: true,
        //     minimumVersion: '12'
        // },
        handleCodeInApp: true,
        // When multiple custom dynamic link domains are defined, specify which
        // one to use.
    };

    auth.currentUser.sendEmailVerification(actionCodeSettings)
        .then(function () {
            console.log("Wysłano e-mail weryfikacyjny.")
        })
        .catch(function (error) {
            console.log(error)
        });
}

export const sendPasswordReset = email => dispatch => {
    auth.sendPasswordResetEmail(email)
        .then(function () {
            console.log("Wysłano e-mail resetowy.")
        })
        .catch(function (error) {
            console.log(error)
        });

}