import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import styles from '../../css/stories.module.css';
import { Accordion, Card, Carousel } from 'react-bootstrap'

import { storiesDB } from '../../data/firebase/firebaseConfig'
import { fetchGlobalStories, selectSend, addChapter, deleteChapter, changeSeenInSession } from '../../data/slices/globalStoriesSlice'

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import TinyEditor from '../RichEditor/TinyEditor';

const SingleStory = ({ player, story, fetchGlobalStories, addChapter, deleteChapter, changeSeenInSession }) => {

    const [unSeen, confirmSeen] = useState(false);

    const isSend = useSelector(selectSend);
    const [InfoIndex, setIndex] = useState(0);
    const [isAuthor, confirmAuthor] = useState(false);
    const [newChapter, setNewChapter] = useState(false);

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
        if (player.id === story.author.id) confirmAuthor(true)
        else confirmAuthor(false)
    }, [story])

    useEffect(() => {
        if (isSend) setNewChapter(false)
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

    const chapters = story.chapters.map((chapter, index) => ((
        <div className={styles.chapter} key={chapter.id} >
            <p className={styles.chapterAuthor}  >{chapter.author.name}</p>
            <p className={styles.replyDate}>{chapter.replyDate}</p>
            <div className={styles.chapterMsg}>{parse(chapter.msg)}</div>
            {player.rank <= 2 ? <p onClick={deleteChapterSupporter} className={styles.deleteChapter} id={index}> x </p> : null}
            {player.rank <= 2 && chapter.hiddenContent ? <p className={styles.hiddenContent}>{chapter.hiddenContent}</p> : null}

        </div>
    ))).reverse()

    return (
        <section className={styles.main}>
            <div className={styles.storyInfo}>
                <Carousel className={styles.InfoSlide} activeIndex={InfoIndex} onSelect={handleSelect} interval={null} >
                    <Carousel.Item>
                        <p className="storyTitle">{story.title}</p>
                        {story.place === "4" ? <>
                            <span className="nextTurnDateSpan">Sesja zamknięta:</span>
                            <p className="nextTurnDateSpan">{story.closeTime}</p>
                        </> : <>
                                <span className="nextTurnDateSpan">Termin następnego odpisu:</span>
                                <p className="nextTurnDate">{story.nextTurn ? story.nextTurn : null}</p>
                            </>}
                    </Carousel.Item>
                    <Carousel.Item>
                        <p className="storyAuthor">{`Prowadzący: ${story.author.name}`}</p>
                        <p className="storyStart">{`Sesja założona: ${story.startDate}`}</p>
                        <div className={styles.storyPlayers}>
                            <ul className={styles.storyPlayers}>
                                {players}
                            </ul>
                        </div>
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
                                <TinyEditor addChapterGlobal={addChapter} place={story} isAuthor={isAuthor ? true : false} withHiddenContent />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
            <div className="chapters">
                {chapters}
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
})

export default connect(MapStateToProps, MapDispatchToProps)(SingleStory);