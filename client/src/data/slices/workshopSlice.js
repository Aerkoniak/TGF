import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createDate } from '../usefullFN';

export const workshopSlice = createSlice({
    name: "workshop",
    initialState: {
        equipment: [],
    },
    reducers: {
        setEq: (state, action) => {
            let list = state.equipment;
            list.push(action.payload);
            state.equipment = list;
        },
    }
})

export const { setEq } = workshopSlice.actions;

// export const fetchEquipment = (docRef) => dispatch => {

// }




export const makeItem = (skills, item) => {
    let itemDone = item;
    itemDone.id = new Date().getTime();


    let craftSkill = 0;
    let qualityTest = Math.floor(Math.random() * 100);
    let craftBonus = 0;
    let title = "";
    let jobScore = 0;

    skills.forEach(skill => {
        if (skill.cat === 3) {
            if (skill.lvl > craftSkill) craftSkill = skill.lvl;
        }
    })



    switch (craftSkill) {
        case 1:
            { craftBonus = 10 }
            break;
        case 2:
            { craftBonus = 15 }
            break;
        case 3:
            { craftBonus = 25 }
            break;
        case 4:
            { craftBonus = 35 }
            break;
        case 5:
            { craftBonus = 50 }
            break;
        default: {
            craftBonus = 0;
        }
    }


    jobScore = qualityTest + craftBonus;
    if (jobScore < 60) title = "Normalny"
    else if (jobScore < 75) title = "Niezły"
    else if (jobScore < 90) title = "Świetny"
    else if (jobScore >= 90) title = "Wyśmienity"

    if (qualityTest < 10) title = "Słaby"

    itemDone.quality = title;

    return itemDone;
}


export default workshopSlice.reducer;