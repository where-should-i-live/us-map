import {createStore, applyMiddleware, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise-middleware';
import userReducer from './ducks/userReducer';
import favoritesReducer from './ducks/favoritesReducer';

const rootReducer = combineReducers({
    user: userReducer,
    favorites: favoritesReducer
});

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(promiseMiddleware)));