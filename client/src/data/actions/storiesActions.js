import axios from 'axios';
import { createDate } from '../usefullFN';

export const fetchStories = () => dispatch => {
    dispatch({ type: 'FETCH_START' });
    axios.post('/stories-fetch')
        .then(res => {
            let stories = res.data.storiesArray;
            dispatch({ type: 'FETCH_COMPLETE', stories });
        })
}

export const addChapter = (chapter) => dispatch => {
    chapter.replyDate = createDate();
    chapter.id = new Date().getTime();
    axios.post('/stories-update', { chapter })
        .then(res => {
            if (res.data.saved) {
                dispatch({ type: 'DOWNLOAD_NEED', payload: true });
                dispatch({ type: 'DOWNLOAD_NEED', payload: false });
            }
        })
}

export const changeSeenInSession = (id, refID) => dispatch => {
    let seen = {};
    seen.id = id;
    seen.refID = refID;
    axios.post('/stories-update', { seen })
}