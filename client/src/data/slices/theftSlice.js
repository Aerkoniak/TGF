import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createDate } from '../usefullFN';

import { updatePlayer, fetchCharactersList } from '../slices/CPSlice';

export const theftSlice = createSlice({
    name: "tS",
    initialState: {
        effect: false,
    },
    reducers: {
        setEffect: (state, action) => {
            state.effect = action.payload;
        }
    }
})


export const { setEffect } = theftSlice.actions;

export const tryStealing = (docRef, thief, itemID) => dispatch => {
    dispatch(setEffect("loading"))
    let data = {
        targetDocRef: docRef,
        thief,
        type: "pocket"
    };
    if (itemID) data.itemID = itemID;
    axios.post('/theft', { data })
        .then(res => {
            if (res.data.msg) {

                dispatch(setEffect(res.data.msg));
                dispatch(updatePlayer(thief.accountDocRef));
                dispatch(fetchCharactersList());

                // potrzebuje uruchomić fetchPlayer i fetchCharacters
            }
        })
}

export const selectEffect = state => state.tS.effect;

export default theftSlice.reducer;