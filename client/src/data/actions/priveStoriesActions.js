import axios from 'axios';
import { createDate } from '../usefullFN';


export const changeSeenInPriveSession = (id, refID) => dispatch => {
    let seen = {};
    seen.id = id;
    seen.refID = refID;
    axios.post('/stories/prive-update', { seen })
    dispatch({ type: "STORY_SEEN" });

}

export const createPriveStory = story => dispatch => {
    story.startDate = createDate();
    story.nextTurn = createDate(story.nextTurn)
    console.log(story);
    axios.post('/stories/prive-create', { story })
        .then(res => {
            console.log(res.data);
            let id = res.data.id
            dispatch({ type: 'DOWNLOAD_NEED', payload: true })
            dispatch({ type: "STORY_CREATE_SUCCESS", id })
        })
}

export const fetchPriveStories = mail => dispatch => {
    dispatch({ type: 'PRIVE_FETCH_START' })
    axios.post('/stories/prive-fetch', { mail })
        .then(res => {
            if (res.data.saved) {
                let priveStories = res.data.priveStoriesArray;
                dispatch({ type: 'PRIVE_FETCH_SUCCESS', priveStories })
            }
        })
}

export const addChapter = (chapter) => dispatch => {
    console.log(chapter);
    let newChapter = {};
    let author = {}
    newChapter.replyDate = createDate();
    newChapter.id = new Date().getTime();
    newChapter.msg = chapter.text;
    newChapter.storyID = chapter.place.refID;
    author.name = chapter.player.name;
    author.id = chapter.player.id;
    author.rank = chapter.player.rank;
    newChapter.author = author;
    if (chapter.nextTurn) {
        newChapter.nextTurn = createDate(chapter.nextTurn)
    }

    axios.post('/stories/prive-update', { newChapter })
    // then jest niepotrzebny, ponieważ onSnapshot w sesji załatwia reload sesji.
}

export const deleteChapter = (chapterIndex, refID) => dispatch => {
    let deleteChapter = {};
    deleteChapter.chapterIndex = chapterIndex;
    deleteChapter.refID = refID;
    dispatch({ type: 'STORY_EDITED' })
    axios.post('/stories/prive-update', { deleteChapter })
    // then jest niepotrzebny, ponieważ onSnapshot w sesji załatwia reload sesji.
}

export const deletePlayerFromStory = player => dispatch => {
    let deletedPlayer = player;
    axios.post('/stories/prive-update', {deletedPlayer})
}

export const addingPlayerFromStory = player => dispatch => {
    let addedPlayer = player;
    axios.post('/stories/prive-update', {addedPlayer})
}