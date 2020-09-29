import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Editor, EditorState, RichUtils } from 'draft-js';
// import 'draft-js/dist/Draft.css';
import { parseString } from '../../data/parseString';
import { sendMailReply, changeSeenInMail } from '../../data/actions/mailsActions';

// import MyEditor from '../RichEditor/RichEditor'

const OneMail = ({ mail, player, sendMailReply, changeSeenInMail }) => {

    useEffect(() => {
        if ((mail.addreesse.id === player.id && !mail.addreesse.read) || (mail.sender.id === player.id && !mail.sender.read)) {
            let id = player.id;
            let refID = mail.mailsDocRef;
            changeSeenInMail(id, refID);
        }
    }, [])

    const [mailReplyValue, setMailValue] = useState("");
    const [answerPreview, setAnswerPreview] = useState("");
    const [mailFormVisible, toggleMailForm] = useState(false);

    const submitReply = (e) => {
        e.preventDefault();
        let message = {};
        message.author = player;
        message.mailsDocRef = mail.mailsDocRef;
        message.text = mailReplyValue;
        sendMailReply(message);
        setMailValue("");
        toggleMailForm(false);
    }

    const mailsChapters = mail.records.map(record => ((
        <div className="mailRecord" key={`${record.replyDate}`}>
            <p className="storyAuthor">{record.author.name}</p>
            <p className="storyDate">{record.startDate}</p>
            <p className="recordMsg">{parseString(record.text)}</p>
        </div>
    ))).reverse()


    return (
        <section className="singleMail mainPage">
            <Link className="return" to="/mails"><i className="fas fa-undo-alt"></i></Link>
            <div className="storyInfo">
                <p className="storyTitle">{mail.title}</p>
                <p className="storyAuthor">{mail.sender.name}</p>
                <p className="storyDate">{mail.startDate}</p>
            </div>
            <button className="mailReplyButton" onClick={(e) => {
                e.preventDefault();
                toggleMailForm(!mailFormVisible)
            }}>Odpisz</button>
            {mailFormVisible ?
                <div className="mailReply">
                    <form className="mailForm" onSubmit={submitReply}>
                        <textarea name="" value={mailReplyValue} onChange={(e) => setMailValue(e.target.value)}></textarea>
                        <button className="mailViewer" onClick={(e) => {
                            e.preventDefault();
                            setAnswerPreview(mailReplyValue)
                        }}>Podgląd</button>
                        <input type="submit" value="Prześlij" className="newMessageSubmit" />
                    </form>
                </div> : null}
            {answerPreview ?
                <div className="mailPreview">
                    <span className="answerPreviewSpan">Tak będzie wyglądać Twoja odpowiedź:</span>
                    <p className="answerPreview">{parseString(answerPreview)}</p>
                </div>
                : null}
            <div className="mailsChapters">
                {mailsChapters}
            </div>
            <p className="storyAuthor">{mail.sender.name}</p>
            <p className="openingMail">{mail.startText}</p>
        </section>
    );
}

const MapStateToProps = state => ({
    msg: state.player.msg,
    player: state.player.player,
})

const MapDispatchToProps = dispatch => {
    return {
        sendMailReply: (message) => dispatch(sendMailReply(message)),
        changeSeenInMail: (id, refID) => dispatch(changeSeenInMail(id, refID)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(OneMail);