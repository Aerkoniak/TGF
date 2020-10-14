import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import StoriesCreator from '../StoriesCreator/StoriesCreator';


const SessionPage = ({ stories, player, id }) => {

    const [storyCreatorActive, setActiveForCreator] = useState(false);
    const [redirectToNewSession, activeRedirect] = useState(false);
    const [storiesArray, setActualArray] = useState([]);

    useEffect(() => {
        setActualArray(stories)
    }, [stories])

    useEffect(() => {
        if (id) {
            activeRedirect(!redirectToNewSession)
        }
    }, [id])

    // const storiesLinks = stories.map(story => {
    //     let newMessage = false;
    //     story.spectators.map(spec => {
    //         if (spec.id === player.id && spec.seen === false) newMessage = true
    //     })
    //     return (
    //         <div className="storyLink" key={story.id}>
    //             <p className="linkAuthor">{story.author.name}</p>
    //             <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
    //             <p className="linkDate">{story.startDate}</p>
    //         </div>
    //     )
    // }
    // ).reverse()

    const mainStories = storiesArray.map(story => {
        if (!story.isReady) return null
        else if (story.place === "1") {
            let newMessage = false;
            story.spectators.map(spec => {
                if (spec.id === player.id && spec.seen === false) newMessage = true
            })
            return (
                <div className="storyLink" key={story.id}>
                    <p className="linkAuthor">{story.author.name}</p>
                    <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
                    <p className="linkDate">{story.nextTurn}</p>
                </div>
            )
        }
    })
    const primaryStories = storiesArray.map(story => {
        if (!story.isReady) return null
        else if (story.place === "2") {
            let newMessage = false;
            story.spectators.map(spec => {
                if (spec.id === player.id && spec.seen === false) newMessage = true
            })
            return (
                <div className="storyLink" key={story.id}>
                    <p className="linkAuthor">{story.author.name}</p>
                    <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
                    <p className="linkDate">{story.nextTurn}</p>
                </div>
            )
        }
    })
    const offtopStories = storiesArray.map(story => {
        if (!story.isReady) return null
        else if (story.place === "3") {
            let newMessage = false;
            story.spectators.map(spec => {
                if (spec.id === player.id && spec.seen === false) newMessage = true
            })
            return (
                <div className="storyLink" key={story.id}>
                    <p className="linkAuthor">{story.author.name}</p>
                    <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
                    <p className="linkDate">{story.nextTurn}</p>
                </div>
            )
        }
    })

    return (
        <section className="sessionPage mainPage">
            <div className="privateSessions"><Link to="/sessions/prive">Sesje prywatne</Link></div>
            {player.rank <= 2 ? <button className="newStory creator" onClick={(e) => {
                e.preventDefault();
                setActiveForCreator(!storyCreatorActive)
            }} >Stwórz nową sesję globalną</button> : null}
            {storyCreatorActive ? <StoriesCreator /> : null}
            <h2 className="test">Dział sesji globalnych:</h2>
            <div className="storyLink">
                <p className="linkAuthor">Autor sesji:</p>
                <p className="linkTitle">Tytuł:</p>
                <p className="linkDate">Termin:</p>
            </div>
            <div className="mainStories">
                <h3 className="test">Sesje organizacyjne:</h3>
                {mainStories}
            </div>
            <div className="primaryStories">
                <h3 className="test">Sesje pomocnicze:</h3>
                {primaryStories}
            </div>
            <div className="offtopStories">
                <h3 className="test">Sesje offtopowe:</h3>
                {offtopStories}
            </div>
            

            <ProfileViewer />
            {redirectToNewSession ? <Redirect to={`/sessions/id${id}`} /> : null}
        </section>
    );
}

const MapStateToProps = state => ({
    stories: state.stories.stories,
    player: state.player.player,
    id: state.stories.id
})

export default connect(MapStateToProps)(SessionPage);