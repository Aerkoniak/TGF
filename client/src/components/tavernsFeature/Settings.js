import React, { useState, useEffect } from 'react';
import styles from '../../css/tavern.module.css';
import { useDispatch, useSelector } from 'react-redux'
import { editTavern, selectSend } from '../../data/slices/tavernSlice';

import { Button, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap'

const Settings = ({ tavern, tavernIndex }) => {

    const dispatch = useDispatch();
    const isSend = useSelector(selectSend);

    useEffect(() => {
        if (isSend) {
            toggleDesc(false);
            toggleAddRoom(false);
            toggleEditRoom(false);
        }
    }, [isSend])

    const [isTavernDesc, toggleDesc] = useState(false);
    const [isAddRoom, toggleAddRoom] = useState(false);
    const [isEditRoom, toggleEditRoom] = useState(false);
    const [desc, setDesc] = useState("");
    const [name, setName] = useState("");
    const [index, setIndex] = useState(null);

    const pickSetting = id => {
        if (id === "desc") {
            toggleDesc(true);
            toggleAddRoom(false);
            toggleEditRoom(false);
            setDesc(tavern.desc);
        } else if (id === "add") {
            toggleDesc(false);
            toggleAddRoom(true);
            toggleEditRoom(false);
            setName("");
            setDesc("");
        } else {
            toggleDesc(false);
            toggleAddRoom(false);
            toggleEditRoom(true);
            setName(tavern.rooms[id].name);
            setDesc(tavern.rooms[id].desc);
            setIndex(id);
        }
    }
    const confirmDesc = () => {
        let edit = {
            docName: tavern.name,
            desc: desc,
            type: "description"
        }
        dispatch(editTavern(edit))
    }
    const addRoom = () => {
        let room = {
            name: name,
            desc: desc
        }
        let edit = {
            docName: tavern.name,
            type: "addRoom",
            roomName: name,
            rooms: [
                ...tavern.rooms,
                room
            ]
        }
        edit[name] = []
        dispatch(editTavern(edit))
    }
    const editRoom = () => {
        let room = {
            name: name,
            desc: desc
        }
        let rooms = [
            ...tavern.rooms
        ];
        rooms.splice(index, 1, room);
        let edit = {
            docName: tavern.name,
            type: "addRoom",
            roomName: room.name,
            rooms: [
                ...rooms
            ]
        }
        dispatch(editTavern(edit))
    }
    const deleteRoom = () => {
        let rooms = [
            ...tavern.rooms
        ];
        let Ind = false;
        rooms.forEach((room, index) => {
            if (room.name === name) Ind = index;
        })
        rooms.splice(index, 1);
        let edit = {
            docName: tavern.name,
            roomName: name,
            rooms: rooms,
            type: "deleteRoom",
        }
        console.log(edit)
        dispatch(editTavern(edit))
    }


    const dropdowns = tavern.rooms.map((dropdown, index) => {
        return (
            <Dropdown.Item id={index} onClick={(e) => pickSetting(e.target.id)} >{dropdown.name}</Dropdown.Item>
        )
    })
    return (
        <div className={styles.settings}>
            <div className={styles.settingNav}>
                <ul className={styles.list}>
                    <Button variant="outline-dark" onClick={(e) => pickSetting(e.target.id)} className={styles.listEl} id="desc">Zmień opis</Button>
                    <Button variant="outline-dark" onClick={(e) => pickSetting(e.target.id)} className={styles.listEl} id="add">Dodaj pokój</Button>
                    <Dropdown as={ButtonGroup}>
                        <Button variant="outline-dark" className={styles.listEl} id="edit">Edytuj pokój</Button>
                        <Dropdown.Toggle split variant="outline-dark" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            {dropdowns}
                        </Dropdown.Menu>
                    </Dropdown>
                </ul>
            </div>
            <div className={styles.settingsWrap}>
                {isTavernDesc ?
                    <div className={styles.tavernDesc}>
                        <h5>Edytuj opis</h5>
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className={styles.textArea}></textarea>
                        <Button variant="outline-dark" onClick={confirmDesc} className={styles.confirmBtn}>Zatwierdź</Button>
                    </div> : null}

                {isAddRoom ?
                    <div className={styles.addRoom}>
                        <h5>Dodaj pokój</h5>
                        <input type="text" placeholder="Nazwa pokoju" value={name} onChange={e => setName(e.target.value)} />
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className={styles.textArea}></textarea>
                        <Button variant="outline-dark" onClick={addRoom} className={styles.confirmBtn}>Zatwierdź</Button>
                    </div> : null}

                {isEditRoom ?
                    <div className={styles.editRoom}>
                        <h5>Edytuj pokój</h5>

                        <input type="text" placeholder="Nazwa pokoju" value={name} onChange={e => setName(e.target.value)} />
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className={styles.textArea}></textarea>
                        <Button variant="dark" onClick={deleteRoom} className={styles.confirmBtn}>Usuń pokój</Button>
                        <Button variant="outline-dark" onClick={editRoom} className={styles.confirmBtn}>Zatwierdź</Button>
                    </div> : null}
            </div>
        </div>

    );
}

export default Settings;