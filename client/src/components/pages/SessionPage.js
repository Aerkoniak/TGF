import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const SessionPage = ({ stories, player }) => {

    const [newMessage, changeMessegeState] = useState(false);

    useEffect(() => {
        stories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id) {
                    if (!spectator.seen) {
                        changeMessegeState(true)
                    }
                }
            })
        })
    })


    const storiesLinks = stories.map(story => (
        <div className="storyLink" key={story.id}>
            <p className="linkAuthor">{story.author.name}</p>
            <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/id${story.id}`}>{story.title}</Link>
            <p className="linkDate">{story.startDate}</p>
        </div>

    ))

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
            <section className="notepad">
                <h4 className="note">Notatnik roboczy:</h4>
                <p className="test">Podzielone na dwa typy: sesje fabularne ogólne oraz sesje prywatne.</p>
                <p className="test">Dla wygody czytania odpisy w sesjach wyświetlane bedą w kolejności: ostatnie u góry.</p>
                <p className="test">Zastanówcie się jakie filtry wyświetlania i wyszukiwania sesji były fajne i przydatne.</p>
            </section>

        </section>
    );
}

const MapStateToProps = state => ({
    stories: state.stories.stories,
    player: state.player.player
})

export default connect(MapStateToProps)(SessionPage);