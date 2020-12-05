import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Accordion, Card, Carousel, Button, Popover, OverlayTrigger } from 'react-bootstrap'
import styles from '../../css/mails.module.css'

import { mailsDB } from '../../data/firebase/firebaseConfig';
import { sendMailReply, fetchMails, changeSeenInMail, addingPlayerToMail, deletePlayerFromMail, selectSend } from '../../data/slices/mailsSlice';

import parse from 'html-react-parser';
import ProfileViewer from '../ProfileViewer/ProfileViewer';
import TinyEditor from '../RichEditor/TinyEditor'

const SingleMail = ({ player, mail, characters, sendMailReply, fetchMails, changeSeenInMail, addingPlayerToMail, deletePlayerFromMail }) => {

    const isSend = useSelector(selectSend);
    const [isAuthor, confirmAuthorRank] = useState(false);
    const [InfoIndex, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const [newMail, setNewMail] = useState(false);
    const [addresseeValue, setAddressee] = useState("");
    const [seachedPlayersList, setPlayersList] = useState([]);
    const [addPlayers, toggleAddPlayers] = useState(false);
    const [deletePlayers, toggleDeletePlayers] = useState(false);


    useEffect(() => {
        if (player.id === mail.sender.id) confirmAuthorRank(true);

        let counter = 0;
        if (player.id === mail.addreesse.id && !mail.addreesse.read) counter++;
        else if ((mail.sender.id === player.id && !mail.sender.read)) counter++;
        mail.viewers.map(viewer => {
            if (player.id === viewer.id && !viewer.read) counter++;
        })
        if (counter > 0) {
            console.log("SingleMail --- useEffect --- changeSeenInMail")
            let id = player.id;
            let refID = mail.mailsDocRef;
            changeSeenInMail(id, refID);
        }
    }, [])

    useEffect(() => {
        const unsubscribe = mailsDB.doc(`${mail.mailsDocRef}`)
            .onSnapshot(doc => {
                console.log("OneMail --- useEffect --- onSnapshot - res")
                let data = doc.data();
                fetchMails(player.login)
            })
        return function cleanup() {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (isSend) setNewMail(false)
    }, [isSend])


    const addPlayerSupporter = e => {
        let addedPlayer = {};
        addedPlayer.mailsDocRef = mail.mailsDocRef;
        addedPlayer.player = seachedPlayersList[0];
        addingPlayerToMail(addedPlayer);
        setAddressee("");
        setPlayersList([]);
        toggleAddPlayers(false)
    }
    const deletePlayersSupporter = e => {
        let deletedPlayer = {};
        deletedPlayer.mailsDocRef = mail.mailsDocRef;
        deletedPlayer.name = e.target.id;
        deletePlayerFromMail(deletedPlayer);
        toggleDeletePlayers(false);
    }

    const searchForPlayer = arg => {
        let charactersArray = characters;
        let searchedPlayerList = [];
        charactersArray.map(character => {
            let nameCheck = (((character.name).toLowerCase()).includes((arg).toLowerCase()) || (character.id).includes);
            let idCheck = character.id == arg;

            if (nameCheck || idCheck) {
                console.log(character)
                searchedPlayerList.push(character)
            }
        })
        setPlayersList(searchedPlayerList);
    }

    const playerListSet = seachedPlayersList.map(player => (
        <option key={player.id} value={`${player.name}`} ></option>
    ))

    const players = mail.viewers.map((viewer, index) => {
        const popover = (
            <Popover id="popover-basic">
                {/* <Popover.Title as="h3">Opcje</Popover.Title> */}
                <Popover.Content>
                    <Button variant="outline-danger" id={viewer.name} onClick={deletePlayersSupporter} >Usuń</Button>
                </Popover.Content>
            </Popover>
        );

        return (
            <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                <Button variant="outline-light">{viewer.name}</Button>
            </OverlayTrigger>
        )

    })

    const mailsChapters = mail.records.map(record => ((
        <div className="mailRecord" key={`${record.replyDate}`}>
            <p className="storyAuthor">{record.author.name} <span className="mailReplyDate">{record.replyDate}</span></p>
            <p className="storyDate">{record.startDate}</p>
            <div className="recordMsg">{parse(record.msg)}</div>
        </div>
    ))).reverse()

    return (
        <section className={styles.main}>
            <Link className="return" to="/mails/prive"><i className="fas fa-undo-alt"></i></Link>
            <div className={styles.storyInfo}>
                <Carousel className={styles.InfoSlide} activeIndex={InfoIndex} onSelect={handleSelect} interval={null} >
                    <Carousel.Item>

                        <p className={styles.mailInfo}>{`Temat konwersacji: ${mail.title}`}</p>
                        <p className={styles.mailInfo}>{`Ostatnia wiadomość z ${mail.lastReply ? mail.lastReply : mail.startDate}`}  </p>
                        {mail.viewers.length === 0 ? <p className={styles.mailInfo}>Konwersacja prywatna</p> : <p className={styles.mailInfo}>Konwersacja grupowa</p>}

                    </Carousel.Item>
                    <Carousel.Item>
                        <p className={styles.mailInfo}>{`Autor: ${mail.sender.name}`}</p>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className={styles.managePlayers}>
                            <input type="text" placeholder="Adresat" id="addressee" className={styles.addPlayerInput} list="playerListSet" value={addresseeValue} onChange={(e) => {
                                setAddressee(e.target.value);
                                searchForPlayer(e.target.value);
                            }} />
                            <datalist id="playerListSet" className="addPlayerDatalist">
                                {playerListSet}
                            </datalist>
                            <Button variant="outline-dark" className={styles.addPlayerBtn} onClick={addPlayerSupporter} >Dodaj gracza do sesji</Button>
                            <div className={styles.playersIn}>
                                <label className={styles.playersLabel} htmlFor="">{mail.viewers ? `Pomiędzy` : `Konwersacja dwuosobowa`}</label>
                                <ul className={styles.storyPlayers}>
                                    {players}
                                </ul>
                            </div>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className="addReply">
                <Accordion activeKey={newMail ? `0` : false} >
                    <Card>
                        <Accordion.Toggle className={styles.addStory} as={Card.Header} eventKey="0" onClick={() => setNewMail(!newMail)} >
                            Napisz odpowiedź
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <TinyEditor place={mail} sendMailReply={sendMailReply} />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
            <div className="mailsChapters">
                {mailsChapters}
            </div>

            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    characters: state.characters.characters
})

const MapDispatchToProps = dispatch => ({
    sendMailReply: message => dispatch(sendMailReply(message)),
    fetchMails: login => dispatch(fetchMails(login)),
    changeSeenInMail: (id, refID) => dispatch(changeSeenInMail(id, refID)),
    addingPlayerToMail: mail => dispatch(addingPlayerToMail(mail)),
    deletePlayerFromMail: player => dispatch(deletePlayerFromMail(player))
})

export default connect(MapStateToProps, MapDispatchToProps)(SingleMail);