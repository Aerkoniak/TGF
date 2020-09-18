import axios from 'axios';
import { createDate } from '../usefullFN';

export const fetchStories = () => dispatch => {
    dispatch({ type: 'FETCH_START' });
    axios.post('/stories-fetch')
        .then(res => {
            console.log(res.data.storiesArray);
            let stories = res.data.storiesArray;
            dispatch({ type: 'FETCH_COMPLETE', stories});
        })
}

export const addChapter = (chapter) => dispatch => {
    chapter.replyDate = createDate();
    chapter.id = new Date().getTime();
    console.log(chapter);
    axios.post('/stories-update', {chapter})
    .then(res => {
        console.log(res.data);
        if (res.data.saved) {
            dispatch({ type: 'DOWNLOAD_NEED', payload: true });
            dispatch({ type: 'DOWNLOAD_NEED', payload: false });
        }
    })
}