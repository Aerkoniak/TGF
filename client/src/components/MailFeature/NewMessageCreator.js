import React, { useState } from 'react';
import { connect } from 'react-redux'

import { sendMail } from '../../data/slices/mailsSlice';
import TinyEditor from '../RichEditor/TinyEditor';



const NewMessageCreator = ({ player, characters, sendMail, type }) => {

    const [addresseeValue, setAddressee] = useState("");
    const [titleValue, setTitle] = useState("");
    const [messageValue, setMessage] = useState("");
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [answerPreview, setAnswerPreview] = useState("")



    const submitNewMessage = (e) => {
        e.preventDefault();

        setAddressee("");
        setTitle("");
        setMessage("");
        setAnswerPreview("");
        setPlayersList([]);
    }



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

    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={player.name}></option>
    ))

    return (
        <>
            <form className="newMessageCreatorForm" onSubmit={submitNewMessage}>
                <input type="text" value={`Typ wiadomości - ${type}`} className="newMessageTitle" style={{ borderColor: "red" }} disabled />
                <input type="text" placeholder="Adresat" className="newMessageAddressee" list="playerListSet" value={addresseeValue} onChange={(e) => {
                    setAddressee(e.target.value);
                    searchForPlayer(addresseeValue)
                }} />
                <datalist id="playerListSet" className="addPlayerDatalist">
                    {playerListSet}
                </datalist>
                <input type="text" placeholder="Tytuł" className="newMessageTitle" value={titleValue} onChange={(e) => setTitle(e.target.value)} />

                <TinyEditor sendMail={sendMail} addreesse={seachedPlayersList[0]} title={titleValue} />

            </form>
        </>
    );
}

const MapStateToProps = state => ({
    characters: state.characters.characters,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        sendMail: (message) => dispatch(sendMail(message))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(NewMessageCreator);