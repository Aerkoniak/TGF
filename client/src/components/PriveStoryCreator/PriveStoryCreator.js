import React, { useState } from 'react';
import { connect } from 'react-redux';
import RichEditor from '../RichEditor/RichEditor';

const PriveStoryCreator = ({ player, characters }) => {


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

    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={player.name}></option>
    ))
    const playersInside = playersInSession.map((player, index) => ((
        <p className="inside"> - {player.name} - <span id={index} onClick={e => console.log(e.target.id)}>usuń</span></p>
    )))

    return (
        <form className="priveStoryCreator" onSubmit={e => e.preventDefault()}>
            {/* <h2 className="test">Kreator sesji prywatnej</h2> */}
            <label htmlFor="titleForStory" className="titleForStory" >Nadaj tytuł sesji:</label>
            <input type="text" id="titleForStory" className="titleForStoryInput" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />

            <label htmlFor="addressee">Dodaj gracza do sesji</label>
            <input type="text" placeholder="Adresat" id="addressee" className="newMessageAddressee" list="playerListSet" value={addresseeValue} onChange={(e) => {
                setAddressee(e.target.value);
                searchForPlayer(addresseeValue)
            }} />
            <datalist id="playerListSet" className="addPlayerDatalist">
                {playerListSet}
            </datalist>
            <button className="addPLayer" onClick={addPlayer} >Dodaj gracza do sesji</button>

            {playersInSession ? <div className="players">Gracze w sesji: {playersInside}</div> : null}


            <RichEditor priveStoryCreator title={titleValue} action={(arg) => console.log(arg)} />
        </form>
    );
}

const MapStateToProps = state => ({
    characters: state.characters.characters,
    player: state.player.player
})

export default connect(MapStateToProps)(PriveStoryCreator);