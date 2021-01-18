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



export const deleteChapter = (chapterIndex, refID) => dispatch => {
    let deleteChapter = {};
    deleteChapter.chapterIndex = chapterIndex;
    deleteChapter.refID = refID;
    dispatch({ type: 'STORY_EDITED' })
    axios.post('/stories-update', { deleteChapter })
}



export const closeStory = story => dispatch => {
    story.closeTime = createDate();
    story.place = "4";
    let closeStory = story;
    axios.post('/stories-update', { closeStory })
}
