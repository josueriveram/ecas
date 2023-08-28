import { AXIOS_REQUEST } from "./axiosService";
import { GET_ADMIN_CONFIG } from "./endPoints";
// let CONFIGS = localStorageService.getItem("bienes/config") || null;
let params = ["footer", "header", "logo", "nomb_ies", "titulo", "sidebar", "url_base"];
export const loadConfigs = () => AXIOS_REQUEST(GET_ADMIN_CONFIG).then(resp => {
    if (resp.msg !== "ERROR") {
        let now = new Date();
        now.setDate(now.getDate() + 1 * 7);

        return { ...filterParams(params, resp.data), expireAt: now.getTime() };
    }
    return {};
})

/**
 * Filter params in array
 * @param {Array} params strings to filter
 * @param {Array} obj JSON objects
 * @returns JSON object with specified params
 */
const filterParams = (params, obj) => obj.reduce((p, c) => {
    let nomb = c.nomb_conf;
    let value = c.valor_conf;
    if (!(params)) { return p[nomb] = value }
    return params.includes(nomb) ? { ...p, [nomb]: value } : p
}, {});