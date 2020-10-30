import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTavernRooms, addTavernRecord, deleteRecord } from '../../data/actions/tavernActions';
// import { parseString } from '../../data/parseString';
import { tavernDB } from '../../data/firebase/firebaseConfig';
import { updateActive } from '../../data/actions/generalActions';


import parse from 'html-react-parser';
import RichEditor from '../RichEditor/RichEditor';
import TinyEditor from '../RichEditor/TinyEditor';




const TavernRoom = ({ player, room, addTavernRecord, fetchTavernRooms, deleteRecord, updateActive }) => {

    // useEffect(() => {
    //     fetchTavernRooms();
    // }, [])

    useEffect(() => {
        const unsubscribe = tavernDB.doc(`${room.name}`)
            .onSnapshot(doc => {
                let data = doc.data();
                fetchTavernRooms();
            });
        updateActive(player)
        const myInterval = setInterval(updateActive(player), 300000);
        setTimeout(() => {
            clearInterval(myInterval);
        }, 900000)
        return function cleanup() {
            clearInterval(myInterval);
            unsubscribe()
        }
    }, [])

    const [value, setValue] = useState("");
    const [isFormActive, toggleForm] = useState(false)

    const submitTavernRecord = (e) => {
        e.preventDefault();
        setValue("");
        updateActive(player);
        toggleForm(!isFormActive)
    }
    const deleteRecordSupporter = e => {
        let recordIndex = e.target.id;
        let tavernRoom = room.name;
        deleteRecord(recordIndex, tavernRoom)
    }

    const tavernRecords = room.records.map((record, index) => ((
        <div className="tavernRecord" key={`${index}${record.name}`}>
            <p className="tavernAuthor">{record.author.name}</p>
            <span className="replyTime">{record.replyDate}</span>
            <div className="tavernMess">{parse(record.text)}</div>
            {player.rank <= 2 ? <p onClick={deleteRecordSupporter} className="deleteChapter tavern" id={index}> x </p> : null}
        </div>
    ))).reverse()


    return (
        <div className="tavernRoom">
            <div className="activeRoom">
                <p className="activeRoomName">{room.name}</p>
                <p className="activeDescription">{room.desc}</p>
                {player.rank <= 3 ? <button className="sendReply" onClick={() => toggleForm(!isFormActive)}>Odpisz</button> : null}

                {isFormActive ?
                    <form className="tavernForm" onSubmit={submitTavernRecord}>
                        {/* <RichEditor action={addTavernRecord} place={room} player={player} /> */}
                        <TinyEditor addTavernRecord={addTavernRecord} place={room} />
                    </form>
                    : null}

            </div>

            <div className="tavernRecords">
                {tavernRecords}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    taverns: state.taverns.taverns,
    player: state.player.player,
})

const MapDispatchToProps = dispatch => {
    return {
        fetchTavernRooms: () => dispatch(fetchTavernRooms()),
        addTavernRecord: (tavernRecord) => dispatch(addTavernRecord(tavernRecord)),
        deleteRecord: (recordIndex, tavernRoom) => dispatch(deleteRecord(recordIndex, tavernRoom)),
        updateActive: player => dispatch(updateActive(player))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(TavernRoom);