import { getJwt } from './getJwt';

const getRole = () => {

    const JWT = getJwt();

    if(JWT === null) {
        return null;
    }

    let token = JWT.token;
    
    let role = JSON.parse(window.atob(token.split(".")[1])).role;

    if(role === "admin") {
        return 'admin';
    }
    else if(role === "write") {
        return 'write';
    }
    else if(role === "read") {
        return 'read';
    }

}

const getUserId = () => {

    const JWT = getJwt();

    if(JWT === null) {
        return null;
    }

    let token = JWT.token;
    
    let id = JSON.parse(window.atob(token.split(".")[1])).userId;

    return id

}

const getStatus = () => {

    const JWT = getJwt();

    if(JWT === null) {
        return null;
    }

    let token = JWT.token;
    
    let id = JSON.parse(window.atob(token.split(".")[1])).status;

    return id

}

export { getRole, getUserId, getStatus }