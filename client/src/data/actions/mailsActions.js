import axios from 'axios';
import { createDate } from '../usefullFN';


export const sendMail = message => dispatch => {
    const newMessage = {}
    newMessage.startDate = createDate();
    let sender = {}
    let addreesse = {}
    sender.name = message.player.name;
    sender.id = message.player.id;
    sender.rank = message.player.rank;
    sender.docRef = message.player.accountDocRef;
    addreesse.name = message.addreesse.name;
    addreesse.id = message.addreesse.id;
    addreesse.rank = message.addreesse.rank;
    addreesse.docRef = message.addreesse.accountDocRef;
    newMessage.sender = sender;
    newMessage.addreesse = addreesse;
    newMessage.startText = message.text
    newMessage.title = message.title
    newMessage.viewers = [];

    axios.post('/mails-create', { newMessage })
        .then(res => {
            if (res.data.isSaved) {
                dispatch({ type: 'DOWNLOAD_NEED', payload: true });
                dispatch({ type: 'DOWNLOAD_NEED', payload: false });
                dispatch({ type: 'CLEAN_MSG' });
            }
        })
    dispatch({ type: 'CLEAN_MSG' });
}

export const sendMailReply = message => dispatch => {
    const newMessage = {}
    newMessage.replyDate = createDate();

    let newChapter = {};
    let author = {}
    newMessage.replyDate = createDate();
    newMessage.id = new Date().getTime();

    newMessage.msg = message.text;
    newMessage.mailsDocRef = message.place.mailsDocRef;
    author.name = message.player.name;
    author.id = message.player.id;
    author.rank = message.player.rank;
    newMessage.author = author;


    axios.post('/mails-update', { newMessage })
        .then(res => {
            if (res.data.saved) {
                // let id = newMessage.author.id
                // axios.post('/mails-fetch', { id })
            }
        })
}

export const changeSeenInMail = (id, refID) => dispatch => {
    let read = {};
    read.id = id;
    read.refID = refID;
    axios.post('/mails-update', { read })
}

export const fetchMails = login => dispatch => {
    dispatch({ type: 'MAIL_FETCH_START' });
    axios.post('/mails-fetch', { login })
        .then(res => {
            if (res.data.failed) {
                dispatch({ type: 'MAIL_FETCH_FAILED' })
            } else if (res.data.mailsArray) {
                let mails = res.data.mailsArray;
                dispatch({ type: 'MAIL_FETCH_COMPLETE', mails });
            }
        })
}


export const addingPlayerToMail = mail => dispatch => {
    let newViewer = {};
    newViewer.mailsDocRef = mail.mailsDocRef;
    let viewer = {
        name: mail.player.name,
        id: mail.player.id,
        read: false,
        docRef: mail.player.accountDocRef,
    }
    newViewer.viewer = viewer;
    axios.post('/mails-update', { newViewer })
}

export const deletePlayerFromMail = player => dispatch => {
    let deletedPlayer = player;
    axios.post('/mails-update', { deletedPlayer })
}