import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateActive } from '../../data/actions/generalActions';


import ProfileViewer from '../ProfileViewer/ProfileViewer';
// import StoriesCreator from '../StoriesCreator/StoriesCreator';
import { fetchStories } from '../../data/actions/storiesActions';


const SessionPage = ({ stories, player, id, fetchStories, isLogged, priveStories }) => {

    const [storyCreatorActive, setActiveForCreator] = useState(false);
    const [redirectToNewSession, activeRedirect] = useState(false);
    const [storiesArray, setActualArray] = useState([]);

    const [mainStoriesShown, showMainStories] = useState(false)
    const [primaryStoriesShown, showPrimaryStories] = useState(false)
    const [offtopStoriesShown, showOfftopStories] = useState(false)
    const [closedStoriesShown, showClosedStories] = useState(false)

    const [newChapterInPrive, changePriveChapterStatus] = useState(false);

    const [newInMain, setNewInMain] = useState(false);
    const [newInPrimary, setNewInPrimary] = useState(false);
    const [newInOfftop, setNewInOfftop] = useState(false);
    const [newInClosed, setNewInClosed] = useState(false);



    useEffect(() => {
        // fetchStories();
        setActualArray(stories);

    }, [stories])

    useEffect(() => {
        storiesArray.map(story => {
            if (story.place === "1") {
                let newMessage = false;
                story.spectators.map(spec => {
                    if (spec.id === player.id && spec.seen === false) {
                        newMessage = true;
                    }
                });
                if (newMessage) setNewInMain(true);
                else setNewInMain(false)
            } else if (story.place === "2") {
                let newMessage = false;
                story.spectators.map(spec => {
                    if (spec.id === player.id && spec.seen === false) {
                        newMessage = true;
                    }
                });
                if (newMessage) setNewInPrimary(true);
                else setNewInPrimary(false)
            } else if (story.place === "3") {
                let newMessage = false;
                story.spectators.map(spec => {
                    if (spec.id === player.id && spec.seen === false) {
                        newMessage = true;
                    }
                });
                if (newMessage) setNewInOfftop(true);
                else setNewInOfftop(false)
            }
        })
    }, [stories])

    useEffect(() => {
        let counter = 0;
        priveStories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id && !spectator.seen) {
                    counter++
                }
            })
        });
        if (counter > 0) changePriveChapterStatus(true)
        else changePriveChapterStatus(false)
    }, [priveStories])

    useEffect(() => {
        if (id) {
            activeRedirect(!redirectToNewSession)
        }
    }, [id])

    // useEffect(() => {
    //     if (isLogged === "logged") {
    //         updateActive(player)
    //         const myInterval = setInterval(updateActive(player), 300000);
    //         setTimeout(() => {
    //             clearInterval(myInterval);
    //         }, 900000)
    //         return function cleanup() {
    //             clearInterval(myInterval);
    //         }
    //     }
    // }, [isLogged])


    const mainStories = storiesArray.map(story => {
        if (story.place === "1") {
            let newMessage = false;
            story.spectators.map(spec => {
                if (spec.id === player.id && spec.seen === false) {
                    newMessage = true;
                }
            });
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
    const closedStories = storiesArray.map(story => {
        if (story.place === "4") {
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
            <div className={newChapterInPrive ? "privateSessions new" : "privateSessions"}><Link to="/sessions/prive">Sesje prywatne</Link></div>
            {player.rank <= 2 ? <button className="newStory creator" onClick={(e) => {
                e.preventDefault();
                setActiveForCreator(!storyCreatorActive)
            }} >Stwórz nową sesję globalną</button> : null}
            {/* {storyCreatorActive ? <StoriesCreator /> : null} */}
            <div className="storyLink">
                <p className="linkAuthor">Autor sesji:</p>
                <p className="linkTitle">Tytuł:</p>
                <p className="linkDate">Termin:</p>
            </div>
            <div className="mainStories subsection">
                <h3 className="test">Sesje organizacyjne:<span onClick={() => showMainStories(!mainStoriesShown)} className={newInMain ? "showStories new" : "showStories"}>pokaż dostępne sesje</span></h3>

                {mainStoriesShown ? mainStories : null}
            </div>
            <div className="primaryStories subsection">
                <h3 className="test">Sesje pomocnicze:<span onClick={() => showPrimaryStories(!primaryStoriesShown)} className={newInPrimary ? "showStories new" : "showStories"}>pokaż dostępne sesje</span></h3>

                {primaryStoriesShown ? primaryStories : null}

            </div>
            <div className="offtopStories subsection">
                <h3 className="test">Sesje offtopowe:<span onClick={() => showOfftopStories(!offtopStoriesShown)} className={newInOfftop ? "showStories new" : "showStories"}>pokaż dostępne sesje</span></h3>
                {offtopStoriesShown ? offtopStories : null}
            </div>
            <div className="closedStories subsection">
                <h3 className="test">Sesje zamknięte: <span onClick={() => showClosedStories(!closedStoriesShown)} className={newInClosed ? "showStories new" : "showStories"}>pokaż zamknięte sesje</span> </h3>
                {closedStoriesShown ? closedStories : null}
            </div>


            <ProfileViewer />
            {redirectToNewSession ? <Redirect to={`/sessions/id${id}`} /> : null}
        </section>
    );
}

const MapStateToProps = state => ({
    stories: state.stories.stories,
    player: state.player.player,
    id: state.stories.id,
    isLogged: state.player.isLogged,
    priveStories: state.stories.priveStories,
})
const MapDispatchToProps = dispatch => ({
    fetchStories: () => dispatch(fetchStories())
})

export default connect(MapStateToProps, MapDispatchToProps)(SessionPage);