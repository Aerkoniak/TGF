import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import parse from 'html-react-parser';

import styles from '../../css/stories.module.css';
import { Carousel, Accordion, Card, Alert, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { addChapter, fetchPriveStories, selectSend, closePrive, deleteChapter, editChapter, deletePlayerFromStory, downloadStory } from '../../data/slices/priveStoriesSlice';
// 


import { changeSeenInPriveSession, addingPlayerFromStory } from '../../data/actions/priveStoriesActions';
import { updateActive } from '../../data/actions/generalActions';
import { priveStoriesDB } from '../../data/firebase/firebaseConfig'
import ProfileViewer from '../ProfileViewer/ProfileViewer';
// import { setActiveInterval } from '../../data/usefullFN';
import TinyEditor from '../RichEditor/TinyEditor';

const SinglePrive = ({ story, player, addChapter, changeSeenInPriveSession, fetchPriveStories, deleteChapter, deletePlayerFromStory, characters, addingPlayerFromStory, editChapter, closePrive, downloadStory }) => {
    const isSend = useSelector(selectSend);
    const [InfoIndex, setIndex] = useState(0);
    const [newChapter, setNewChapter] = useState(false);
    const [recordBeforeEdit, editRecord] = useState(false);
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [addresseeValue, setAddressee] = useState("");

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        const unsubscribe = priveStoriesDB.doc(`${story.refID}`)
            .onSnapshot(doc => {
                console.log("PriveStory - useEffect - onSnapshot")
                let data = doc.data();
                fetchPriveStories(player.id)
            })

        return function cleanup() {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (isSend) setNewChapter(false)
        else {
            if (isSend) setNewChapter(false)
        }
    }, [isSend])

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

    const deleteChapterSupporter = e => {
        let chapterIndex = e.target.id;
        let refID = story.refID;
        deleteChapter(chapterIndex, refID)
    }
    const editChapterSupporter = e => {
        e.preventDefault();
        let index = Number(e.target.id);
        let chaptersList = [...story.chapters];
        console.log(index)
        editRecord(chaptersList[index]);
        setNewChapter(true);
    }
    const closeStorySupporter = e => {
        e.preventDefault();
        let closedStory = story;

        closePrive(closedStory)
    }

    const searchForPlayer = arg => {
        let charactersArray = characters;
        let searchedPlayerList = [];
        charactersArray.map(character => {
            let nameCheck = (((character.name).toLowerCase()).includes((arg).toLowerCase()) || (character.id).includes);
            let idCheck = character.id == arg;

            if (nameCheck || idCheck) {
                searchedPlayerList.push(character)
            }
        })
        setPlayersList(searchedPlayerList);
    }

    const addPlayerSupporter = e => {
        let addedPlayer = {};
        addedPlayer.refID = story.refID;
        addedPlayer.player = seachedPlayersList[0];
        addingPlayerFromStory(addedPlayer);
        setAddressee("")
    }
    const deletePlayersSupporter = e => {
        let deletedPlayer = {};
        deletedPlayer.refID = story.refID;
        deletedPlayer.name = e.target.id;
        deletePlayerFromStory(deletedPlayer);
    }

    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={`${player.name}`} ></option>
    ))

    const players = story.spectators.map((playerInStory, index) => {
        if (index == 0) return;
        else {
            const popover = (
                <Popover id="popover-basic">
                    {/* <Popover.Title as="h3">Opcje</Popover.Title> */}
                    <Popover.Content>
                        <Button variant="outline-danger" id={playerInStory.name} onClick={deletePlayersSupporter} >Usuń</Button>
                    </Popover.Content>
                </Popover>
            );
            if (player.id === story.author.id) {

                return (
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                        <Button key={index + playerInStory.name} variant="outline-light">{playerInStory.name}</Button>
                    </OverlayTrigger>
                )
            } else {
                return (
                    <Button key={index + playerInStory.name} variant="outline-dark">{playerInStory.name}</Button>
                )
            }

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

    const downloadStorySupporter = () => {
        downloadStory(story.refID, "prive")
    }

    return (
        <section className={styles.main}>
            <div className={styles.storyInfo}>
                <Carousel className={styles.InfoSlide} activeIndex={InfoIndex} onSelect={handleSelect} interval={null} >
                    <Carousel.Item>
                        <p className="storyTitle">{story.title}</p>
                        {player.id === story.author.id && !story.closed ? <CloseStoryAlert /> : null}
                        {story.closed ? <p className="storyTitle">{`Sesja zamknięta - ${story.closeTime}`}</p> : null}
                    </Carousel.Item>
                    <Carousel.Item>
                        <p className="storyAuthor">{`Prowadzący: ${story.author.name}`}</p>
                        <p className="storyStart">{`Sesja założona: ${story.startDate}`}</p>
                        <div className={styles.storyPlayers}>
                            <ul className={styles.storyPlayers}>
                                {players}
                            </ul>
                        </div>
                        {player.id === story.author.id ? <div className="addPlayers">
                            <input type="text" placeholder="Adresat" id="addressee" className="priveRecipients" list="playerListSet" value={addresseeValue} onChange={(e) => {
                                setAddressee(e.target.value);
                                searchForPlayer(e.target.value);
                            }} />
                            <datalist id="playerListSet" className="addPlayerDatalist">
                                {playerListSet}
                            </datalist>
                            <button className="addPLayer" onClick={addPlayerSupporter} >Dodaj gracza do sesji</button>
                        </div> : null}
                        <Button onClick={downloadStorySupporter}>Pobierz plik txt z sesją</Button>

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
            {story.closed ? null :
                <div className="addReply">
                    <Accordion activeKey={newChapter ? `0` : false} >
                        <Card>
                            <Accordion.Toggle className={styles.addStory} as={Card.Header} eventKey="0" onClick={() => setNewChapter(!newChapter)} >
                                Napisz odpowiedź
                    </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <TinyEditor addChapterPrive={addChapter}
                                        place={story}
                                        withHiddenContent
                                        recordBefore={recordBeforeEdit ? recordBeforeEdit : false}
                                        initialValue={recordBeforeEdit ? recordBeforeEdit.msg : false}
                                        editChapter={editChapter} />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            }
            <div className="chapters">
                {/* {chapters} */}
                <Chapters chapters={story.chapters} />
            </div>
            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    characters: state.characters.characters,
})
const MapDispatchToProps = dispatch => ({
    addChapter: (chapter) => dispatch(addChapter(chapter)),
    changeSeenInPriveSession: (id, refID) => dispatch(changeSeenInPriveSession(id, refID)),
    fetchPriveStories: (id) => dispatch(fetchPriveStories(id)),
    deleteChapter: (chapterIndex, refID) => dispatch(deleteChapter(chapterIndex, refID)),
    deletePlayerFromStory: player => dispatch(deletePlayerFromStory(player)),
    addingPlayerFromStory: player => dispatch(addingPlayerFromStory(player)),
    updateActive: player => dispatch(updateActive(player)),
    closePrive: story => dispatch(closePrive(story)),
    editChapter: chapter => dispatch(editChapter(chapter)),
    downloadStory: (refID, type) => dispatch(downloadStory(refID, type))
})

export default connect(MapStateToProps, MapDispatchToProps)(SinglePrive);
