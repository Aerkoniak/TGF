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
        playersIn: []
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
            let oldTavernLength = state.rooms[action.payload.name].length;
            let newTavernLength = action.payload.data.length;
            if (newTavernLength > oldTavernLength) {
                state.rooms[action.payload.name] = action.payload.data;
            }
        },
        updateSingleTavern: (state, action) => {
            let taverns = state.taverns;
            let ind = null;
            taverns.map((tavern, index) => {
                if (tavern.name === action.payload.name) {
                    ind = index
                }
            })
            state.taverns[ind] = action.payload
        },
        showPlayers: (state, action) => {
            let guests = state.playersIn;
            let flag = false;
            guests.forEach(guest => {
                if (guest.name === action.payload.name) flag = true;
            })
            if (!flag) guests.push(action.payload)
            state.playersIn = guests;

        }
    }
})

export const { toggleSend, updateTaverns, updateRoom, updateSingleTavern, showPlayers } = tavernSlice.actions;

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

export const addTavernRecord = record => dispatch => {
    let newRecord = {};
    let roomName = record.name;
    newRecord.author = record.author;
    newRecord.txt = record.text;
    newRecord.replyDate = createDate();
    newRecord.ID = new Date().getTime();

    let recordsArray = []
    dispatch(toggleSend(false))
    tavernDB.doc(`${record.tavern}`).get()
        .then(doc => {
            let tavern = doc.data();
            recordsArray = tavern[`${record.room}`];
            recordsArray.push(newRecord);
            let room = {
            };
            room.name = `${record.tavern}-${record.room}`;
            room.data = recordsArray
            dispatch(updateRoom(room))
            dispatch(toggleSend(true))
            delete room.name;
            delete room.data;
            room[`${record.room}`] = recordsArray;
            let string = `${record.tavern}`
            tavernDB.doc(string).set(room, { merge: true })
                .catch(err => console.log(err))
        })
}

export const editTavern = edit => dispatch => {
    switch (edit.type) {
        case 'description':
            {
                tavernDB.doc(edit.docName).set({ desc: edit.desc }, { merge: true });
                let tavern = edit.tavern;
                tavern.desc = edit.desc;
                dispatch(updateSingleTavern(tavern))
            }
            break;
        default:
            return
    }
}

export const selectRooms = state => state.t.rooms;
export const selectSend = state => state.t.isSend;
export const selectPlayersIn = state => state.t.playersIn;

export default tavernSlice.reducer;