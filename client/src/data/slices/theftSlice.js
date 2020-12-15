import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createDate } from '../usefullFN';

export const theftSlice = createSlice({
    name: "tS",
    initialState: {
        effect: false,
    },
    reducers: {

    }
})


export const { } = theftSlice.actions;

export const tryStealing = (docRef, thief) => dispatch => {
    let data = {
        targetDocRef: docRef,
        thief,
        type: "pocket"
    };
    axios.post('/steal', { data })
}

export const selectEffect = state => state.tS.effect;

export default theftSlice.reducer;