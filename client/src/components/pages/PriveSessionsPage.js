import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import PriveStoryCreator from '../PriveStoryCreator/PriveStoryCreator';

const PriveSessionsPage = ({ player, id, priveStories }) => {

    const [redirectToNewSession, activeRedirect] = useState(false);

    const [priveCreatorActive, setPriveCreator] = useState(false);

    useEffect(() => {
        if (id) {
            activeRedirect(!redirectToNewSession)
        }
    }, [id])

    const priveStoriesLinks = priveStories.map(priveLink => {
        let newMessage = false;
        priveLink.players.map(spectator => {
            if (spectator.id === player.id && spectator.seen === false) newMessage = true
        })
        return (
            <div className="storyLink" key={priveLink.id}>
                <p className="linkAuthor">{priveLink.author.name}</p>
                <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={priveLink.id} to={`/sessions/prive/id${priveLink.id}`}>{priveLink.title}</Link>
                <p className="linkDate">{priveLink.nextTurn}</p>
            </div>
        )
    })

    return (
        <section className="mainPage priveSessionPage">
            <button className="newStory creator" onClick={(e) => {
                e.preventDefault();
                setPriveCreator(!priveCreatorActive)
            }} >Stwórz nową sesję prywatną</button>
            {priveCreatorActive ? <PriveStoryCreator /> : null}

            {priveStoriesLinks}

            {redirectToNewSession ? <Redirect to={`/sessions/id${id}`} /> : null}

            <ProfileViewer />
        </section>
    );
}
const MapStateToProps = state => ({
    player: state.player.player,
    id: state.stories.id,
    priveStories: state.stories.priveStories,
})

export default connect(MapStateToProps)(PriveSessionsPage);