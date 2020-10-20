import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import parse from 'html-react-parser';
import RichEditor from '../RichEditor/RichEditor';
import ProfileViewer from '../ProfileViewer/ProfileViewer';

import { sendMailReply, changeSeenInMail, addingPlayerToMail, deletePlayerFromMail } from '../../data/actions/mailsActions';
import { mailsDB } from '../../data/firebase/firebaseConfig';
import { fetchMails } from '../../data/actions/mailsActions';




const OneMail = ({ mail, player, characters, sendMailReply, changeSeenInMail, fetchMails, addingPlayerToMail, deletePlayerFromMail }) => {

    useEffect(() => {
        let counter = 0;
        if (player.id === mail.addreesse.id && !mail.addreesse.read) counter++;
        else if ((mail.sender.id === player.id && !mail.sender.read)) counter++;
        mail.viewers.map(viewer => {
            if (player.id === viewer.id && !viewer.read) counter++;
        })
        if (counter > 0) {
            let id = player.id;
            let refID = mail.mailsDocRef;
            changeSeenInMail(id, refID);
        }
    }, [])

    useEffect(() => {
        const unsubscribe = mailsDB.doc(`${mail.mailsDocRef}`)
            .onSnapshot(doc => {
                let data = doc.data();
                fetchMails(player.login)
            })
        return function cleanup() {
            unsubscribe()
        }
    }, [])

    const [mailFormVisible, toggleMailForm] = useState(false);
    const [storySummaryVisible, toggleSummaryVisibility] = useState(true);
    const [deletePlayers, toggleDeletePlayers] = useState(false);
    const [addPlayers, toggleAddPlayers] = useState(false);
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [addresseeValue, setAddressee] = useState("");

    const submitReply = (e) => {
        e.preventDefault();
        toggleMailForm(false);
    }

    const mailsChapters = mail.records.map(record => ((
        <div className="mailRecord" key={`${record.replyDate}`}>
            <p className="storyAuthor">{record.author.name}</p>
            <p className="storyDate">{record.startDate}</p>
            <div className="recordMsg">{parse(record.msg)}</div>
        </div>
    ))).reverse()


    const deletePlayersSupporter = e => {
        let deletedPlayer = {};
        deletedPlayer.mailsDocRef = mail.mailsDocRef;
        deletedPlayer.name = e.target.id;
        deletePlayerFromMail(deletedPlayer);
        toggleDeletePlayers(false);
    }

    const addPlayerSupporter = e => {
        let addedPlayer = {};
        addedPlayer.mailsDocRef = mail.mailsDocRef;
        addedPlayer.player = seachedPlayersList[0];
        addingPlayerToMail(addedPlayer);
        setAddressee("");
        setPlayersList([]);
        toggleAddPlayers(false)
    }



    const searchForPlayer = arg => {
        let charactersArray = characters;
        let searchedPlayerList = [];
        charactersArray.map(character => {
            let nameCheck = (((character.name).toLowerCase()).includes((arg).toLowerCase()) || (character.id).includes);
            let idCheck = character.id == arg;

            if (nameCheck || idCheck) {
                console.log(character)
                searchedPlayerList.push(character)
            }
        })
        setPlayersList(searchedPlayerList);
    }

    const players = mail.viewers.map((viewer, index) => {

        return (
            <li key={index + viewer.name}>
                <p className="playerInStory">{viewer.name}{deletePlayers ? <span className="deletePlayerSpan" id={viewer.name} onClick={deletePlayersSupporter}>usuń</span> : null}</p>
            </li>
        )

    })
    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={`${player.name}`} ></option>
    ))

    return (
        <section className="singleMail mainPage">
            <Link className="return" to="/mails"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <h2 className="storyTitle">{mail.title}</h2>
            </div>
            <button className="mailReplyButton" onClick={(e) => {
                e.preventDefault();
                toggleMailForm(!mailFormVisible)
            }}>Odpisz</button>

            {mailFormVisible ?
                <div className="mailReply">
                    <form className="mailForm" onSubmit={submitReply}>
                        <RichEditor action={sendMailReply} place={mail} player={player} />
                    </form>
                </div> : null}

            <div className="mailsChapters">
                {mailsChapters}
            </div>
            <p className="storyAuthor">{mail.sender.name}</p>
            <p className="openingMail">{parse(mail.startText)}</p>


            <section className="sideBar inStory">
                <h3 className={storySummaryVisible ? "sideBarOverlap active" : "sideBarOverlap"} onClick={() => toggleSummaryVisibility(true)}  >O sesji: </h3>
                <h3 className={storySummaryVisible ? "sideBarOverlap" : "sideBarOverlap active"} onClick={() => toggleSummaryVisibility(false)} >Lista graczy: </h3>
                {storySummaryVisible ?
                    <div className="storySummary">
                        <label className="sideBarLabel" htmlFor="">Autor:</label>
                        <p className="storyAuthor">{mail.sender.name}</p>
                        <label className="sideBarLabel" htmlFor="">Odbiorca:</label>
                        <p className="storyAuthor">{mail.addreesse.name}</p>
                        <label className="sideBarLabel" htmlFor="">Sesja założona:</label>
                        <p className="storyDate">{mail.startDate}</p>
                        <label className="sideBarLabel" htmlFor="">Grający:</label>
                        <ul className="storyPlayers">
                            {players}
                        </ul>
                        <button className="addDeletePlayers" onClick={(e) => {
                            e.preventDefault();
                            toggleDeletePlayers(!deletePlayers)
                        }}>Włącz usuwanie graczy</button>
                        <button className="addDeletePlayers" onClick={(e) => {
                            e.preventDefault();
                            toggleAddPlayers(!addPlayers)
                        }} >Włącz dodawanie graczy</button>

                        {addPlayers ?
                            <div className="addPlayers">

                                <input type="text" placeholder="Adresat" id="addressee" className="priveRecipients" list="playerListSet" value={addresseeValue} onChange={(e) => {
                                    setAddressee(e.target.value);
                                    searchForPlayer(e.target.value);
                                }} />
                                <datalist id="playerListSet" className="addPlayerDatalist">
                                    {playerListSet}
                                </datalist>
                                <button className="addPLayer" onClick={addPlayerSupporter} >Dodaj gracza do sesji</button>

                            </div>
                            : null}
                    </div>
                    :
                    <ProfileViewer />
                }


            </section>

        </section>
    );
}

const MapStateToProps = state => ({
    msg: state.player.msg,
    player: state.player.player,
    characters: state.characters.characters,
})

const MapDispatchToProps = dispatch => {
    return {
        sendMailReply: (message) => dispatch(sendMailReply(message)),
        changeSeenInMail: (id, refID) => dispatch(changeSeenInMail(id, refID)),
        fetchMails: (mail) => dispatch(fetchMails(mail)),
        addingPlayerToMail: (viewer) => dispatch(addingPlayerToMail(viewer)),
        deletePlayerFromMail: player => dispatch(deletePlayerFromMail(player)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(OneMail);