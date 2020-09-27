import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfileViewer from '../ProfileViewer/ProfileViewer';


const SessionPage = ({ stories, player }) => {


    const storiesLinks = stories.map(story => {
        let newMessage = false;
        story.spectators.map(spec => {
            if (spec.id === player.id && spec.seen === false) newMessage = true
        })
        return (
            <div className="storyLink" key={story.id}>
                <p className="linkAuthor">{story.author.name}</p>
                <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
                <p className="linkDate">{story.startDate}</p>
            </div>
        )}
    )

    return (
        <section className="sessionPage mainPage">
            <h4 className="note">Sesje wszelakie</h4>
            <div className="storyLink">
                <p className="linkAuthor">Autor sesji:</p>
                <p className="linkTitle">Tytuł:</p>
                <p className="linkDate">Założona:</p>
            </div>
            {storiesLinks}

            <p className="test"></p>
            <p className="test"></p>
            <ProfileViewer />


        </section>
    );
}

const MapStateToProps = state => ({
    stories: state.stories.stories,
    player: state.player.player
})

export default connect(MapStateToProps)(SessionPage);