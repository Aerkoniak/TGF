import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCharactersList, updateActive } from '../../data/actions/generalActions';
import { fetchMails } from '../../data/actions/mailsActions';
import parse from 'html-react-parser';


const ProfileViewer = ({ player, isLogged, characters, fetchCharactersList, fetchMails, updateActive }) => {

    const [playerLogged, setPlayerLog] = useState(false)

    useEffect(() => {
        if (isLogged === "logged") {
            fetchCharactersList();
            fetchMails(player.id);
            updateActive(player);
        }
    }, [isLogged])

    useEffect(() => {
        if (characters.length > 0) {
            setPlayerLog(true);
        } 
    }, [characters])

    const [onlinePlayers, setOnlinePlayers] = useState([]);
    const [offlinePlayers, setOfflinePlayers] = useState([]);

    const [character, chooseCharObj] = useState(false)

    const chooseCharacter = e => {
        let pickedChar = e.target.id;
        characters.map(character => {
            if (pickedChar === character.name) {
                chooseCharObj(character)
            }
        })
    }

    useEffect(() => {
        let online = [];
        let offline = [];
        const now = new Date().getTime();
        const tenMinutes = 600000;

        characters.map((character, index) => {
            const offlineTime = character.lastActiveTime + tenMinutes;

            if (now <= offlineTime) {
                online.push(character);
            } else {
                offline.push(character);
            }
            setOnlinePlayers(online);
            setOfflinePlayers(offline);
        })
    }, [characters])

    const playersOnline = onlinePlayers.map((character, index) => ((
        <li className="characterListElement" key={characters + index}>
            <p onClick={chooseCharacter} id={character.name}>{character.name}</p>
        </li>
    )))
    const playersOffline = offlinePlayers.map((character, index) => ((
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
                {playerLogged ?
                    <div className="charactersList">
                        <ul className="online">
                            <h3 className="test">Gracze online:</h3>
                            {playersOnline}
                        </ul>
                        <ul className="offline">
                            <h3 className="test">Gracze offline:</h3>
                            {playersOffline}
                        </ul>
                    </div>
                    : null}



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
    isLogged: state.player.isLogged,
    characters: state.characters.characters,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        fetchCharactersList: (argument) => dispatch(fetchCharactersList(argument)),
        fetchMails: (id) => dispatch(fetchMails(id)),
        updateActive: player => dispatch(updateActive(player)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(ProfileViewer);