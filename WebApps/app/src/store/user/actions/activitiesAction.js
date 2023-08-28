import { AXIOS_REQUEST } from "../../../services/axiosService";
import { ACTIVIDADES_OFERTA, ACTIVIDADES_HISTORIAL, MIS_ACTIVIDADES, GET_PERIODOS } from "../../../services/endPoints";

// CONSTANTS STRINGS
export const SET_LIST = "SET_LIST";
export const SET_HISTORY = "SET_HISTORY";
export const SET_SUBSCRIBED_ACTIVITIES = "SET_SUBSCRIBED_ACTIVITIES";
export const SET_SELECTED_PERIOD = "SET_SELECTED_PERIOD";
export const SET_PERIODS = "SET_PERIODS";
export const SET_SHOW_ALL_ACTIVITIES = "SET_SHOW_ALL_ACTIVITIES";

// CONSTANTS FUNCTIONS
export const setList = (payload) => ({ type: SET_LIST, payload });
export const setHistoryList = (payload) => ({ type: SET_HISTORY, payload });
export const setPeriods = (payload) => ({ type: SET_PERIODS, payload });
export const setSelectedPeriod = (payload) => ({ type: SET_SELECTED_PERIOD, payload });
export const setSubscribedActivities = (payload) => ({ type: SET_SUBSCRIBED_ACTIVITIES, payload });
export const setShowAllActivities = (payload) => ({ type: SET_SHOW_ALL_ACTIVITIES, payload });

//CONSTANTS ASYNC FUNCTIONS         
export const getActivitiesList = () => (dispatch) =>
    AXIOS_REQUEST(ACTIVIDADES_OFERTA).then(resp => {
        if (resp.cod === "200") {
            dispatch(setList(resp.data || []))
            // dispatch(setList(filterActivityInformation(resp.data.actunicas || [])))
            return resp.data || [];
        }
        throw new Error();
    });

export const getHistoryList = (period) => (dispatch) => {
    return AXIOS_REQUEST(ACTIVIDADES_HISTORIAL, "get", null, false, null, { periodo: period }).then(resp => {
        if (resp.cod === "200") {
            dispatch(setHistoryList({ period, list: resp.data || [] }))
            return resp.data;
        }
        throw new Error();
    }).catch(err => false)
}

export const getPeriods = () =>
    (dispatch) =>
        AXIOS_REQUEST(GET_PERIODOS).then(resp => {
            resp = resp.data?.map(p => p.periodo);
            dispatch(setPeriods(resp))
            return resp;
        })

export const getSubscribedActivities = () => (dispatch) =>
    AXIOS_REQUEST(MIS_ACTIVIDADES).then(resp => {
        if (resp.cod === "200") {
            dispatch(setSubscribedActivities(resp.data || []))
            return resp.data;
        }
        throw new Error();
    })

export const interventorsToList = (list_str) => {
    return list_str.split(",").map(i => ({
        nombre: /(.+)</g.exec(i)[1] || "Sin nombre",
        correo: /<(.*)>/g.exec(i)[1] || null
    }))
}