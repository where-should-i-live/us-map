import axios from 'axios';

const initialState = {
    user: {}
};

export const UPDATE_USER = 'UPDATE_USER';

export function registerUser(user) {
    let data = axios.post('/auth/register', user).then(res => res.data);
    return {
        type: UPDATE_USER,
        payload: data
    };
};

export function loginUser(user) {
    let data = axios.post('/auth/login', user).then(res => res.data);
    return {
        type: UPDATE_USER,
        payload: data
    };
};

export function logoutUser() {
    let data = axios.get('/auth/logout').then(res => res.data);
    return {
        type: UPDATE_USER,
        payload: data
    };
};

export function getUser() {
    let data = axios.get('/user').then(res => res.data);
    return {
        type: UPDATE_USER,
        payload: data
    };
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_USER + '_FULFILLED':
            return {...state, user: action.payload};
        default:
            return state;
    };
};
