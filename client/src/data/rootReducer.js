import { combineReducers } from "redux";

import playerReducer from './reducers/playerReducer';
import storiesReducer from './reducers/storiesReducer';

const rootReducer = combineReducers({
    player: playerReducer,
    stories: storiesReducer
})

export default rootReducer;
