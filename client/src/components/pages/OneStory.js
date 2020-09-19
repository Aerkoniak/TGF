import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { addChapter } from '../../data/actions/storiesActions';

const OneSession = ({ story, player, addChapter }) => {

    const [intro, showIntro] = useState(false);
    const [textareaHidden, toggleTA] = useState(true);
    const [answerText, setAnswerText] = useState("");

    const submitAnswer = e => {
        e.preventDefault();
        let chapter = {};
        let author = {};
        author.name = player.name;
        author.id = player.id;
        author.rank = player.rank;

        chapter.author = author;
        chapter.msg = answerText;
        chapter.storyID = story.refID;

        addChapter(chapter)
        setAnswerText('');
        toggleTA(true);
    }



    const chapters = story.chapters.map(chapter => ((
        <div className="chapter" key={chapter.id}  >
            <p className="chapterAuthor"  >{chapter.author.name}</p>
            <p className="chapterMsg">{`${chapter.msg}`}</p>
        </div>
    ))).reverse()

    return (
        <section className="singleStory mainPage">
            <Link className="return" to="/sessions"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <p className="storyTitle">{story.title}</p>
                <p className="storyAuthor">{story.author.name}</p>
                <p className="storyDate">{story.startDate}</p>
                <p className="showIntro" onClick={() => showIntro(!intro)}  >Kliknij by pokazać lub schować wstęp</p>
                <p className="showIntro">Żeby pojawiła się opcja odpisu na sesję wymagane jest nadanie sobie imienia w <strong>KP</strong></p>
                {player.name ? <p className="answer" onClick={() => toggleTA(!textareaHidden)} >Odpisz</p> : null}

                {intro ? <p className="openingMsg">{`${story.openMsg}`}</p> : null}
                <form className={textareaHidden ? "answerForm hidden" : "answerForm"} onSubmit={submitAnswer} >
                    <textarea className="answerField" value={answerText} onChange={(e) => setAnswerText(e.target.value)} ></textarea>
                    <input className="answerSubmit" type="submit" value="Wyślij" />
                </form>
            </div>
            <div className="chapters">
                {chapters}
            </div>



            <section className="notepad">
                <h4 className="note">Notatnik roboczy:</h4>

            </section>
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    addChapter: (chapter) => dispatch(addChapter(chapter))
})

export default connect(MapStateToProps, MapDispatchToProps)(OneSession);