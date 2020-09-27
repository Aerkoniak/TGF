import React, { useState } from 'react';
import { connect } from 'react-redux'

import { sendMail } from '../../data/actions/mailsActions';
import { parseString } from '../../data/parseString';


const NewMessageCreator = ({ player, characters, sendMail }) => {

    const [addresseeValue, setAddressee] = useState("");
    const [titleValue, setTitle] = useState("");
    const [messageValue, setMessage] = useState("");
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [answerPreview, setAnswerPreview] = useState("")



    const submitNewMessage = (e) => {
        e.preventDefault();
        let message = {};
        message.addreesse = seachedPlayersList[0];
        delete message.addreesse.profile;
        message.sender = player;
        delete message.sender.login;
        message.title = titleValue;
        message.startText = messageValue;
        sendMail(message);
        setAddressee("");
        setTitle("");
        setMessage("");
        setAnswerPreview("");
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
                <input type="text" placeholder="Adresat" className="newMessageAddressee" list="playerListSet" value={addresseeValue} onChange={(e) => {
                    setAddressee(e.target.value);
                    searchForPlayer(addresseeValue)
                }} />
                <datalist id="playerListSet" className="addPlayerDatalist">
                    {playerListSet}
                </datalist>
                <input type="text" placeholder="Tytuł" className="newMessageTitle" value={titleValue} onChange={(e) => setTitle(e.target.value)} />
                <textarea className="newMessageTextarea" value={messageValue} onChange={(e) => setMessage(e.target.value)} ></textarea>
                <button className="mailViewer" onClick={(e) => {
                    e.preventDefault();
                    setAnswerPreview(messageValue)
                }}>Podgląd</button>
                <input type="submit" value="Prześlij" className="newMessageSubmit" />
            </form>
            {answerPreview ? 
                <>
                    <span className="answerPreviewSpan">Tak będzie wyglądać Twoja wiadomość:</span>
                    <p className="answerPreview">{parseString(answerPreview)}</p>
                </>
                    : null}
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