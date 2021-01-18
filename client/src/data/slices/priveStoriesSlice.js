import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'
import { createDate } from '../usefullFN';
import download from 'downloadjs'

export const priveStoriesSlice = createSlice({
    name: "priveStories",
    initialState: {
        isSend: false,
        isFetched: false,
        ID: false,
        stories: [],
    },
    reducers: {
        toggleSend: (state, action) => {
            state.isSend = action.payload
        },
        toggleFetched: (state, action) => {
            state.isFetched = action.payload
        },
        toggleID: (state, action) => {
            state.ID = action.payload
        },
        updateStories: (state, action) => {
            state.stories = action.payload
        }
    }
})

export const fetchPriveStories = (id) => dispatch => {
    dispatch(toggleFetched(false));
    axios.post('/stories/prive-fetch', { id })
        .then(res => {
            let stories = res.data.priveStoriesArray;
            dispatch(updateStories(stories));
            dispatch(toggleFetched(true));
        })
};

export const addChapter = (chapter) => dispatch => {
    dispatch(toggleSend(false));
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
    if (chapter.hiddenContent) {
        newChapter.hiddenContent = chapter.hiddenContent
    }

    axios.post('/stories/prive-update', { newChapter })
    dispatch(toggleSend(true));
    // then jest niepotrzebny, ponieważ onSnapshot w sesji załatwia reload sesji.
}

export const closePrive = story => dispatch => {
    let closedPrive = { ...story };
    closedPrive.closed = true;
    closedPrive.closeTime = createDate()
    axios.post('/stories/prive-update', { closedPrive })
}

export const deleteChapter = (chapterIndex, refID) => dispatch => {
    let deleteChapter = {};
    deleteChapter.chapterIndex = chapterIndex;
    deleteChapter.refID = refID;
    axios.post('/stories/prive-update', { deleteChapter })
    // then jest niepotrzebny, ponieważ onSnapshot w sesji załatwia reload sesji.
}

export const editChapter = (chapter) => dispatch => {
    dispatch(toggleSend(false));
    let editChapter = { ...chapter };

    console.log(editChapter)

    axios.post('/stories/prive-update', { editChapter })
    dispatch(toggleSend(true));
}

export const deletePlayerFromStory = player => dispatch => {
    let deletedPlayer = player;
    axios.post('/stories/prive-update', { deletedPlayer })
}

export const downloadStory = (refID, type) => dispatch => {
    axios.post(`/download-file?refID=${refID}&type=${type}`)
        .then(res => {
            // console.log(res.data.file);
            let file = res.data.file;
            // console.log(file)
            download(file, `sesja_${refID}.pdf`, 'text/plain; charset=UTF-8;')
        })

}

export const selectSend = state => state.priveStories.isSend;

export const { toggleSend, toggleFetched, toggleID, updateStories } = priveStoriesSlice.actions;

export default priveStoriesSlice.reducer;