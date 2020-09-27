import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import NewMessageCreator from '../NewMessageCreator/NewMessageCreator';


const MailPage = ({ mails, msg }) => {

    

    const [newMessage, writeNewMessage] = useState(false)

    useEffect(() => {
        if (msg) {
            writeNewMessage(false)
        }
    }, [msg])

    const mailList = mails.map(mail => ((
        <div className="oneMail" key={mail.id}>
            <Link to={`/mails/id${mail.id}`}><p className="test">{mail.title}</p></Link>
            <p className="test">{mail.startDate}</p>
            <p className="test">{mail.sender.name}</p>
        </div>
    ))).reverse()
    return (
        <section className="mailPage mainPage">
            <h4 className="note">Poczta:</h4>
            <button className="newMessageCreatorButton" onClick={() => writeNewMessage(!newMessage)} >Rozpocznij nową konwersację</button>
            {newMessage ? <NewMessageCreator /> : null}
            <div className="mails">
                {mailList}
            </div>


            <ProfileViewer />

        </section>
    );
}

const MapStateToProps = state => ({
    mails: state.mails.mails,
    msg: state.player.msg,
})

export default connect(MapStateToProps)(MailPage);