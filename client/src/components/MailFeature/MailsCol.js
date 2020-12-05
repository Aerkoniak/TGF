import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import styles from '../../css/mails.module.css';
import { Accordion, Card } from 'react-bootstrap';
import NewMessageCreator from './NewMessageCreator';

import { selectSend } from '../../data/slices/mailsSlice';

const MailsCol = ({ player, mailsArray }) => {

    const isSend = useSelector(selectSend);
    const [newMail, toggleNewMail] = useState(false);
    const [priveMails, setPriveMails] = useState([])

    useEffect(() => {
        if (isSend) toggleNewMail(false);
    }, [isSend])

    useEffect(() => {
        setPriveMails(mailsArray)
    }, [mailsArray])

    const mailList = priveMails.map(mail => {
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

                <Link to={`/mail/id${mail.id}`}><p className={newMessage ? "linkTitle new" : "linkTitle "}>{mail.title}</p></Link>
            </div>
        )
    }
    )

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

            <div className={styles.mails}>
                <div className={styles.oneMailLinkWrap}>
                    <p className={styles.mailDate}>Ostatnia aktywność</p>
                    <p className={styles.mailAuthor}>Autor wiadomości</p>
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

export default connect(MapStateToProps)(MailsCol);