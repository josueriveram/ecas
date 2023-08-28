import { AXIOS_REQUEST } from "../../../services/axiosService";
import { GET_PERIODOS, INS_ACTIVIDADES, INS_HISTORIAL } from "../../../services/endPoints";

export const SET_ACTIVITES_LIST = "SET_ACTIVITES_LIST";
export const SET_ACTIVITES_HISTORY_LIST = "SET_ACTIVITES_HISTORY_LIST";
export const SET_PERIODS = "SET_PERIODS";
export const SET_SELECTED_PERIOD = "SET_SELECTED_PERIOD";
export const SET_QUERY_PARAMS_TO_SEARCH = "SET_QUERY_PARAMS_TO_SEARCH";
export const SET_PAGINATIONS_INDEX = "PAGINATIONS_INDEX";

export const setActivitiesList = payload => ({ payload, type: SET_ACTIVITES_LIST });
export const setPeriods = payload => ({ payload, type: SET_PERIODS });
export const setSelectedPeriod = payload => ({ payload, type: SET_SELECTED_PERIOD });
export const setActivitiesHistoryList = payload => ({ payload, type: SET_ACTIVITES_HISTORY_LIST });
export const setQueryParamsToSearch = payload => ({ payload, type: SET_QUERY_PARAMS_TO_SEARCH });
export const setPaginationsIndex = payload => ({ payload, type: SET_PAGINATIONS_INDEX });

export const getActivitiesList = () =>
    (dispatch) =>
        AXIOS_REQUEST(INS_ACTIVIDADES).then(resp => {
            dispatch(setActivitiesList(resp.data || []))
        })

export const getActivitiesHistoryList = (period) => {
    let p = !!(period) ? `/${period}` : "";
    return (dispatch) =>
        AXIOS_REQUEST(INS_HISTORIAL + p).then(resp => {
            dispatch(setActivitiesHistoryList({ period, list: resp.data || [] }))
            return resp.data || [];
        })
}
export const getPeriods = () =>
    (dispatch) =>
        AXIOS_REQUEST(GET_PERIODOS).then(resp => {
            resp = resp.data?.map(p => p.periodo);
            dispatch(setPeriods(resp))
            return resp;
        })