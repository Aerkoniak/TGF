import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from 'html-react-parser';


import { changeSeenInPriveSession, fetchPriveStories, addChapter, deleteChapter, deletePlayerFromStory, addingPlayerFromStory,  } from '../../data/actions/priveStoriesActions';
import { priveStoriesDB } from '../../data/firebase/firebaseConfig'
import RichEditor from '../RichEditor/RichEditor';
import ProfileViewer from '../ProfileViewer/ProfileViewer';

const PriveStory = ({ story, player, addChapter, changeSeenInPriveSession, fetchPriveStories, deleteChapter, deletePlayerFromStory, characters, addingPlayerFromStory }) => {


    useEffect(() => {
        story.spectators.map(spectator => {
            if (spectator.id === player.id && !spectator.seen) {
                changeSeenInPriveSession(player.id, story.refID);
            }
        })
    }, [])

    useEffect(() => {
        const unsubscribe = priveStoriesDB.doc(`${story.refID}`)
            .onSnapshot(doc => {
                let data = doc.data();
                fetchPriveStories(player.login)
            })
        return function cleanup() {
            unsubscribe()
        }
    }, [])

    const [intro, showIntro] = useState(true);
    const [textareaHidden, toggleTA] = useState(true);
    const [answerText, setAnswerText] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);
    const [storySummaryVisible, toggleSummaryVisibility] = useState(true);
    const [deletePlayers, toggleDeletePlayers] = useState(false);
    const [addPlayers, toggleAddPlayers] = useState(false);
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [addresseeValue, setAddressee] = useState("");

    useEffect(() => {
        if (player.id === story.author.id && player.rank <= 2) setIsAuthor(true);
    }, [player])

    const submitAnswer = e => {
        e.preventDefault();
        setAnswerText('');
        toggleTA(true);
    }

    const deleteChapterSupporter = e => {
        let chapterIndex = e.target.id;
        let refID = story.refID;
        deleteChapter(chapterIndex, refID)
    }

    const deletePlayersSupporter = e => {
        let deletedPlayer = {};
        deletedPlayer.refID = story.refID;
        deletedPlayer.name = e.target.id;
        deletePlayerFromStory(deletedPlayer);
        toggleDeletePlayers(false);
    }

  

    const searchForPlayer = arg => {
        let charactersArray = characters;
        console.log(charactersArray);
        let searchedPlayerList = [];
        console.log(arg)
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

    const addPlayerSupporter = e => {
        let addedPlayer = {};
        addedPlayer.refID = story.refID;
        addedPlayer.player = seachedPlayersList[0];
        addingPlayerFromStory(addedPlayer);
        toggleAddPlayers(false)
    }

    const chapters = story.chapters.map((chapter, index) => ((
        <div className="chapter" key={chapter.id} >
            <p className="chapterAuthor"  >{chapter.author.name}</p>
            <p className="replyDate">{chapter.replyDate}</p>
            <div className="chapterMsg">{parse(chapter.msg)}</div>
            {player.rank <= 2 ? <p onClick={deleteChapterSupporter} className="deleteChapter" id={index}> x </p> : null}
        </div>
    ))).reverse()

    const players = story.spectators.map((player, index) => {
        if (index == 0) return
        else {
            return (
                <li key={index + player.name}>
                    <p className="playerInStory">{player.name}{deletePlayers ? <span className="deletePlayerSpan" id={player.name} onClick={deletePlayersSupporter}>usuń</span> : null}</p>
                </li>
            )
        }

    })

    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={`${player.name}`} ></option>
    ))

    return (
        <section className="singleStory mainPage">
            <Link className="return" to="/sessions/prive"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <p className="storyTitle">{story.title}</p>
                <span className="nextTurnDateSpan">Termin następnego odpisu:</span>
                <p className="nextTurnDate">{story.nextTurn ? story.nextTurn : null}</p>
                <p className="showIntro" onClick={() => showIntro(!intro)}  >Kliknij by pokazać lub schować wstęp</p>
                {player.rank <= 3 ? <p className="answer" onClick={() => toggleTA(!textareaHidden)} >Odpisz</p> : null}
                {!story.openMsg || story.openMsg === "undefined" ? <h2 onClick={() => toggleTA(!textareaHidden)} className="test">Napisz wprowadzenie do sesji.</h2> :
                    intro ? <p className="openingMsg">{parse(story.openMsg)}</p> : null
                }
                {/* {intro ? <p className="openingMsg">{`${story.openMsg}`}</p> : null} */}
                <form className={textareaHidden ? "answerForm hidden" : "answerForm"} onSubmit={submitAnswer} >

                    <RichEditor action={addChapter} place={story} player={player} isAuthor={isAuthor ? true : false} />
                </form>

            </div>
            <div className="chapters">
                {chapters}
            </div>

            <section className="sideBar inStory">
                <h3 className={storySummaryVisible ? "sideBarOverlap active" : "sideBarOverlap"} onClick={() => toggleSummaryVisibility(true)}  >O sesji: </h3>
                <h3 className={storySummaryVisible ? "sideBarOverlap" : "sideBarOverlap active"} onClick={() => toggleSummaryVisibility(false)} >Lista graczy: </h3>
                {storySummaryVisible ?
                    <div className="storySummary">
                        <label className="sideBarLabel" htmlFor="">Mistrz Gry:</label>
                        <p className="storyAuthor">{story.author.name}</p>
                        <label className="sideBarLabel" htmlFor="">Sesja założona:</label>
                        <p className="storyDate">{story.startDate}</p>
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
                                    console.log(e.target.value);
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
    player: state.player.player,
    characters: state.characters.characters,
})
const MapDispatchToProps = dispatch => ({
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    changeSeenInPriveSession: (id, refID) => dispatch(changeSeenInPriveSession(id, refID)),
    fetchPriveStories: (mail) => dispatch(fetchPriveStories(mail)),
    deleteChapter: (chapterIndex, refID) => dispatch(deleteChapter(chapterIndex, refID)),
    deletePlayerFromStory: player => dispatch(deletePlayerFromStory(player)),
    addingPlayerFromStory: player => dispatch(addingPlayerFromStory(player))
})

export default connect(MapStateToProps, MapDispatchToProps)(PriveStory);