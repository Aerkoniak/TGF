import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { addChapter, changeSeenInSession } from '../../data/actions/storiesActions';

const OneSession = ({ story, player, addChapter, changeSeenInSession }) => {
    useEffect(() => {
        changeSeenInSession(player.id, story.refID)
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



    const addLineBreaks = string => string.split('\n').map((text, index) => {
        return (
            <React.Fragment key={`${text}-${index}`}>
                {text}
                <br />
            </React.Fragment>
        )
    });

    // const editText = string => {
    //     if (string.includes('\n')) {
    //         console.log("spacja");
    //         return (
    //             string.split('\n').map((text, index) => (
    //                 <React.Fragment key={`${text}-${index}`}>
    //                     {text}
    //                     <br />
    //                 </React.Fragment>
    //             )
    //             ))
    //     }

        // } else if (string.includes('<b>')) {
        //     console.log("start pogrubienia");
        //     return (
        //         string.split('<b>').map((text, index) => (
        //             <React.Fragment key={`${text}-${index}`}>
        //                 <strong>
        //                     {text}
        //                 </strong>
        //             </React.Fragment>
        //         )
        //         ))
        // } else if (string.includes('</b>')) {
        //     console.log('koniec pogrubienia');
        //     return (
        //         string.split('<b>').map((text, index) => (
        //             <React.Fragment key={`${text}-${index}`}>
        //                 <strong>
        //                     {text}
        //                 </strong>
        //             </React.Fragment>
        //         )
        //         ))
        // }
    //      else {
    //         return (
    //             <React.Fragment>
    //                 {string}
    //             </React.Fragment>
    //         )
    //     }
    // }


    // const editText = (string) => (
    //     if (string.includes('\n')) {}
    //     string.split('\n').map((text, index) => (
    //         <React.Fragment key={`${text}-${index}`}>
    //             {text}
    //             <br /> 
    //         </React.Fragment>
    //     )),
    //     string.split('<b>').map((text,index) => (
    //         <React.Fragment>
    //             <strong>
    //                 {text}
    //            </strong>
    //         </React.Fragment>
    //     )),
    //     string.split('</b>').map((text,index) => (
    //         <React.Fragment>
    //             <strong>
    //                 {text}
    //            </strong>
    //         </React.Fragment>
    //     ))
    // )

    const chapters = story.chapters.map(chapter => ((
        <div className="chapter" key={chapter.id}  >
            <p className="chapterAuthor"  >{chapter.author.name}</p>
            <p className="chapterMsg">{addLineBreaks(chapter.msg)}</p>

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
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    changeSeenInSession: (id, refID) => dispatch(changeSeenInSession(id, refID)),
})

export default connect(MapStateToProps, MapDispatchToProps)(OneSession);