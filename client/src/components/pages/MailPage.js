import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import NewMessageCreator from '../NewMessageCreator/NewMessageCreator';
import { updateActive } from '../../data/actions/generalActions';


const MailPage = ({ mails, msg, player, isLogged }) => {

    useEffect(() => {
        if (isLogged === "logged") {
            updateActive(player)
            const myInterval = setInterval(updateActive(player), 300000);
            setTimeout(() => {
                clearInterval(myInterval);
            }, 900000)
            return function cleanup() {
                clearInterval(myInterval);
            }
        }
    }, [isLogged])

    const [newMessage, writeNewMessage] = useState(false)

    useEffect(() => {
        if (newMessage) {
            writeNewMessage(false)
        }
    }, [mails])

    // const mailList = mails.map(mail => ((
    //     <div className="oneMail" key={mail.id}>
    //         <Link to={`/mails/id${mail.id}`}><p className="test">{mail.title}</p></Link>
    //         <p className="test">{mail.startDate}</p>
    //         <p className="test">{mail.sender.name}</p>
    //     </div>
    // ))).reverse()


    const mailList = mails.map(mail => {
        let newMessage = false;
        if (player.id === mail.addreesse.id && !mail.addreesse.read) newMessage = true
        else if (player.id === mail.sender.id && !mail.sender.read) newMessage = true
        mail.viewers.map(viewer => {
            if (player.id === viewer.id && !viewer.read) newMessage = true
        })

        return (
            <div className="oneMail" key={mail.id}>
                <Link to={`/mails/id${mail.id}`}><p className={newMessage ? "linkTitle new" : "linkTitle "}>{mail.title}</p></Link>
                <p className="mailDate">{mail.startDate}</p>
                <p className="mailAuthor">{mail.sender.name}</p>
            </div>
        )
    }
    ).reverse()


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
    player: state.player.player,
    isLogged: state.player.isLogged,
})

export default connect(MapStateToProps)(MailPage);