import { setTokenForAxiosRequest } from '../../../services/axiosService';
import localStorageService from '../../../services/localStorageService';
import { SET_UNAUTHORIZED, LOGOUT, SET_SIDEBAR, SET_USERINFO, SET_USER_STATUS, SET_CONFIG } from '../actions/userAction';

let config = localStorageService.getItem("bienestar/config") || {};

const defaultState = {
    userInfo: localStorageService.getItem("bienestar/user_ad") || null,
    config,
    userStatus: {},
    unauthorized: false,
    sidebar: false
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USERINFO:
            localStorageService.setItems({
                "bienestar/user_ad": action.payload.user,
                "bienestar/token_ad": action.payload.token
            });
            setTokenForAxiosRequest(action.payload.token);

            return {
                ...state,
                userInfo: action.payload.user
            };
        case SET_USER_STATUS:
            return {
                ...state,
                userStatus: action.payload
            };
        case SET_CONFIG:
            localStorageService.setItem("bienestar/config", action.payload)

            return {
                ...state,
                config: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                userInfo: null
            };
        case SET_UNAUTHORIZED:
            return {
                ...state,
                userInfo: null,
                unauthorized: !!(action.payload)
            }
        case SET_SIDEBAR:
            return {
                ...state,
                sidebar: action.payload
            }
        default:
            return { ...state };
    }
}

export default reducer;