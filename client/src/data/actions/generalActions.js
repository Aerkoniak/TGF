// plik dla akcji ogólnych
import Cookies from 'js-cookie';

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

 
