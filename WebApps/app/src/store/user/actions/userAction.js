import { AXIOS_REQUEST } from "../../../services/axiosService";
import { loadConfigs } from "../../../services/configLoaderService";
import { LOGIN, TRANSACCIONES_HORAS, TRANSACCIONES_PUNTOS, USER_STATUS } from "../../../services/endPoints";

export const SET_USERINFO = "SET_USERINFO";
export const SET_UNAUTHORIZED = "SET_UNAUTHORIZED";
export const LOGOUT = "LOGOUT";
export const SET_USERSTATUS = "SET_USERSTATUS";
export const SET_TRANSACTIONS = "SET_TRANSACTIONS";
export const SET_HOURS_TRANSACTIONS = "SET_HOURS_TRANSACTIONS";
export const SET_CONFIG = "SET_CONFIG";

export const setUserInfo = payload => ({ payload, type: SET_USERINFO });
export const setUnauthorized = (payload) => ({ payload, type: SET_UNAUTHORIZED });
export const setUserStatus = (payload) => ({ payload, type: SET_USERSTATUS });
export const logout = () => ({ type: LOGOUT });
export const setTransactions = (payload) => ({ payload, type: SET_TRANSACTIONS });
export const setHoursTransactions = (payload) => ({ payload, type: SET_HOURS_TRANSACTIONS });
export const setConfig = (payload) => ({ payload, type: SET_CONFIG });

/**
 * Login function for students
 * @param {object} data {type: number, username: string, password: string}
 */
export const login = ({ data, persona }) => {
    return (dispatch) => {
        data.confia = 0;
        var user = {
            correo: persona.email,
            // apellido: persona.family_name,
            // nombre: persona.given_name,
            foto: persona.picture
        }

        return AXIOS_REQUEST(LOGIN, "post", data)
            .then(resp => {
                if (!(resp)) {
                    return false;
                }
                let { dni, nombProg, type, firstName, lastName, rolePart } = resp.rpt.data;
                user = { ...user, dni, nombProg, type, nombre: firstName, apellido: lastName, rol: rolePart }

                dispatch(setUserInfo({ user, token: resp.token }));
                dispatch(getUserStatus());

                return true;
            }).catch(err => {
                return false;
            })
    }
}

/**
 * Get points transactions
 * @param {number} pag pagination number 
 * @returns void
 */
export const getTransactions = (pag = 0) => {
    return dispatch => AXIOS_REQUEST(TRANSACCIONES_PUNTOS + pag)
        .then(resp => dispatch(setTransactions(resp.data || [])))
    // .catch(err => dispatch({ payload, type: UNAUTHORIZED }))
};
/**
 * Get hours transactions
 * @param {number} pag pagination number 
 * @returns void
 */
export const getHoursTransactions = (pag = 0) => {
    return dispatch => AXIOS_REQUEST(TRANSACCIONES_HORAS + pag)
        .then(resp => dispatch(setHoursTransactions(resp.data || [])))
    // .catch(err => dispatch({ payload, type: UNAUTHORIZED }))
};

export const getUserStatus = () => {
    return dispatch => AXIOS_REQUEST(USER_STATUS).then(resp => {
        if (!!(resp.data)) {
            let status = {
                ...resp.data,
                aprobien: !!(resp.data.aprobien) ? "Aprobado" : "Sin aprobar",
                aprobien_detalle: JSON.parse(resp.data.aprobien || "{}")
            }
            dispatch(setUserStatus(status));
        }
    })
}

export const getConfig = () => {
    return dispatch => loadConfigs().then(resp => {
        dispatch(setConfig(resp))
    })
}
