import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const OneMail = ({ mail, msg }) => {


    return (
        <section className="singleMail mainPage">
            <Link className="return" to="/mails"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <p className="storyTitle">{mail.title}</p>
                <p className="storyAuthor">{mail.sender.name}</p>
                <p className="storyDate">{mail.startDate}</p>
                <p className="openingMsg">{mail.startText}</p>
            </div>
        </section>
    );
}

const MapStateToProps = state => ({
    msg: state.player.msg,
})

export default connect(MapStateToProps)(OneMail);