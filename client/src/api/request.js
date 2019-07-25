import axios from 'axios';
import { getJwt } from './getJwt';

axios.defaults.baseURL = '/api/v1/';

export const setDefaults = () => {
    if(getJwt() !== null) { 
        axios.defaults.headers.common['Authorization'] = `Bearer ${getJwt().token}`;
    }
}

setDefaults();

let source = null;

const _request = (url, method = "get", data = {}, headers = {}) => {
    switch(method) {

        case "get":

            return axios.get(url, headers);

        case "post":
        
            return axios.post(url, data, headers);

        case "put":

            return axios.put(url, data, headers);

        case "patch":

            return axios.patch(url, data, headers);
        
        case "delete":
    
            return axios.delete(url, headers);

        default:    

    }
}

// cancel http requests before getting response
export const _cancelOnGoingRequest = () => {

    source.cancel('request cancelled');

}

export const _isCancellationError = (error) => {

    return axios.isCancel(error);

}

export default _request;