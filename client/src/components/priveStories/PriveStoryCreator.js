import React, { useState } from 'react';
import { connect } from 'react-redux';

import { createPriveStory } from '../../data/actions/priveStoriesActions';
import TinyEditor from '../RichEditor/TinyEditor';

const PriveStoryCreator = ({ player, characters, createPriveStory }) => {


    const [titleValue, setTitleValue] = useState("");

    const [seachedPlayersList, setPlayersList] = useState([]);
    const [addresseeValue, setAddressee] = useState("");
    const [playersInSession, setPlayers] = useState([]);

    const searchForPlayer = arg => {
        let charactersArray = characters;
        let searchedPlayerList = [];

        charactersArray.map(character => {
            let nameCheck = (((character.name).toLowerCase()).includes((arg).toLowerCase()) || (character.id).includes);
            let idCheck = character.id == arg;

            if (nameCheck || idCheck) {
                searchedPlayerList.push(character)
            }
        })
        setPlayersList(searchedPlayerList);
    }
    const addPlayer = (e) => {
        e.preventDefault();
        let insideSession = playersInSession;
        insideSession.push(seachedPlayersList[0]);
        setAddressee("")
        setPlayersList([]);
        setPlayers(insideSession);
    }

    const removePlayer = e => {
        let players = playersInSession;
        let index = e.target.id;
        players.splice(index, 1);
        setPlayersList([]);
        setPlayers(players);
    }

    const submitPriveStory = e => {
        e.preventDefault();
        setAddressee("")
        setPlayersList([]);
        setTitleValue("");
        setPlayers([]);
    }


    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={`${player.name}`} ></option>
    ))
    const playersInside = playersInSession.map((player, index) => ((
        <p className="inside"> - {player.name} - <span id={index} onClick={removePlayer}>usuń</span></p>
    )))

    return (
        <form className="priveStoryCreator" onSubmit={submitPriveStory}>
            {/* <h2 className="test">Kreator sesji prywatnej</h2> */}
            <label htmlFor="titleForStory" className="titleForStory" >Nadaj tytuł sesji:</label>
            <input type="text" id="titleForStory" className="titleForStoryInput" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />

            <label htmlFor="addressee">Dodaj gracza do sesji</label>
            <input type="text" placeholder="Adresat" id="addressee" className="priveRecipients" list="playerListSet" value={addresseeValue} onChange={(e) => {
                setAddressee(`${e.target.value}`);
                searchForPlayer(addresseeValue)
            }} />
            <datalist id="playerListSet" className="addPlayerDatalist">
                {playerListSet}
            </datalist>
            <button className="addPLayer" onClick={addPlayer} >Dodaj gracza do sesji</button>

            {playersInSession ? <div className="players">Gracze w sesji: {playersInside}</div> : null}

            <TinyEditor priveStoryCreator title={titleValue} playersInSession={playersInSession} createPriveStory={createPriveStory} />

            {/* <RichEditor priveStoryCreator title={titleValue} playersInSession={playersInSession} action={createPriveStory} /> */}
        </form>
    );
}

const MapStateToProps = state => ({
    characters: state.characters.characters,
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    createPriveStory: story => dispatch(createPriveStory(story))
})

export default connect(MapStateToProps, MapDispatchToProps)(PriveStoryCreator);