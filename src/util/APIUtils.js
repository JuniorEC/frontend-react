import { API_BASE_URL, CLIENT_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllClients(page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/clients?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createClient(clientData) {
    return request({
        url: API_BASE_URL + "/clients",
        method: 'POST',
        body: JSON.stringify(clientData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/clients/" + voteData.clientId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkcpfAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkcpfAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedClients(username, page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/clients?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedClients(username, page, size) {
    page = page || 0;
    size = size || CLIENT_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}