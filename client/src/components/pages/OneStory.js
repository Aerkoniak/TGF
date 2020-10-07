import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

// import { parseString } from '../../data/parseString';

import { addChapter, changeSeenInSession, fetchStories, deleteChapter } from '../../data/actions/storiesActions';
import { storiesDB } from '../../data/firebase/firebaseConfig'
import RichEditor from '../RichEditor/RichEditor';



const OneSession = ({ story, player, addChapter, changeSeenInSession, fetchStories, deleteChapter }) => {

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
            })
        return function cleanup() {
            unsubscribe()
        }
    }, [])

    const [intro, showIntro] = useState(true);
    const [textareaHidden, toggleTA] = useState(true);
    const [answerText, setAnswerText] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);

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

            <section className="sideBar">
                <label className="sideBarLabel" htmlFor="">Mistrz Gry:</label>
                <p className="storyAuthor">{story.author.name}</p>
                <label className="sideBarLabel" htmlFor="">Sesja założona:</label>
                <p className="storyDate">{story.startDate}</p>
                <label className="sideBarLabel" htmlFor="">Grający:</label>
                <ul className="storyPlayers">
                    {players}
                </ul>
            </section>
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    changeSeenInSession: (id, refID) => dispatch(changeSeenInSession(id, refID)),
    fetchStories: () => dispatch(fetchStories()),
    deleteChapter: (chapterIndex, refID) => dispatch(deleteChapter(chapterIndex, refID)),
})

export default connect(MapStateToProps, MapDispatchToProps)(OneSession);