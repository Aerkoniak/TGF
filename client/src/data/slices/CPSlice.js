import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createDate } from '../usefullFN';


export const CPSlice = createSlice({
    name: "cp",
    initialState: {
        ownSkills: [],
        PF: null,
        stats: {},
        loading: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setSkills: (state, action) => {
            let skillsArray = state.ownSkills;
            state.PF = state.PF - action.payload.price;
            skillsArray.push(action.payload.skill);
            state.ownSkills = skillsArray;
        },
        fetchSkillsList: (state, action) => {
            state.ownSkills = action.payload;
        },
        fetchPFAmount: (state, action) => {
            state.PF = action.payload;
        },
        increaseSkill: (state, action) => {
            let skillsArray = state.ownSkills;
            skillsArray.forEach(skill => {
                if (skill.name === action.payload.skill.name) {
                    skill.lvl += 1
                }
            })
            state.PF = state.PF - action.payload.price;
        },
        updateStats: (state, action) => {
            console.log(action)
            let stats = action.payload;
            stats.map(stat => {
                state.stats[stat.name] = stat.value || stat.val
            })
        },
        modifyStat: (state, action) => {
            console.log(action.payload.type)
            if (action.payload.type === "up") {
                state.stats[action.payload.name] += 1
            } else {
                state.stats[action.payload.name] -= 1
            }
        }
    }
})

export const { setLoading, setSkills, fetchSkillsList, fetchPFAmount, increaseSkill, updateStats, modifyStat } = CPSlice.actions;

export const updateSkills = skills => dispatch => {
    dispatch(setLoading("loading"))
    let character = {};
    character.changed = "skills";
    character.skills = skills.skillsArray;
    character.PF = skills.PF;
    character.docRef = skills.player.accountDocRef;
    axios.post('/edit-account', { character })
        .then(res => {
            let payload = res.data;
            dispatch({ type: "UPDATE_PLAYER", payload });
            dispatch(setLoading(false))
        })
}
export const updateStatistics = stats => dispatch => {
    dispatch(setLoading("loading"))
    let character = {};
    character.changed = "stats";
    character.stats = stats.stats;
    character.docRef = stats.player.accountDocRef;
    console.log(character)
    axios.post('/edit-account', { character })
        .then(res => {
            let payload = res.data;
            dispatch({ type: "UPDATE_PLAYER", payload });
            dispatch(setLoading(false))
        })
}

export const updatePlayer = docRef => dispatch => {
    axios.post('/fetch-player', { docRef })
        .then(res => {
            let payload = res.data;
            dispatch({ type: "UPDATE_PLAYER", payload });
        })
}

export const updateDiary = object => dispatch => {
    dispatch(setLoading("loading"))
    console.log(object)
    let character = {};
    character.changed = "diary";
    character.docRef = object.character.accountDocRef;
    let diary = object.character.diary || [];
    let diaryEntry = {
        author: { name: object.player.name, id: object.player.id },
        date: createDate(),
        text: object.text
    };
    diary.push(diaryEntry);
    character.diary = diary;
    axios.post('/edit-account', { character })
        .then(res => {
            let payload = res.data;
            dispatch({ type: "FETCH_CHAR_SUCCESS", payload });
            dispatch(setLoading(false))
        })
}

export const selectSkills = state => state.cp.ownSkills;
export const selectFabPoints = state => state.cp.PF;
export const selectStats = state => state.cp.stats;
export const loadingSel = state => state.cp.loading;



export default CPSlice.reducer;
