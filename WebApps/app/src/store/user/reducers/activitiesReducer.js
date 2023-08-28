import { SET_LIST, SET_HISTORY, SET_SUBSCRIBED_ACTIVITIES, SET_PERIODS, SET_SELECTED_PERIOD, SET_SHOW_ALL_ACTIVITIES } from './../actions/activitiesAction';

const defaultState = {
    list: [],
    subscribed: [],
    history: {},
    periods: null,
    selectedPeriod: null,
    showAllActivities: (sessionStorage.getItem("showAllActivities") === "true")
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_LIST:
            return {
                ...state,
                list: action.payload
            };
        case SET_SUBSCRIBED_ACTIVITIES:
            return {
                ...state,
                subscribed: action.payload
            };
        case SET_HISTORY:
            return {
                ...state,
                history: { ...state.history, [action.payload.period]: action.payload.list },
                selectedPeriod: action.payload.period
            };
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
        case SET_SHOW_ALL_ACTIVITIES:
            sessionStorage.setItem("showAllActivities", action.payload);
            return {
                ...state,
                showAllActivities: action.payload
            };
        default:
            return { ...state };
    }
}

export default reducer;