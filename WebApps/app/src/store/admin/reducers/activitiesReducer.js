import { SET_ACTIVITES_LIST, SET_ACTIVITES_HISTORY_LIST, SET_PERIODS, SET_SELECTED_PERIOD, SET_QUERY_PARAMS_TO_SEARCH, SET_PAGINATIONS_INDEX } from '../actions/activitiesAction';

const defaultState = {
    activitiesList: null,
    queryParamsToSearch: {},
    paginationsIndex: {},
    historyList: {},
    periods: null,
    selectedPeriod: null
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SELECTED_PERIOD:
            return {
                ...state,
                selectedPeriod: action.payload
            };
        case SET_PERIODS:
            return {
                ...state,
                periods: action.payload
            };
        case SET_PAGINATIONS_INDEX:
            return {
                ...state,
                paginationsIndex: action.payload
            };
        case SET_QUERY_PARAMS_TO_SEARCH:
            return {
                ...state,
                queryParamsToSearch: action.payload
            };
        case SET_ACTIVITES_LIST:
            return {
                ...state,
                activitiesList: action.payload
            };
        case SET_ACTIVITES_HISTORY_LIST:
            return {
                ...state,
                selectedPeriod: action.payload.period,
                historyList: { ...state.historyList, [action.payload.period]: action.payload.list }
            };
        default:
            return { ...state };
    }
}

export default reducer;