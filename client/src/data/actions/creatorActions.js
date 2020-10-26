import axios from 'axios';

export const setCharacter = char => dispatch => {
    dispatch({ type: "SET_CHARACTER_START" })
    let character = char;
    if (character.type === "stageOne") {
        character.changed = "character - stageOne";
    } else if (character.type === "stageTwo") {
        character.changed = "character - stageTwo";
    }

    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed;
                // dispatch({ type: "SET_CHARACTER_COMPLETE", character });
            }
        })
}

export const resetCharacter = char => dispatch => {
    dispatch({ type: "RESET_CHARACTER_START" })
    let character = char;
    character.changed = "character - reset";
    axios.post('/edit-account', { character })
        .then(res => {
            if (res.data.saved) {
                delete character.changed;
                // dispatch({ type: "RESET_CHARACTER_COMPLETE", character });
            }
        })
}

export const fetchPlayer = docRef => dispatch => {
    axios.post('/fetch-player', { docRef })
        .then(res => {
            if (res.data.player) {
                let player = res.data.player;
                dispatch({ type: "LOG_IN", player })
            }
        })
}

export const addProfileOverlap = overlap => dispatch => {
    let profile = overlap.player.profile;
    let newOverlap = {
        name: overlap.name,
        text: overlap.text
    };
    profile.push(newOverlap);
    let character = {};
    character.changed = "character - profile";
    character.profile = profile;
    character.docRef = overlap.player.accountDocRef;
    axios.post('/edit-account', { character })

}