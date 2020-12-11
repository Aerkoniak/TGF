import { createSlice } from '@reduxjs/toolkit';
import { createDate } from '../usefullFN';
import { tavernDB, FieldValue } from '../firebase/firebaseConfig';
// import { toggleFetched } from './globalStoriesSlice';


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
            state.isSend = action.payload;
            // console.log(`isSend(${action.payload})`)
        },
        toggleFetched: (state, action) => {
            state.isFetched = action.payload
        },
        updateTaverns: (state, action) => {
            let taverns = []
            // console.log(action.payload)
            if (action.payload) {
                taverns = action.payload;
                state.taverns = taverns;
            } else if (!action.payload) {
                taverns = state.taverns;
                state.taverns = taverns;
            }
            taverns.map(tavern => {
                tavern.rooms.map(room => {
                    state.rooms[`${tavern.name}-${room.name}`] = tavern[room.name]
                })
            })
        },
        updateRoom: (state, action) => {
            // console.log(`updateRoom w ${action.payload.name}`)
            state.rooms[action.payload.name] = action.payload.data;
        },
        updateSingleTavern: (state, action) => {
            let taverns = state.taverns;
            let ind = null;
            taverns.map((tavern, index) => {
                if (tavern.name === action.payload.name) {
                    ind = index
                }
            })
            state.taverns[ind] = action.payload;
            console.log("updateSingleTavern")
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

export const { toggleSend, toggleFetched, updateTaverns, updateRoom, updateSingleTavern, showPlayers } = tavernSlice.actions;

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
    if (record.whispered) {
        newRecord.whispered = record.whispered;
        newRecord.between = record.between;
    }

    let recordsArray = []
    dispatch(toggleSend(false))
    tavernDB.doc(`${record.tavern}`).get()
        .then(doc => {
            let tavern = doc.data();
            recordsArray = tavern[`${record.room}`];
            recordsArray.push(newRecord);
            let room = {
            };
            room[`${record.room}`] = recordsArray;
            let string = `${record.tavern}`
            tavernDB.doc(string).set(room, { merge: true })
                .then(function () {
                    console.log("Document successfully written!");
                    dispatch(toggleSend(true))
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        })
}

export const editTavern = edit => dispatch => {
    // console.log(`Robi się editTavern o typie ${edit.type}`)
    dispatch(toggleSend(false))

    switch (edit.type) {
        case 'description':
            {
                tavernDB.doc(edit.docName).set({ desc: edit.desc }, { merge: true })
                    .then(function () {
                        console.log("Document successfully written!");
                        dispatch(toggleSend(true))
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
            break;
        case 'addRoom':
            {
                let change = {
                    rooms: edit.rooms,
                }
                change[edit.roomName] = []
                tavernDB.doc(edit.docName).set(change, { merge: true })
                    .then(function () {
                        console.log("Document successfully written!");
                        dispatch(toggleSend(true))
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
            break;
        case 'deleteRecord':
            {
                let change = {
                };
                change[edit.roomName] = edit.records;
                tavernDB.doc(edit.docName).set(change, { merge: true })
                    .then(function () {
                        console.log("Document successfully written!");
                        dispatch(toggleSend(true))
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
            break;
        case 'deleteRoom':
            {
                tavernDB.doc(edit.docName).set({ rooms: edit.rooms }, { merge: true })
                    .then(function () {
                        console.log("Document successfully deleted!");
                        tavernDB.doc(edit.docName).update({
                            [edit.roomName]: FieldValue.delete()
                        })
                        dispatch(toggleSend(true))

                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });


            }
            break;
        default:
            return
    }
}

export const editRecord = edit => dispatch => {
    dispatch(toggleSend(false));

    let change = {
    };
    change[edit.roomName] = edit.records;
    tavernDB.doc(edit.docName).set(change, { merge: true })
        .then(function () {
            console.log("Document successfully written!");
            dispatch(toggleSend(true))
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}

export const selectRooms = state => state.t.rooms;
export const selectSend = state => state.t.isSend;
export const selectPlayersIn = state => state.t.playersIn;

export default tavernSlice.reducer;