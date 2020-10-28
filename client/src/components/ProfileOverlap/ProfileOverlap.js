import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import parse from 'html-react-parser';
import TinyEditor from '../RichEditor/TinyEditor';

import { editOverlap } from '../../data/actions/creatorActions';
import { fetchCharactersList } from '../../data/actions/generalActions';
import { playersDB } from '../../data/firebase/firebaseConfig';


const ProfileOverlap = ({ profile, player, character, isLogged, editOverlap, fetchCharactersList }) => {

    const [editorActive, confirmActiveEditor] = useState(false);

    const closeEditor = () => {
        confirmActiveEditor(false);
    }

    useEffect(() => {
        if (isLogged === "logged" && player.id === character.id) {
            console.log("Jesteśmy w efekcie.")
            const unsubscribe = playersDB.doc(`${player.accountDocRef}`)
                .onSnapshot(doc => {
                    let data = doc.data();
                    fetchCharactersList();
                })
            return function cleanup() {
                unsubscribe()
            }
        }
    }, [isLogged])

    return (
        <div className="profileOverlap">
            {player.id === character.id ?
                <button className="editOverlap" onClick={e => {
                    e.preventDefault();
                    confirmActiveEditor(!editorActive)
                }}>Edytuj Zakładkę</button>
                :
                null}
            <div className="overlapText">{parse(profile.text)} </div>

            {editorActive ? <TinyEditor initialValue={profile.text} overlapName={profile.name} editOverlap={editOverlap} closeEditor={closeEditor} /> : null}
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    isLogged: state.player.isLogged,
})
const MapDispatchToProps = dispatch => ({
    editOverlap: overlap => dispatch(editOverlap(overlap)),
    fetchCharactersList: () => dispatch(fetchCharactersList())
})

export default connect(MapStateToProps, MapDispatchToProps)(ProfileOverlap);