import React, { useState } from 'react';
import styles from '../../css/tavern.module.css';
import { useDispatch } from 'react-redux'
import { editTavern } from '../../data/slices/tavernSlice';

import { Button } from 'react-bootstrap'

const Settings = ({ tavern, tavernIndex }) => {

    const dispatch = useDispatch();

    const [editDesc, toggleDesc] = useState(false);
    const [tavDesc, setTavDesc] = useState(`${tavern.desc}`)
    const editDescription = () => {
        if (!editDesc) toggleDesc(!editDesc)
        else if (editDesc) {
            console.log(tavDesc);
            let edit = {};
            edit.type = "description";
            edit.tavern = tavern;
            edit.index = tavernIndex;
            edit.desc = tavDesc;
            edit.docName = tavern.name;
            dispatch(editTavern(edit))
        }
    }



    return (
        <div className={styles.settings}>
            <h4>Ustawienia</h4>
            <div className={styles.tavernDesc}>
                {editDesc ?
                    <textarea className={styles.textArea} value={tavDesc} onChange={(e) => setTavDesc(e.target.value)}></textarea>
                    :
                    <p>{tavern.desc}</p>}

                <Button onClick={editDescription}>{editDesc ? "Zatwierdź zmiany" : "Edytuj opis"}</Button>
            </div>
        </div>

    );
}

export default Settings;