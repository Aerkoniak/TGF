import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCharactersList } from '../../data/actions/generalActions';

const ProfileViewer = ({ characters, fetchCharactersList }) => {

    useEffect(() => {
        fetchCharactersList()
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
        <div className="profileViewer">
            <div className="playersList">
                <p className="test">Lista graczy:</p>
                <ul className="charactersList">
                    {charactersList}
                </ul>

            </div>
            <div className="playersViewer">
                {character ? <p className="header">{character.name}</p> : null}
                {character ? <p className="mainProfile">{character.profile}</p> : null}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    characters: state.characters.characters
})

const MapDispatchToProps = dispatch => {
    return {
        fetchCharactersList: (argument) => dispatch(fetchCharactersList(argument))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(ProfileViewer);