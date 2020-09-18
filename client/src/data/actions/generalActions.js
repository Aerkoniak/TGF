// plik dla akcji ogólnych
import Cookies from 'js-cookie';
import axios from 'axios';

import { createDate } from '../usefullFN';

export const setHandCoockie = argument => dispatch => {
    const cookie = Cookies.get('isLeftHanded');
    if (cookie === "true") {
        dispatch({type: "TOGGLE_HAND", value: true})
    }
}

export const toggleHand = ( argument ) => (dispatch) => {
    Cookies.remove('isLeftHanded');
    dispatch({type: "TOGGLE_HAND", value: argument});
    Cookies.set('isLeftHanded', argument, {expires: 1});
}


export const createAccount = account => dispatch => {
    dispatch({type: "LOG_IN_CHECKING"});
    account.registrationDay = createDate();
    axios.post('/registerAccount', {account})
    .then(res => {
        let player = res.data.player;
        dispatch({type: 'REGISTER_PLAYER', player})
    })
}
 
export const logInPlayer = account => dispatch => {
    dispatch({type: "LOG_IN_CHECKING"});
    axios.post('/login', {account})
    .then(res => {
        let msg = false;
        let player = false;
        if (res.data.msg) {
            msg = res.data.msg;
            dispatch({type:'LOG_IN_NOT', msg})
        } else {
            player = res.data.player;
            dispatch({type: "LOG_IN", player})
        }
        
    })
}

export const setCharName = character => dispatch => {
    console.log(character);
    axios.post('/edit-account', {character})
    .then(res => {
        if (res.data.saved) {
            dispatch({type: 'SET_PLAYER_NAME', character});
            dispatch({type: 'CLEAN_MSG'})
        }
    })
}