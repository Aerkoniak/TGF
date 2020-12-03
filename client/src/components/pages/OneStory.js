import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from 'html-react-parser';
import { setActiveInterval } from '../../data/usefullFN';

// import { parseString } from '../../data/parseString';

import { changeSeenInSession, fetchStories, deleteChapter, closeStory } from '../../data/actions/storiesActions';
import { updateActive } from '../../data/actions/generalActions'
import { storiesDB } from '../../data/firebase/firebaseConfig'
import ProfileViewer from '../ProfileViewer/ProfileViewer';
import TinyEditor from '../RichEditor/TinyEditor';



const OneSession = ({ story, player, addChapter, changeSeenInSession, fetchStories, deleteChapter, updateActive, closeStory }) => {

    useEffect(() => {
        story.spectators.map(spectator => {
            if (spectator.id === player.id) {
                changeSeenInSession(player.id, story.refID);
                if (!spectator.seen) {
                    changeSeenInSession(player.id, story.refID);
                }
            }
        })
    }, [])

    useEffect(() => {
        const unsubscribe = storiesDB.doc(`${story.refID}`)
            .onSnapshot(doc => {
                let data = doc.data();
                fetchStories()
            });
        return function cleanup() {
            unsubscribe()
        }
    }, [])

    const [intro, showIntro] = useState(true);
    const [textareaHidden, toggleTA] = useState(true);
    const [answerText, setAnswerText] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);
    const [storySummaryVisible, toggleSummaryVisibility] = useState(true)

    useEffect(() => {
        if (player.id === story.author.id && player.rank <= 2) setIsAuthor(true);
    }, [player])

    const submitAnswer = e => {
        e.preventDefault();
        setAnswerText('');
        toggleTA(true);
        updateActive(player)
    }

    const deleteChapterSupporter = e => {
        let chapterIndex = e.target.id;
        let refID = story.refID;
        deleteChapter(chapterIndex, refID)
    }

    const closeStorySupporter = e => {
        e.preventDefault();
        let closedStory = story;
        closeStory(closedStory)
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
                    <p className="playerInStory">{player.name}</p>
                </li>
            )
        }
    })

    return (
        <section className="singleStory mainPage">
            <Link className="return" to="/sessions"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <p className="storyTitle">{story.title}</p>
                {story.place === "4" ? <>
                    <span className="nextTurnDateSpan">Sesja zamknięta:</span>
                    <p className="nextTurnDateSpan">{story.closeTime}</p>
                </> : <>
                        <span className="nextTurnDateSpan">Termin następnego odpisu:</span>
                        <p className="nextTurnDate">{story.nextTurn ? story.nextTurn : null}</p>
                    </>}

                <p className="showIntro" onClick={() => showIntro(!intro)}  >Kliknij by pokazać lub schować wstęp</p>
                {(player.rank <= 3 || player.rank === 10) && story.place != "4" ? <p className="answer" onClick={() => toggleTA(!textareaHidden)} >Odpisz</p> : null}
                {story.place === "4" ? <p className="test">Sesja zamknięta</p> : null}
                {!story.openMsg || story.openMsg === "undefined" ? <h2 onClick={() => toggleTA(!textareaHidden)} className="test">Napisz wprowadzenie do sesji.</h2> :
                    intro ? <p className="openingMsg">{parse(story.openMsg)}</p> : null
                }
                {/* {intro ? <p className="openingMsg">{`${story.openMsg}`}</p> : null} */}
                <form className={textareaHidden ? "answerForm hidden" : "answerForm"} onSubmit={submitAnswer} >
                    <TinyEditor addChapterGlobal={addChapter} place={story} isAuthor={isAuthor ? true : false} />
                    {/* <RichEditor action={addChapter} place={story} player={player} isAuthor={isAuthor ? true : false} /> */}
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
                        {story.place === "4" ? <>
                            <label className="sideBarLabel" htmlFor="">Sesja zakończona:</label>
                            <p className="storyDate">{story.closeTime}</p>
                        </> : null}
                        <label className="sideBarLabel" htmlFor="">Grający:</label>
                        <ul className="storyPlayers">
                            {players}
                        </ul>
                        {player.rank <= 2 ? <button className="closeStory" onClick={closeStorySupporter} >Zakończ sesję</button> : null}
                    </div>
                    :
                    <ProfileViewer />
                }


            </section>
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({

    changeSeenInSession: (id, refID) => dispatch(changeSeenInSession(id, refID)),
    fetchStories: () => dispatch(fetchStories()),
    deleteChapter: (chapterIndex, refID) => dispatch(deleteChapter(chapterIndex, refID)),
    updateActive: player => dispatch(updateActive(player)),
    closeStory: story => dispatch(closeStory(story)),
})

export default connect(MapStateToProps, MapDispatchToProps)(OneSession);