import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCharactersList } from '../../data/actions/generalActions';
import {fetchMails} from '../../data/actions/mailsActions';

const ProfileViewer = ({ player, characters, fetchCharactersList, fetchMails }) => {

    useEffect(() => {
        fetchCharactersList();
        fetchMails(player.id);
    }, [])

    const [character, chooseCharObj] = useState(false)

    const chooseCharacter = e => {
        let pickedChar = e.target.id;
        console.log(pickedChar);
        characters.map(character => {
            if (pickedChar === character.name) {
                chooseCharObj(character)
            }
        })
    }

    const charactersList = characters.map((character, index) => ((
        <li className="characterListElement" key={characters + index}>
            <p onClick={chooseCharacter} id={character.name}>{character.name}</p>
        </li>
    )))



    return (
        <>

            <section className="playersList">
                <p className="test">Lista graczy:</p>
                <ul className="charactersList">
                    {charactersList}
                </ul>

            </section>
            <div className={character ? "playersViewer" : "playersViewer hidden"}>
                {character ? <p className="closeViewer" onClick={() => chooseCharObj(false)}>zamknij podgląd</p> : null }
                {character ? <p className="header">{character.name}</p> : null}
                {character ? <p className="mainProfile">{character.profile}</p> : null}
            </div>

        </>
    );
}

const MapStateToProps = state => ({
    characters: state.characters.characters,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        fetchCharactersList: (argument) => dispatch(fetchCharactersList(argument)),
        fetchMails: (id) => dispatch(fetchMails(id))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(ProfileViewer);