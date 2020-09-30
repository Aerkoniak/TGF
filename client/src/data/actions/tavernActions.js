import { db } from '../firebase/firebaseConfig';
import { createDate } from '../usefullFN';


export const fetchTavernRooms = () => dispatch => {
    let taverns = []
    dispatch({ type: "FETCH_TAVERN_START" });
    db.collection('tavern').orderBy("id", "asc").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let room = doc.data();
                taverns.push(room);
            })
            dispatch({ type: "FETCH_TAVERN_COMPLETE", taverns });
        })
}

export const addTavernRecord = (tavernRecord) => dispatch => {
    tavernRecord.replyDate = createDate();
    dispatch({ type: "ADD_TAVERN_RECORD_START" });
    let recordsArray = [];
    db.collection('tavern').doc(`${tavernRecord.room}`).get()
        .then(doc => {
            let room = doc.data();
            recordsArray = room.records;
            recordsArray.push(tavernRecord);
            db.collection('tavern').doc(`${tavernRecord.room}`).set({ records: recordsArray }, { merge: true });
        })
}

export const checkTavernRecord = (activeRoom) => dispatch => {
    console.log(activeRoom)
    db.collection('tavern').doc(`${activeRoom.name}`).get()
        .then(doc => {
            let room = doc.data();
            if (room.records.length === activeRoom.records.length) {
                console.log("Bazy są takie same")
            }
            else if (room.records.length < activeRoom.records.length) {
                console.log("W bazie danych jest nowsza wersja.")
            }
        })
}