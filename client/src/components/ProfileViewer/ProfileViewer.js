import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchCharactersList, updateActive } from '../../data/actions/generalActions';
import { fetchMails } from '../../data/actions/mailsActions';
import { Link } from 'react-router-dom';


const ProfileViewer = ({ player, isLogged, characters, fetchCharactersList, fetchMails, updateActive }) => {

    const [playerLogged, setPlayerLog] = useState(false)

    // useEffect(() => {
    //     if (isLogged === "logged") {
    //         fetchCharactersList();
    //     }
    // }, [isLogged])

    useEffect(() => {
        if (characters.length > 0) {
            setPlayerLog(true);
        }
    }, [characters])

    const [onlinePlayers, setOnlinePlayers] = useState([]);
    const [offlinePlayers, setOfflinePlayers] = useState([]);
    const [offlinePlayersShown, showOfflinePlayers] = useState(false);

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
            <p onClick={chooseCharacter} id={character.name}><Link to={`/characters/id${character.id}/${character.profile[0].name}`}>{character.name}</Link></p>
        </li>
    )))
    const playersOffline = offlinePlayers.map((character, index) => ((
        <li className="characterListElement" key={characters + index}>
            <p onClick={chooseCharacter} id={character.name}><Link to={`/characters/id${character.id}/${character.profile[0].name}`}>{character.name}</Link></p>
        </li>
    )))



    return (
        <>
            <section className="sideBar playersList">
                {playerLogged ?
                    <div className="charactersList">
                        <ul className="online">
                            <h3 className="test">Gracze online:</h3>
                            {playersOnline}
                        </ul>
                        <button className="offlineBtn" onClick={() => showOfflinePlayers(!offlinePlayersShown)}>Pokaż graczy offline</button>
                        {offlinePlayersShown ?
                            <ul className="offline">
                                {playersOffline}
                            </ul>
                            : null}

                    </div>
                    : null}
            </section>

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