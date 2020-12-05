import React, { useState, useEffect } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from '../../css/mails.module.css'

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import MailsCol from '../MailFeature/MailsCol';


const MailPage = ({ mails, player }) => {



    const [newMessage, toggleNewMessage] = useState(false);
    const [mailsArray, setMailsArray] = useState([])

    useEffect(() => {
        let flag = false;
        mailsArray.forEach(mail => {
            if (player.id === mail.addreesse.id && !mail.addreesse.read) flag = true;
            else if (player.id === mail.sender.id && !mail.sender.read) flag = true;
            mail.viewers.map(viewer => {
                if (player.id === viewer.id && !viewer.read) flag = true;
            })
        })
        if (flag) toggleNewMessage(true)
        else toggleNewMessage(false)
    }, [mailsArray])

    useEffect(() => {
        let mailsArr = _.orderBy(mails, ["id"], ["desc"]);
        setMailsArray(mailsArr)
    }, [mails])



    return (
        <section className="mailPage mainPage">
            <ul className={styles.mailTypeLinks}>
                <li> <NavLink className={newMessage ? styles.newMailTypeLink : styles.typeLink} to="/mails/prive">Poczta prywatna</NavLink> </li>
                <li> <NavLink className={styles.typeLink} to="/mails/fab">Poczta fabularna</NavLink> </li>
            </ul>

            <section>
                <Switch>
                    <Route path="/mails/prive" render={(routeProps) => (<MailsCol {...routeProps} mailsArray={mailsArray} />)} />
                    <Route path="" />
                </Switch>
            </section>

            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    mails: state.m.otMails,
    msg: state.player.msg,
    player: state.player.player,
    isLogged: state.player.isLogged,
})

export default connect(MapStateToProps)(MailPage);