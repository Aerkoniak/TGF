import axios from 'axios';
import { createDate } from '../usefullFN';


export const sendMail = message => dispatch => {
    message.startDate = createDate();
    // message.id = new Date().getTime();
    console.log(message);
    axios.post('/mails-create', { message })
        .then(res => {
            if (res.data.isSaved) {
                dispatch({ type: 'DOWNLOAD_NEED', payload: true });
                dispatch({ type: 'DOWNLOAD_NEED', payload: false });
                dispatch({ type: 'CLEAN_MSG' });
            }
        })
}

export const sendMailReply = message => dispatch => {
    message.replyDate = createDate();
    // console.log(message);
    axios.post('/mails-update', { message })
        .then(res => {
            if (res.data.saved) {
                let id = message.author.id
                axios.post('/mails-fetch', { id })
                    .then(res => {
                        let mails = res.data.mailsArray;
                        dispatch({ type: 'MAIL_FETCH_COMPLETE', mails });
                    })
            }
        })
}

export const changeSeenInMail  = (id, refID) => dispatch => {
    let read = {};
    read.id = id;
    read.refID = refID;
    axios.post('/mails-update', { read })
}

export const fetchMails = id => dispatch => {
    console.log(id)
    dispatch({ type: 'MAIL_FETCH_START' });
    axios.post('/mails-fetch', { id })
        .then(res => {
            let mails = res.data.mailsArray;
            dispatch({ type: 'MAIL_FETCH_COMPLETE', mails });
        })
}
