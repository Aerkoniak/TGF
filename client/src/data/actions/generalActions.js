// plik dla akcji ogólnych
import Cookies from 'js-cookie';
import axios from 'axios';

import { createDate } from '../usefullFN';
import { connect } from 'react-redux';

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

export const AutoLogging = argument => dispatch => {
    // console.log("Autologowanie")
    const cookie = Cookies.get('autoLog');
    if (cookie === "true") {
        dispatch({ type: "TOGGLE_AUTOLOG", payload: true });
        let account = {}
        account.login = Cookies.get('autoLogLogin');
        account.password = Cookies.get('autoLogPassword');
        account.lastLogged = createDate();
        // console.log(account)

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

export const setProfile = character => dispatch => {

    const newCharacter = character.player;
    newCharacter.changed = "profile";
    newCharacter.profile = character.text;

    axios.post('/edit-account', { newCharacter })
        .then(res => {
            if (res.data.saved) {
                console.log("zapisano");
                delete newCharacter.changed;
                dispatch({ type: 'SET_PLAYER_PROFILE', newCharacter });
                dispatch({ type: 'CLEAN_MSG' })
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