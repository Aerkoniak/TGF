import { createSlice } from '@reduxjs/toolkit';
import { createDate } from '../usefullFN';
import { tavernDB } from '../firebase/firebaseConfig';
import { toggleFetched } from './globalStoriesSlice';


export const tavernSlice = createSlice({
    name: "t",
    initialState: {
        taverns: [],
        isFetched: false,
        isSend: false,
        rooms: {},
    },
    reducers: {
        toggleSend: (state, action) => {
            state.isSend = action.payload
        },
        toggleFetched: (state, action) => {
            state.isFetched = action.payload
        },
        updateTaverns: (state, action) => {
            let taverns = action.payload;
            state.taverns = taverns;
            taverns.map(tavern => {
                tavern.rooms.map(room => {
                    state.rooms[`${tavern.name}-${room.name}`] = tavern[room.name]
                })
            })
        },
        updateRoom: (state, action) => {

        }
    }
})

export const { updateTaverns, updateRoom } = tavernSlice.actions;

export const fetchTaverns = () => dispatch => {
    let taverns = []
    dispatch(toggleFetched(false))
    tavernDB.orderBy("id", "asc").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let room = doc.data();
                taverns.push(room);
            })
            dispatch(updateTaverns(taverns))
        })
}

export const selectRooms = state => state.t.rooms;

export default tavernSlice.reducer;