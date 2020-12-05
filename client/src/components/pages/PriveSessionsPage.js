import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import styles from '../../css/priveStories.module.css'

import { Accordion, Card } from 'react-bootstrap'

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import PriveStoryCreator from '../priveStories/PriveStoryCreator';

const PriveSessionsPage = ({ player, id, priveStories, isLogged }) => {

    const [redirectToNewSession, activeRedirect] = useState(false);
    const [priveCreatorActive, setPriveCreator] = useState(false);
    const [priveStoriesArray, setPriveStories] = useState([]);
    const [newStory, addNewStory] = useState(false);


    useEffect(() => {
        if (id) {
            setPriveCreator(false)
            activeRedirect(!redirectToNewSession)
        }
    }, [id])

    useEffect(() => {
        if (priveStories) {
            setPriveStories(priveStories)
        }
    }, [priveStories])

    // useEffect(() => {

    // }, [isLogged])

    const priveStoriesLinks = priveStoriesArray.map(priveLink => {
        if (!priveLink.closed) {
            let newMessage = false;
            priveLink.spectators.map(spectator => {
                if (spectator.id === player.id && spectator.seen === false) newMessage = true
            })
            return (
                <div className="storyLink" key={priveLink.id}>
                    <p className="linkAuthor">{priveLink.author.name}</p>
                    <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={priveLink.id} to={`/sessions/prive/id${priveLink.id}`}>{priveLink.title}</Link>
                    <p className="linkDate">{priveLink.startDate}</p>
                </div>
            )
        }
    })
    const closedPriveStories = priveStoriesArray.map(story => {
        if (story.closed) {
            let newMessage = false;
            story.spectators.map(spectator => {
                if (spectator.id === player.id && spectator.seen === false) newMessage = true
            })
            return (
                <div className="storyLink" key={story.id}>
                    <p className="linkAuthor">{story.author.name}</p>
                    <Link className={newMessage ? "linkTitle new" : "linkTitle"} id={story.id} to={`/sessions/prive/id${story.id}`}>{story.title}</Link>
                    <p className="linkDate">{story.closeTime}</p>
                </div>
            )
        }
    })

    return (
        <section className={styles.main}>
            <Accordion activeKey={newStory ? `0` : false}>
                <Card>
                    <Accordion.Toggle className={styles.addStory} as={Card.Header} onClick={() => addNewStory(!newStory)} eventKey="0">
                        Napisz nową wiadomość
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <PriveStoryCreator />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>



            <h2 className="test">Aktywne:</h2>
            <div className="storyLink">
                <p className="linkAuthor">Autor sesji:</p>
                <p className="linkTitle">Tytuł:</p>
                <p className="linkDate">Data startu:</p>
            </div>
            {priveStoriesLinks}

            <Accordion>
                <Card>
                    <Accordion.Toggle className={styles.addStory} as={Card.Header} eventKey="0">
                        Sesje archiwalne
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <div className="storyLink">
                                <p className="linkAuthor">Autor sesji:</p>
                                <p className="linkTitle">Tytuł:</p>
                                <p className="linkDate">Zamknięta:</p>
                            </div>
                            {closedPriveStories}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

            {redirectToNewSession ? <Redirect to={`/sessions/prive/id${id}`} /> : null}

            <ProfileViewer />
        </section>
    );
}
const MapStateToProps = state => ({
    player: state.player.player,
    id: state.stories.id,
    priveStories: state.stories.priveStories,
    isLogged: state.player.isLogged
})

export default connect(MapStateToProps)(PriveSessionsPage);