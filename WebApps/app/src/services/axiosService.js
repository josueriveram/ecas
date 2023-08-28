import axios from 'axios';

let token_storaged = "";
let otherConfig = {
    onUploadProgress: progressEvent => {
        // console.log("Upload: ", Math.round((progressEvent.loaded * 100) / progressEvent.total))
    },
    onDownloadProgress: progressEvent => {
        // console.log("Download: ", Math.round((progressEvent.loaded * 100) / progressEvent.total))
    },
    validateStatus: (status) => {
        return status >= 200 && status < 300; // default
    }
};

const setTokenForAxiosRequest = token => {
    token_storaged = token
};
const setOtherAxiosConfig = (config = {}) => { otherConfig = { ...otherConfig, ...config } };

/**
 * Axios API request for users make requets
 * @param {String} endpoint End point of API
 * @param {String} method post, get, put, delete
 * @param {any} data Data to send
 * @param {boolean} formData if request must be used as formData
 * @param {String} completeUrl URL complete 
 * @param {Object} header custom headers params 
 * @param {String} token token for a particular request 
 */
const AXIOS_REQUEST = (url, method = "get", data = null, formData = false, completeUrl = null, header = {}, token = token_storaged) => {
    let headers = {
        ...header,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    let params = null;
    if (method !== "get" && method !== "delete" && formData) {
        headers = {
            ...headers,
            'Process-Data': false,
            "Content-Type": false
        }
    } else if (method === "get" || method === "delete") {
        params = data;
    }

    return axios({
        method,
        url: completeUrl || url,
        data,
        params,
        headers,
        ...otherConfig
    }).then(resp => {
        return resp?.data
    }).catch(err => {
        let error = { error: true, data: [] }
        // if (err.response?.status === 401 && !(err.response?.data?.data)) {
        //     console.log("UNAUTHORIZED");
        // }
        if (!!(err.response?.data)) {
            error = { ...err.response.data, ...error };
        }
        console.log({ err, error })
        return error;
    })
}

export {
    AXIOS_REQUEST,
    setTokenForAxiosRequest,
    setOtherAxiosConfig
};

// import axios from 'axios';
// import store from '../store/user';
// import { setUnauthorized } from './../store/user/actions/userAction';

// /**
//  * Axios API request for users make requets
//  * @param {String} endpoint End point of API
//  * @param {String} method post, get, put, delete
//  * @param {any} data Data to send
//  * @param {boolean} formData if request must be used as formData
//  * @param {String} completeUrl URL complete 
//  * @param {String} token token for a particular request 
//  */
// export const AXIOS_REQUEST = (url, method = "get", data = null, formData = true, completeUrl = null, token = null) => {
//     var headers = {
//         'Authorization': `Bearer ${ token || (localStorage.getItem("bienestar/token"))
// }`,
//         'Content-Type': 'application/json'
//     }
//     let params = null;
//     if (method !== "get" && method !== "delete" && formData) {
//         headers = {
//             ...headers,
//             'Process-Data': false,
//             "Content-Type": false
//         }
//     } else if (method === "get" || method === "delete") {
//         params = data;
//     }

//     return axios({
//         method,
//         url: completeUrl || url,
//         data,
//         params,
//         headers
//     }).then(resp => {
//         return resp?.data
//     }).catch(err => {
//         let error = { error: true }
//         console.log({ err, error })
//         if (err.response?.status === 401 && !(err.response?.data?.data)) {
//             console.log("UNAUTHORIZED");
//             // if (window.location.href.search(/\/[#]\/nuevo\?/) !== -1) {
//             store.dispatch(setUnauthorized(true))
//             window.location.href = `${ window.location.href.split("#/")[0] }# / login`;
//             // }
//         }
//         if (!!(err.response?.data)) {
//             error = { ...err.response.data, ...error };
//         }
//         return error;
//     })
// }
