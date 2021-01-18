import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import styles from '../../css/mails.module.css';
import { Accordion, Card, Button } from 'react-bootstrap';
import NewMessageCreator from './NewMessageCreator';

import { selectSend, organizingMails } from '../../data/slices/mailsSlice';

const MailsCol = ({ player, mailsArray, organizingMails }) => {

    const isSend = useSelector(selectSend);
    const [newMail, toggleNewMail] = useState(false);
    const [priveMails, setPriveMails] = useState([]);
    const [selectedMailsRefs, setSelectedArray] = useState([]);


    useEffect(() => {
        if (isSend) toggleNewMail(false);
    }, [isSend])

    useEffect(() => {
        let mails = mailsArray;
        mails = _.orderBy(mails, ["replyStamp"], ["asc"])
        setPriveMails(mails)
    }, [mailsArray])

    const markMail = e => {
        let index = e.target.id;
        let docRef = priveMails[index].mailsDocRef;

        let array = selectedMailsRefs;
        // if (selectedMails.length > 0) array = selectedMails;

        let deletedIndex = false;
        let flag = false
        array.map((ref, index) => {
            if (ref === docRef) {
                deletedIndex = index;
                flag = true;
            };
        })
        if (flag) {
            array.splice(deletedIndex, 1)
        } else {
            array.push(docRef);
        }
        setSelectedArray(array)
        // console.log(array);
    }
    const workWithMails = (type) => {
        console.log(type);
        organizingMails(selectedMailsRefs, type, priveMails, player);
    }


    const mailList = priveMails.map((mail, index) => {
        let newMessage = false;
        if (player.id === mail.addreesse.id && !mail.addreesse.read) newMessage = true
        else if (player.id === mail.sender.id && !mail.sender.read) newMessage = true
        mail.viewers.map(viewer => {
            if (player.id === viewer.id && !viewer.read) newMessage = true
        })

        return (
            <div className={styles.oneMailLinkWrap} key={mail.id}>
                <p className={styles.mailDate}>{mail.lastReply ? mail.lastReply : mail.startDate}</p>
                <p className={styles.mailAuthor}>{mail.sender.name}</p>
                <input id={index} onChange={(id) => markMail(id)} type="checkbox" className={styles.checkbox} />

                <Link to={`/mail/id${mail.id}`}><p className={newMessage ? styles.linkTitleNew : styles.linkTitle}>{mail.title}</p></Link>
            </div>
        )
    })


    return (
        <div className={styles.mailsCollection}>
            <Accordion activeKey={newMail ? `0` : false}>
                <Card>
                    <Accordion.Toggle className={styles.addStory} as={Card.Header} onClick={() => toggleNewMail(!newMail)} eventKey="0">
                        Napisz nową wiadomość
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <NewMessageCreator type="Poczta prywatna" />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <div className={styles.utilities}>
                <Button id="delete" onClick={(e) => workWithMails(e.target.id)} variant="outline-dark">Kasuj</Button>
                <Button id="archive" onClick={(e) => workWithMails(e.target.id)} variant="outline-dark">Zarchiwizuj</Button>
                <Button id="read" onClick={(e) => workWithMails(e.target.id)} variant="outline-dark">Oznacz jako przeczytane</Button>
                <Button id="unread" onClick={(e) => workWithMails(e.target.id)} variant="outline-dark">Oznacz jako nieprzeczytane</Button>
            </div>

            <div className={styles.mails}>
                <div className={styles.oneMailLinkWrap}>
                    <p className={styles.mailDate}>Ostatnia aktywność</p>
                    <p className={styles.mailAuthor}>Autor wiadomości</p>
                    {/* <input type="checkbox" className={styles.checkbox} /> */}
                </div>
            </div>



            <div className={styles.mails}>
                {mailList}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})
const MapDispatchToProps = dispatch => ({
    organizingMails: (mailsRefArray, type, priveMails, player) => dispatch(organizingMails(mailsRefArray, type, priveMails, player))
})

export default connect(MapStateToProps, MapDispatchToProps)(MailsCol);