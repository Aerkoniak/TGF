import axios from 'axios';

export const setCharacter = char => dispatch => {
    dispatch({ type: "SET_CHARACTER_START" })
    let character = char;
    character.changed = "character";
    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed;
                dispatch({ type: "SET_CHARACTER_COMPLETE", character });
            }
        })
}

export const resetCharacter = char => dispatch => {
    dispatch({ type: "RESET_CHARACTER_START" })
    let character = char;
    character.changed = "character";
    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed;
                dispatch({ type: "RESET_CHARACTER_COMPLETE", character });
            }
        })
}