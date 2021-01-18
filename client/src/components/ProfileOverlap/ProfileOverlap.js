import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'
import parse from 'html-react-parser';
import TinyEditor from '../RichEditor/TinyEditor';

import { editOverlap, deleteOverlap } from '../../data/actions/creatorActions';
import { fetchCharactersList } from '../../data/actions/generalActions';
import { playersDB } from '../../data/firebase/firebaseConfig';
import { Button } from 'react-bootstrap';


const ProfileOverlap = ({ inCP, profile, player, character, isLogged, editOverlap, fetchCharactersList, deleteOverlap }) => {

    const [editorActive, confirmActiveEditor] = useState(false);
    const [isInCP, setInCP] = useState(false);
    const [newTitle, setNewTitle] = useState("");


    useEffect(() => {
        if (!inCP) {
            setInCP(!isInCP)
        }
    }, [inCP])

    const closeEditor = () => {
        confirmActiveEditor(false);
    }
    const profileOverlaps = character.profile.map(overlap => ((
        <NavLink key={overlap.name + character.id} to={`/characters/id${character.id}/${overlap.name}`}>{overlap.name}</NavLink>
    )))

    return (
        <div className="profileOverlap">
            {isInCP ? <>
                <div className="overlapsLinks">
                    {profileOverlaps}
                </div>
            </> : null}


            <div className="overlapText">{parse(profile.text)} </div>

            {editorActive ?
                <>
                    <input type="text" placeholder="Wpisz nowy tytuł zakładki. Nie wpisuj nic jeśli nie chcesz zmieniać tytułu." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    <TinyEditor initialValue={profile.text} newTitle={newTitle ? newTitle : false} overlapName={profile.name} editOverlap={editOverlap} closeEditor={closeEditor} />
                </> : null}

            {!isInCP && player.id === character.id ?
                <>
                    <Button variant="outline-dark" className="editOverlap" onClick={e => {
                        e.preventDefault();
                        confirmActiveEditor(!editorActive)
                    }}>Edytuj Zakładkę</Button>
                    <Button variant="outline-danger" className="editOverlap" onClick={(e) => {
                        e.preventDefault();
                        deleteOverlap(profile.name, player)
                    }}
                    >Usuń zakładkę</Button>
                </> : null}


        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    isLogged: state.player.isLogged,
})
const MapDispatchToProps = dispatch => ({
    editOverlap: overlap => dispatch(editOverlap(overlap)),
    fetchCharactersList: () => dispatch(fetchCharactersList()),
    deleteOverlap: (name, player) => dispatch(deleteOverlap(name, player)),
})

export default connect(MapStateToProps, MapDispatchToProps)(ProfileOverlap);