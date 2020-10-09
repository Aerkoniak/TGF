import axios from 'axios';

export const setCharacter = char => dispatch => {
    console.log(char);
    dispatch({ type: "SET_CHARACTER_START" })
    let character = char;
    character.changed = "character";
    axios.post('/edit-account', { character })
        .then(res => {
            dispatch({ type: "SET_CHARACTER_START" })

            if (res.data.saved) {
                delete character.changed;
                dispatch({ type: "SET_CHARACTER_COMPLETE", character })
            }
        })
} 