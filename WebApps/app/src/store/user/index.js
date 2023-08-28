import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { LOGOUT, SET_UNAUTHORIZED, setUnauthorized, getConfig } from './actions/userAction';

// Reducers list
import activitiesReducer from './reducers/activitiesReducer'
import userReducer from './reducers/userReducer'

import { setTokenForAxiosRequest, setOtherAxiosConfig } from './../../services/axiosService'
import localStorageService from '../../services/localStorageService';

setTokenForAxiosRequest(localStorageService.getItem("bienestar/token"));

// Create deducer all in one
const allReducers = combineReducers({
    activities: activitiesReducer,
    user: userReducer,
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT || (action.type === SET_UNAUTHORIZED && action.payload === true)) {
        localStorageService.deleteItems(["bienestar/user", "bienestar/token"]);
        state = undefined;
    }
    return allReducers(state, action)
}

// Config Middleware for async actions
const thunkHandler = applyMiddleware(thunk);
const composeEnhancers = (typeof window !== 'undefined' && /localhost/.test(window.location.href) && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)

// Create the store
const userStore = createStore(rootReducer, composeEnhancers(thunkHandler))

setOtherAxiosConfig({
    validateStatus: status => {
        if (status === 401) {
            userStore.dispatch(setUnauthorized(true));
            return false;
        }
        return status >= 200 && status < 300; // default
    }
});
const config = localStorageService.getItem("bienestar/config");
if (!(config) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
    userStore.dispatch(getConfig());
} 

export default userStore;
