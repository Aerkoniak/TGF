import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {parseString} from '../../data/parseString';

import { addChapter, changeSeenInSession } from '../../data/actions/storiesActions';

const OneSession = ({ story, player, addChapter, changeSeenInSession }) => {

    useEffect(() => {
        story.spectators.map(spectator => {
                if (spectator.id === player.id) {
                    if (!spectator.seen) {
                       changeSeenInSession(player.id, story.refID)
                    } 
                }
            })
    }, [])

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

        console.log(answerText)

        addChapter(chapter)
        setAnswerText('');
        toggleTA(true);
    }

    // const string = "Cześć Misza,\nmam tu <b>pogrubiony<b> tekst,\nco z tym zrobić możesz?"
    // const array = parseString(string)

   const advancedString = "<b>Cześć<b>,\nTym razem mamy nieco jeszcze bardziej <b>zaawansowany string, który ma w sobie wszystko.\nCzy popsuje Ci on<b> funkcję?";
    // const array = parseString(advancedString)


    const addLineBreaks = string => string.split('\n').map((text, index) => {
        return (
            <React.Fragment key={`${text}-${index}`}>
                {text}
                <br />
            </React.Fragment>
        )
    });

    

    const chapters = story.chapters.map(chapter => ((
        <div className="chapter" key={chapter.id}  >
            <p className="chapterAuthor"  >{chapter.author.name}</p>
            <p className="chapterMsg">{parseString(chapter.msg)}</p>
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
                {/* <p className="test">{parseString(advancedString)}</p> */}
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
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    changeSeenInSession: (id, refID) => dispatch(changeSeenInSession(id, refID)),
})

export default connect(MapStateToProps, MapDispatchToProps)(OneSession);