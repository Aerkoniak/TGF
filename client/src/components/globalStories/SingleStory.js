import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import styles from '../../css/stories.module.css';
import { Accordion, Card, Carousel, Alert, Button } from 'react-bootstrap'

import { storiesDB } from '../../data/firebase/firebaseConfig'
import { fetchGlobalStories, selectSend, addChapter, deleteChapter, changeSeenInSession, closeStory, editChapter, toggleObserve } from '../../data/slices/globalStoriesSlice';
import { downloadStory } from '../../data/slices/priveStoriesSlice';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import TinyEditor from '../RichEditor/TinyEditor';

const SingleStory = ({ player, story, fetchGlobalStories, addChapter, deleteChapter, changeSeenInSession, closeStory, editChapter, downloadStory, toggleObserve }) => {

    const [unSeen, confirmSeen] = useState(false);

    const isSend = useSelector(selectSend);
    const [InfoIndex, setIndex] = useState(0);
    const [isAuthor, confirmAuthor] = useState(false);
    const [newChapter, setNewChapter] = useState(false);
    const [recordBeforeEdit, editRecord] = useState(false);
    const [playerIsSpectator, confirmSpectating] = useState(false)

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        if (!unSeen) {
            story.spectators.map(spectator => {
                if (spectator.id === player.id && !spectator.seen) {
                    changeSeenInSession(player.id, story.refID);
                    confirmSeen(true)
                }
            })
        }
    }, [story])

    useEffect(() => {
        let flag = false;
        story.spectators.map(spectator => {
            if (spectator.id === player.id) {
                // confirmSpectating(true)
                flag = true;
            }
        })
        if (flag) confirmSpectating(true)
        else confirmSpectating(false)
    }, [story])

    useEffect(() => {
        if (player.id === story.author.id) confirmAuthor(true)
        else confirmAuthor(false)
    }, [story])

    useEffect(() => {
        if (isSend) setNewChapter(false)
        else {
            if (isSend) setNewChapter(false)
        }
    }, [isSend])

    useEffect(() => {
        console.log("SingleStory - useEffect - onSnapshot - req")
        const unsubscribe = storiesDB.doc(`${story.refID}`)
            .onSnapshot(doc => {
                console.log("SingleStory - useEffect - onSnapshot - response & fetch")
                fetchGlobalStories()
            });
        return function cleanup() {
            unsubscribe()
        }
    }, [isSend])

    const deleteChapterSupporter = e => {
        let chapterIndex = e.target.id;
        let refID = story.refID;
        deleteChapter(chapterIndex, refID)
    }
    const editChapterSupporter = e => {
        e.preventDefault();
        let index = Number(e.target.id);
        let chaptersList = [...story.chapters];
        // console.log(index)
        editRecord(chaptersList[index]);
        setNewChapter(true);
    }

    const closeStorySupporter = e => {
        e.preventDefault();
        let closedStory = story;
        let shutting = {
            id: player.id,
            name: player.name
        }
        closeStory(closedStory, shutting)
    }

    const CloseStoryAlert = () => {
        const [show, setShow] = useState(false);

        if (show) {
            return (
                <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Czy na pewno chcesz zamknąć sesję?</Alert.Heading>
                    <Button className={styles.confirmClosing} onClick={closeStorySupporter} variant="outline-danger">Zamknij sesję</Button>
                </Alert>
            );
        }
        return <Button className={styles.closeStoryBtn} variant="danger" onClick={() => setShow(true)}>Zamknij sesję</Button>;
    }
    const DeleteChapterAlert = ({ index }) => {
        const [show, setShow] = useState(false);

        if (show) {
            return (
                <Alert className={styles.deleteChapterConfirmation} variant="warning" onClose={() => setShow(false)} dismissible>
                    {/* <Alert.Heading>Czy na pewno chcesz usunąć wpis?</Alert.Heading> */}
                    <Button onClick={deleteChapterSupporter} id={index} className={styles.deleteChapterBtn} variant="outline-danger">Usuń wpis</Button>
                </Alert>
            );
        }
        return <p onClick={() => setShow(true)} className={styles.deleteChapter} id={index}> x </p>;
    }

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



    const Chapters = ({ chapters }) => {

        const Chapter = ({ chapter, index }) => {

            const [history, toggleHistory] = useState(false);
            const [historyArray, setArray] = useState([]);
            useEffect(() => {
                if (chapter.recordHistory) {
                    setArray(chapter.recordHistory)
                }
            })
            const records = historyArray.map((rec, index) => {
                let number = index + 1;
                return (
                    <div id={index} className={styles.prevVersion}>
                        <span>{`Wersja numer ${number}:`}</span><span>{parse(rec)}</span>
                    </div>
                )
            })

            return (
                <div className={styles.chapter} key={chapter.id} >
                    <p className={styles.chapterAuthor}  >{chapter.author.name}</p>
                    <p className={styles.replyDate}>{chapter.replyDate}</p>
                    <div className={styles.chapterMsg}>{parse(chapter.msg)}</div>
                    {/* {player.rank <= 2 ? <p onClick={deleteChapterSupporter} className={styles.deleteChapter} id={index}> x </p> : null} */}

                    {player.id === story.author.id || player.rank <= 2 || player.id === chapter.author.id ? <p onClick={editChapterSupporter} className={styles.editChapter} id={index}> ... </p> : null}

                    {(player.id === story.author.id || player.id === chapter.author.id) && chapter.hiddenContent ? <p className={styles.hiddenContent}>{chapter.hiddenContent}</p> : null}

                    {chapter.lastEdit ? <p className={styles.editedInfo}>{`Edytowano: ${chapter.lastEdit.when} przez gracza ${chapter.lastEdit.name}`}</p> : null}

                    { player.id === story.author.id || player.rank <= 2 || player.id === chapter.author.id ? <DeleteChapterAlert index={index} /> : null}

                    {chapter.lastEdit ? <p onClick={() => {
                        toggleHistory(!history)
                    }} className={styles.showHistory}>pokaż historię edycji</p> : null}

                    {history ? <div className={styles.history}>
                        {records}
                    </div> : null}
                </div>
            )
        }

        const chapterRecords = chapters.map((chapter, index) => {
            return (
                <>
                    <Chapter chapter={chapter} index={index} />
                </>
            )
        }).reverse()

        return (
            <>
                { chapterRecords}
            </>
        )
    }
    // className={styles.InfoSlide}
    const downloadStorySupporter = () => {
        downloadStory(story.refID, "global")
    }
    const toggleObserveSupporter = () => {
        toggleObserve(player, story)
    }


    return (
        <section className={styles.main}>
            <div>
                <Carousel activeIndex={InfoIndex} onSelect={handleSelect} interval={null} >
                    <Carousel.Item>
                        <img src="" alt=""
                            style={{ backgroundColor: "grey", width: "100%", minHeight: "30vh" }}
                        />
                        <Carousel.Caption>
                            <p className="storyTitle">{story.title}</p>
                            {story.place === "4" ? <>
                                <span className="nextTurnDateSpan">Sesja zamknięta:</span>
                                <p className="nextTurnDateSpan">{story.closeTime}</p>
                                <span className="nextTurnDateSpan">{` przez ${story.shutting.name}`}</span>
                            </> : <>
                                    <span className="nextTurnDateSpan">Termin następnego odpisu:</span>
                                    <p className="nextTurnDate">{story.nextTurn ? story.nextTurn : null}</p>
                                    {player.rank <= 2 ? <CloseStoryAlert /> : null}
                                </>}
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="" alt=""
                            style={{ backgroundColor: "grey", width: "100%", minHeight: "30vh" }}
                        />
                        <Carousel.Caption>
                            <p className="storyAuthor">{`Prowadzący: ${story.author.name}`}</p>
                            <p className="storyStart">{`Sesja założona: ${story.startDate}`}</p>
                            <div className={styles.storyPlayers}>
                                <ul className={styles.storyPlayers}>
                                    {players}
                                </ul>
                            </div>
                            {playerIsSpectator ?
                                <Button onClick={toggleObserveSupporter}>Przestań obserwować</Button>
                                :
                                <Button onClick={toggleObserveSupporter}>Obserwuj opowieść</Button>}
                            <Button onClick={downloadStorySupporter}>Pobierz sesję</Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className="storyIntro">
                <Accordion>
                    <Card>
                        <Accordion.Toggle className={styles.addStory} as={Card.Header} eventKey="0">
                            Pokaż rozpoczęcie
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>{parse(story.openMsg)}</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
            <div className="addReply">
                <Accordion activeKey={newChapter ? `0` : false} >
                    <Card>
                        <Accordion.Toggle className={styles.addStory} as={Card.Header} eventKey="0" onClick={() => setNewChapter(!newChapter)} >
                            Napisz odpowiedź
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <TinyEditor addChapterGlobal={addChapter} place={story}
                                    isAuthor={isAuthor ? true : false}
                                    withHiddenContent
                                    recordBefore={recordBeforeEdit ? recordBeforeEdit : false}
                                    initialValue={recordBeforeEdit ? recordBeforeEdit.msg : false}
                                    editChapter={editChapter} />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
            <div className="chapters">
                <Chapters chapters={story.chapters} />
            </div>
            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    fetchGlobalStories: () => dispatch(fetchGlobalStories()),
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    deleteChapter: (index, ID) => dispatch(deleteChapter(index, ID)),
    changeSeenInSession: (id, refID) => dispatch(changeSeenInSession(id, refID)),
    closeStory: (story, shutting) => dispatch(closeStory(story, shutting)),
    editChapter: (chapter) => dispatch(editChapter(chapter)),
    downloadStory: (refID, type) => dispatch(downloadStory(refID, type)),
    toggleObserve: (player, story) => dispatch(toggleObserve(player, story))
})

export default connect(MapStateToProps, MapDispatchToProps)(SingleStory);