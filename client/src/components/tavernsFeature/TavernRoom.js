import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Accordion, Card, Popover, OverlayTrigger, Button } from 'react-bootstrap';
import styles from '../../css/tavern.module.css'
import { addTavernRecord, selectSend, editTavern } from '../../data/slices/tavernSlice';

import parse from 'html-react-parser';
import TinyEditor from '../RichEditor/TinyEditor';
import BasicEditor from '../RichEditor/BasicEditor';




const TavernRoom = ({ player, tavern, room, roomIndex, roomsArrays, addTavernRecord, editTavern }) => {

    const isSend = useSelector(selectSend)
    const [value, setValue] = useState("");
    const [newRecord, setNewRecord] = useState(false)
    const [records, setRecords] = useState([]);
    const [editedRecord, setRecForEdit] = useState(false);
    const [isThisWhisper, toggleWhisper] = useState(false);
    const [whisperedIndex, setWhisperedIndex] = useState(false);

    useEffect(() => {
        // console.log("isSend się zmienił.")
        if (isSend) {
            // console.log("isSend jest true.")
            setNewRecord(false);
            setRecForEdit(false);
        }
    }, [isSend])

    useEffect(() => {
        let name = `${tavern.name}-${room}`;
        let oldRecords = roomsArrays[name];
        setRecords(oldRecords);
    }, [tavern, room, roomsArrays]);

    const deleteRecord = (index) => {
        // let name = `${tavern.name}-${room}`;
        let records = [
            ...tavern[room]
        ];
        records.splice(index, 1);
        let edit = {
            docName: tavern.name,
            roomName: room,
            type: "deleteRecord",
            records: records
        }
        edit[room] = records;
        editTavern(edit)

        // console.log(edit)
    }

    const editRecord = (record, index) => {
        let records = [
            ...tavern[room]
        ];
        let edit = {
            docName: tavern.name,
            roomName: room,
            type: "editRecord",
            records: records,
            edited: record,
            editedInd: index
        }
        edit[room] = records;
        setRecForEdit(edit);
        setNewRecord(true);

    }

    // const makeWhisper = (id) => {
    //     toggleWhisper(true);
    //     setWhisperedIndex(id);
    //     setNewRecord(true);
    // }

    // można zrobić dwie osobne zmienne, jedna będzie tworzyć zwykłe odpisy, druga szepty - dzięki temu można szepty umieścić w osobnym okienku jak chciał Harry.

    const tavernRecords = records.map((record, index) => {
        let dataRecord = record;
        if (record.whispered) {
            let flag = false;
            record.between.forEach(rec => {
                if (rec.id === player.id) flag = true;
            })
            if (flag) {
                return (
                    <div key={record.ID} className={styles.recWhispered}>
                        <p className={styles.author}>{record.author.name}</p>
                        <p className={styles.replyDate}>{record.replyDate}</p>
                        <div className={styles.msg}>{parse(record.txt)}</div>
                        {player.rank <= 2 ? <span onClick={(e) => deleteRecord(e.target.id)} id={index} className={styles.delete}>X</span> : null}
                    </div>
                )
            }

        } else {

            return (
                <div key={record.ID} className={styles.record}>
                    <p className={styles.author}>{record.author.name} </p>
                    <p className={styles.replyDate}>{record.replyDate}</p>
                    <div className={styles.msg}>{parse(record.txt)}</div>
                    {player.rank <= 2 ? <span onClick={(e) => deleteRecord(e.target.id)} id={index} className={styles.delete}>X</span> : null}
                    {player.rank <= 2 ? <span onClick={() => editRecord(dataRecord, index)} className={styles.edit}>...</span> : null}
                </div>
            )
        }

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
                            <BasicEditor tavern={tavern.name} room={room} player={player}
                                addTavernRecord={addTavernRecord}
                                recordForEdit={editedRecord ? editedRecord : false}
                                Whisper={isThisWhisper ? whisperedIndex : false}
                            />
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
    addTavernRecord: record => dispatch(addTavernRecord(record)),
    editTavern: edit => dispatch(editTavern(edit))
})


export default connect(MapStateToProps, MapDispatchToProps)(TavernRoom);