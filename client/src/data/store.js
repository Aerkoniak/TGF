import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from './thunk';


import rootReducer from './rootReducer'

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
  ));

export default store;