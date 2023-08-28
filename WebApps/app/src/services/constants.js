export const ERROR_REPORTING_URL = window._NGconfig.error_reporting_url;

export const GET_ACCOUNT_INFO = window._NGconfig.ldap_search_user; 

export const APP_URL = window._NGconfig.app_url;
export const WALLET_URL = window._NGconfig.wallet_url;

export const API_BIENESTAR_BASE = window._NGconfig.api_base_url;

export const GOOGLE_CLIENT_ID = window._NGconfig.google_client_id;
export const MICROSOFT_CLIENT_ID = window._NGconfig.microsoft_client_id;

export const LOGO_LOGIN = window._NGconfig.logo_login;

export const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const DAYS = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export const FORMAT_HOURS = (time) => {
    let h = time.split(":");
    let hour = Number(h[0]);
    if (hour > 11) {
        hour = hour - 12;
        if (hour === 12) { hour = 0 }
        return `${hour < 10 ? `0${hour}` : hour}:${h[1]} PM`;
    }
    return `${h[0]}:${h[1]} AM`;
}

export const getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function isObject(object) {
    return object != null && typeof object === 'object';
}
export const compare2Objects = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !compare2Objects(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

export const stringBase64 = (str, decrypt) => {
    if (decrypt === true) {
        try {
            str = decodeURIComponent(escape(window.atob(str)));
            return JSON.parse(str);
        } catch (error) {
            return str;
        }
    } else {
        if (typeof str === "object") { str = JSON.stringify(str) }
        return window.btoa(unescape(encodeURIComponent(str)));
    }
}