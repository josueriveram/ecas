import { AXIOS_REQUEST } from "../../../services/axiosService";
import { loadConfigs } from "../../../services/configLoaderService";
import { LOGIN } from "../../../services/endPoints";

export const SET_USERINFO = "SET_USERINFO";
export const SET_UNAUTHORIZED = "SET_UNAUTHORIZED";
export const LOGOUT = "LOGOUT";
export const SET_SIDEBAR = "SET_SIDEBAR";
export const SET_USER_STATUS = "SET_USER_STATUS";
export const SET_CONFIG = "SET_CONFIG";

export const setUserInfo = payload => ({ payload, type: SET_USERINFO });
export const setUnauthorized = (payload) => ({ payload, type: SET_UNAUTHORIZED });
export const logout = () => ({ type: LOGOUT });
export const setUserStatus = payload => ({ payload, type: SET_USER_STATUS });
export const setSidebar = payload => ({ payload, type: SET_SIDEBAR });
export const setConfig = (payload) => ({ payload, type: SET_CONFIG });

/**
 * Login function for students
 * @param {object} data {type: number, username: string, password: string}
 */
export const login = ({ data, persona }) => {
    return (dispatch) => {
        data.confia = 0;
        data.admin = 1;

        var user = {
            correo: persona.email,
            nombre: persona.given_name,
            apellido: persona.family_name,
            foto: persona.picture
        }

        return AXIOS_REQUEST(LOGIN, "post", data)
            .then(resp => {
                if (!(resp)) {
                    return false;
                }else if(!!(resp.roles?.length)){
                    return resp.roles;
                }
                let { dni, nombProg, type, role } = resp.rpt.data;
                user = { ...user, role, dni, nombProg, rolDepart: resp.rolDepart, type, rolName: resp.roleName || "ADMINISTRADOR" }
                dispatch(setUserInfo({ user, token: resp.token }));
                return true;
            }).catch(err => {
                return false;
            })
    }
}

export const getConfig = () => {
    return dispatch => loadConfigs().then(resp => {
        dispatch(setConfig(resp))
    })
}