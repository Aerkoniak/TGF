import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTavernRooms, addTavernRecord, checkTavernRecord } from '../../data/actions/tavernActions';
import { parseString } from '../../data/parseString';
import { db } from '../../data/firebase/firebaseConfig';




const TavernRoom = ({ player, room, addTavernRecord, fetchTavernRooms }) => {

    useEffect(() => {
        fetchTavernRooms();
    }, [])

    useEffect(() => {
        db.collection('tavern').doc(`${room.name}`)
            .onSnapshot(doc => {
                let data = doc.data();
                fetchTavernRooms();
            })
    }, [])

    const [value, setValue] = useState("");
    const [isFormActive, toggleForm] = useState(false)

    const submitTavernRecord = (e) => {
        e.preventDefault();
        let tavernRecord = {};
        let author = {};
        author.name = player.name;
        author.id = player.id;
        tavernRecord.author = author;
        tavernRecord.text = value;
        tavernRecord.room = room.name;
        addTavernRecord(tavernRecord);
        setValue("");
        toggleForm(!isFormActive)
    }

    const tavernRecords = room.records.map((record, index) => ((
        <div className="tavernRecord" key={`${index}${record.name}`}>
            <p className="tavernAuthor">{record.author.name}</p>
            <span className="replyTime">{record.replyDate}</span>
            <p className="tavernMess">{parseString(record.text)}</p>
        </div>
    ))).reverse()


    return (
        <div className="tavernRoom">
            <div className="activeRoom">
                <p className="activeRoomName">{room.name}</p>
                <p className="activeDescription">{room.desc}</p>
                <button className="sendReply" onClick={() => toggleForm(!isFormActive)}>Odpisz</button>
                {isFormActive ?
                    <form className="tavernForm" onSubmit={submitTavernRecord}>
                        <textarea className="tavernTA" value={value} onChange={(e) => setValue(e.target.value)} ></textarea>
                        <input className="tavernSubmit" value="Odpisz" type="submit" />
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
        checkTavernRecord: (activeRoom) => dispatch(checkTavernRecord(activeRoom))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(TavernRoom);