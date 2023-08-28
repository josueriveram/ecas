import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { setOtherAxiosConfig, setTokenForAxiosRequest } from '../../services/axiosService';
import localStorageService from '../../services/localStorageService';
import { getConfig, LOGOUT, setUnauthorized, SET_UNAUTHORIZED } from './actions/userAction';

// Reducers list
import userReducer from './reducers/userReducer';
import activitiesReducer from './reducers/activitiesReducer';

setTokenForAxiosRequest(localStorageService.getItem("bienestar/token_ad"));

// Create deducer all in one
const allReducers = combineReducers({
    user: userReducer,
    activities: activitiesReducer
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT || (action.type === SET_UNAUTHORIZED && action.payload === true)) {
        localStorageService.deleteItems(["bienestar/user_ad", "bienestar/token_ad"]);
        state = undefined;
    }
    return allReducers(state, action)
}

// Config Middleware for async actions
const thunkHandler = applyMiddleware(thunk);
const composeEnhancers = (typeof window !== 'undefined' && /localhost/.test(window.location.href) && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)

// Create the store
const store = createStore(rootReducer, composeEnhancers(thunkHandler));

setOtherAxiosConfig({
    validateStatus: status => {
        if (status === 401) {
            store.dispatch(setUnauthorized(true));
            return false;
        }
        return status >= 200 && status < 300; // default
    }
});
const config = localStorageService.getItem("bienestar/config");
if (!(config) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
    store.dispatch(getConfig());
}

export default store;
