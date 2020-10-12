import { combineReducers } from "redux";

import playerReducer from './reducers/playerReducer';
import storiesReducer from './reducers/storiesReducer';
import charactersReducer from './reducers/charactersReducer';
import mailsReducer from './reducers/mailsReducer';
import tavernReducer from './reducers/tavernReducer';
import creatorReducer from './reducers/creatorReducer';

const rootReducer = combineReducers({
    player: playerReducer,
    stories: storiesReducer,
    characters: charactersReducer,
    mails: mailsReducer,
    taverns: tavernReducer,
    creator: creatorReducer,
})

export default rootReducer;
