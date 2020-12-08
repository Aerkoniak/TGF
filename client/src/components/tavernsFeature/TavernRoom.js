import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Accordion, Card } from 'react-bootstrap';
import styles from '../../css/tavern.module.css'
import { addTavernRecord, selectSend } from '../../data/slices/tavernSlice';

import parse from 'html-react-parser';
import TinyEditor from '../RichEditor/TinyEditor';
import BasicEditor from '../RichEditor/BasicEditor';




const TavernRoom = ({ player, tavern, room, roomIndex, roomsArrays, addTavernRecord }) => {

    const isSend = useSelector(selectSend)
    const [value, setValue] = useState("");
    const [newRecord, setNewRecord] = useState(false)
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (isSend) {
            setNewRecord(false)
        }
    }, [isSend])

    useEffect(() => {
        let name = `${tavern.name}-${room}`;
        let oldRecords = roomsArrays[name];
        setRecords(oldRecords);
    }, [tavern, room, roomsArrays])

    const tavernRecords = records.map((record, index) => {
        return (
            <div key={record.ID} className={styles.record}>
                <p className={styles.author}>{record.author.name}</p>
                <p className={styles.replyDate}>{record.replyDate}</p>
                <div className={styles.msg}>{parse(record.txt)}</div>
            </div>
        )
    }).reverse()

    return (
        <div className="tavernRoom">
            <div className="activeRoom">
                <h5>{`${room}`}</h5>
                <p>{`${tavern.rooms[roomIndex].desc}`}</p>
            </div>
            <Accordion className={styles.addRecordWrap} activeKey={newRecord ? `0` : false} >
                <Card>
                    <Accordion.Toggle className={styles.addRecord} as={Card.Header} eventKey="0" onClick={() => setNewRecord(!newRecord)} >
                        Napisz odpowiedź
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <BasicEditor tavern={tavern.name} room={room} player={player} inTavern={addTavernRecord} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

            {/* <BasicEditor /> */}
            <div className="tavernRecords">
                {tavernRecords}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    roomsArrays: state.t.rooms
})
const MapDispatchToProps = dispatch => ({
    addTavernRecord: record => dispatch(addTavernRecord(record))
})


export default connect(MapStateToProps, MapDispatchToProps)(TavernRoom);