import { setTokenForAxiosRequest } from '../../../services/axiosService';
import localStorageService from '../../../services/localStorageService';
import { SET_UNAUTHORIZED, LOGOUT, SET_USERINFO, SET_USERSTATUS, SET_TRANSACTIONS, SET_HOURS_TRANSACTIONS, SET_CONFIG } from '../actions/userAction';

const user = localStorageService.getItem("bienestar/user") || null;
let config = localStorageService.getItem("bienestar/config") || {};
// if(!!(user){
//     delete user.status
// }
// const { status } = user || {};
const defaultState = {
    config,
    userInfo: user,
    userStatus: user?.status,
    unauthorized: false,
    transactions: null,
    hoursTransactions: null,
    sidebar: false
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USERINFO:
            let user = {"bienestar/user": action.payload.user}
            if(action.payload.token){
                user["bienestar/token"] = action.payload.token
                setTokenForAxiosRequest(action.payload.token);
            }
            localStorageService.setItems(user);

            return {
                ...state,
                userInfo: action.payload.user
            };
        case SET_USERSTATUS:
            localStorageService.setItem("bienestar/user", { ...state.userInfo, status: action.payload });

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
        case SET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload
            };
        case SET_HOURS_TRANSACTIONS:
            return {
                ...state,
                hoursTransactions: action.payload
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
        default:
            return { ...state };
    }
}

export default reducer;