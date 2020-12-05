import { createSlice } from '@reduxjs/toolkit';
import { createDate } from '../usefullFN';
import axios from 'axios';

export const mailsSlice = createSlice({
    name: "m",
    initialState: {
        otMails: [],
        isSend: false,
        isFetched: false,
    },
    reducers: {
        toggleSend: (state, action) => {
            state.isSend = action.payload
        },
        toggleFetched: (state, action) => {
            state.isFetched = action.payload
        },
        updateFetchedMails: (state, action) => {
            state.otMails = action.payload;
        }
    }
})

export const { toggleSend, toggleFetched, updateFetchedMails } = mailsSlice.actions;

export const fetchMails = login => dispatch => {
    dispatch(toggleFetched(false))
    axios.post('/mails-fetch', { login })
        .then(res => {
            if (res.data.mailsArray) {
                let mails = res.data.mailsArray;
                dispatch(updateFetchedMails(mails));
                dispatch(toggleFetched(true));

            }
        })
}

export const sendMail = message => dispatch => {
    dispatch(toggleSend(false))
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
                dispatch(toggleSend(true))
                dispatch(fetchMails(message.player.login))
            }
        })
}

export const changeSeenInMail = (id, refID) => dispatch => {
    let read = {};
    read.id = id;
    read.refID = refID;
    axios.post('/mails-update', { read })
}

export const sendMailReply = message => dispatch => {
    dispatch(toggleSend(false))
    const newMessage = {}
    newMessage.replyDate = createDate();

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
                dispatch(toggleSend(true))
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

export const selectSend = state => state.m.isSend;

export default mailsSlice.reducer;