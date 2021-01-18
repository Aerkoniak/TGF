// plik dla akcji ogólnych
import Cookies from 'js-cookie';
import axios from 'axios';

import { createDate } from '../usefullFN';
import { connect } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/auth';


export const setHandCoockie = argument => dispatch => {
    const cookie = Cookies.get('isLeftHanded');
    if (cookie === "true") {
        dispatch({ type: "TOGGLE_HAND", value: true })
    }
}

export const toggleHand = (argument) => (dispatch) => {
    Cookies.remove('isLeftHanded');
    dispatch({ type: "TOGGLE_HAND", value: argument });
    Cookies.set('isLeftHanded', argument, { expires: 1 });
}

export const AutoLogging = () => dispatch => {
    // console.log("Autologowanie")
    const cookie = Cookies.get('autoLog');
    if (cookie === "true") {
        dispatch({ type: "TOGGLE_AUTOLOG", payload: true });
        let account = {}
        account.login = Cookies.get('autoLogLogin');
        account.password = Cookies.get('autoLogPassword');
        account.lastLogged = createDate();
        // console.log(account)
        firebase.auth().signInWithEmailAndPassword(account.login, account.password)
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
                            }
                        }
                    })
                }
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`Błąd o numerze ${errorCode} o treści ${errorMessage}`);
            })
    }
}

export const toggleAutoLog = log => dispatch => {
    Cookies.remove('autoLog');
    Cookies.remove('autoLogLogin');
    Cookies.remove('autoLogPassword');
    if (log.argument) {
        Cookies.set('autoLog', log.argument, { expires: 7 });
        Cookies.set('autoLogLogin', log.login, { expires: 7 });
        Cookies.set('autoLogPassword', log.pass, { expires: 7 });
        dispatch({ type: "TOGGLE_AUTOLOG", payload: log.argument })
    } else {
        Cookies.remove('autoLog');
        Cookies.remove('autoLogLogin');
        Cookies.remove('autoLogPassword');
        dispatch({ type: "TOGGLE_AUTOLOG", payload: log.argument })
    }
}


export const createAccount = account => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
    account.registrationDay = createDate();
    delete account.password;
    delete account.repPass;
    axios.post('/registerAccount', { account })
        .then(res => {
            let player = res.data.player;
            dispatch({ type: 'REGISTER_PLAYER', player })
        })
}

export const logInPlayer = account => dispatch => {
    dispatch({ type: "LOG_IN_CHECKING" });
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
}

export const setCharName = character => dispatch => {
    console.log(character);
    character.changed = "name";
    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed;
                dispatch({ type: 'SET_PLAYER_NAME', character });
                dispatch({ type: 'CLEAN_MSG' })
            }
        })
}

export const setProfile = char => dispatch => {
    const character = char.player;
    character.changed = "profile";
    character.profile = char.text;
    dispatch({ type: 'CLEAN_MSG' })
    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed
                dispatch({ type: 'SET_PLAYER_PROFILE', character });
                dispatch({ type: 'CLEAN_MSG' })
            }
        })
}

export const setRank = char => dispatch => {
    dispatch({ type: 'CLEAN_MSG' });
    const character = char;
    character.changed = "rank";

    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                console.log(res.data.player);
                let character = res.data.player;
                dispatch({ type: 'SET_PLAYER_PROFILE', character });
                dispatch({ type: 'SET_MSG', msg: "Ranga ustawiona." });

            }
        })
}

export const fetchCharactersList = argument => dispatch => {
    dispatch({ type: "FETCH_CHAR_START" });
    axios.post('/characters-fetch')
        .then(res => {
            let payload = res.data.characters;
            dispatch({ type: "FETCH_CHAR_SUCCESS", payload })
        })
}

export const setRefreshToken = token => dispatch => {
    dispatch({ type: "SET_REFRESH_TOKEN", token });
}

export const updateActive = (player, component) => dispatch => {
    console.log(`updateActive() w ${component}`)
    let lastActiveTime = new Date().getTime();
    let data = {};
    data.lastActiveTime = lastActiveTime;
    data.accountDocRef = player.accountDocRef;
    axios.post('/update-activeTime', { data })
}