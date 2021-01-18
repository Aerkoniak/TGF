import { combineReducers } from "redux";

import globalStoriesReducer from './slices/globalStoriesSlice';
import otMailsReducer from './slices/mailsSlice';
import cpReducer from './slices/CPSlice';
import tavernReducer from './slices/tavernSlice';
import workshopReducer from './slices/workshopSlice';
import theftReducer from './slices/theftSlice';
import priveStoriesReducer from './slices/priveStoriesSlice'

import playerReducer from './reducers/playerReducer';
import storiesReducer from './reducers/storiesReducer';
import charactersReducer from './reducers/charactersReducer';
import mailsReducer from './reducers/mailsReducer';
// import tavernReducer from './reducers/tavernReducer';
import creatorReducer from './reducers/creatorReducer';



const rootReducer = combineReducers({
    player: playerReducer,
    stories: storiesReducer,
    characters: charactersReducer,
    mails: mailsReducer,
    // taverns: tavernReducer,
    creator: creatorReducer,
    // nowe reducery
    cp: cpReducer,
    globalStories: globalStoriesReducer,
    priveStories: priveStoriesReducer,
    m: otMailsReducer,
    t: tavernReducer,
    w: workshopReducer,
    tS: theftReducer,

})

export default rootReducer;
