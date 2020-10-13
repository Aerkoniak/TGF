import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCharactersList } from '../../data/actions/generalActions';
import { fetchMails } from '../../data/actions/mailsActions';
import parse from 'html-react-parser';


const ProfileViewer = ({ player, characters, fetchCharactersList, fetchMails }) => {

    useEffect(() => {
        fetchCharactersList();
        fetchMails(player.id);
    }, [])

    const [character, chooseCharObj] = useState(false)

    const chooseCharacter = e => {
        let pickedChar = e.target.id;
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


    const checkRang = (player) => {
        switch (player.rank) {
            case 0:
                return (
                    <p className="rank">Administrator</p>
                )
                break;
            case 2:
                return (
                    <p className="rank">Mistrz Gry</p>
                )
                break;
            case 3:
                return (
                    <p className="rank">Mieszkaniec</p>
                )
                break;
            case 4:
                return (
                    <p className="rank">Przybysz</p>
                )
                break;

            default:
                break;
        }
    }

    return (
        <>
            <section className="sideBar playersList">
                <ul className="charactersList">
                    {charactersList}
                </ul>

            </section>
            <div className={character ? "playersViewer" : "playersViewer hidden"}>
                {character ? <p className="closeViewer" onClick={() => chooseCharObj(false)}>zamknij podgląd</p> : null}
                {character ? <div className="header">
                    <p className="header">{character.name}</p>
                    <p className="header">{checkRang(character)}</p>
                    <p className="header">Rasa: {character.race}</p>
                    <p className="header">Wiek: {character.age}</p>
                    <p className="header">Klasa: {character.class}</p>
                </div> : null}

                {character ? <div className="mainProfile">{parse(character.profile)}</div> : null}
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