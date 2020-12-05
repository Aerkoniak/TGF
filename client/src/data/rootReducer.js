import { combineReducers } from "redux";

import globalStoriesReducer from './slices/globalStoriesSlice';
import otMailsReducer from './slices/mailsSlice';

import playerReducer from './reducers/playerReducer';
import storiesReducer from './reducers/storiesReducer';
import charactersReducer from './reducers/charactersReducer';
import mailsReducer from './reducers/mailsReducer';
import tavernReducer from './reducers/tavernReducer';
import creatorReducer from './reducers/creatorReducer';
import cpReducer from './slices/CPSlice';

const rootReducer = combineReducers({
    player: playerReducer,
    stories: storiesReducer,
    characters: charactersReducer,
    mails: mailsReducer,
    taverns: tavernReducer,
    creator: creatorReducer,
    // nowe reducery
    cp: cpReducer,
    globalStories: globalStoriesReducer,
    m: otMailsReducer,

})

export default rootReducer;
