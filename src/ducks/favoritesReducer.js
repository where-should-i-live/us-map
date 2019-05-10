import axios from 'axios';

const initialState = {
    favorites: []
};

export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';

export function getFavorites(id) {
    let data = axios.get(`/favorites/${id}`).then(res => res.data);
    return {
        type: UPDATE_FAVORITES,
        payload: data
    };
};

export function addFavorite(favorite) {
    let data = axios.post(`/favorites/${favorite.favorite_id}`, favorite).then(res => res.data);
    return {
        type: UPDATE_FAVORITES,
        payload: data
    };
};

export function deleteFavorite(favorite_id) {
    let data = axios.delete(`/favorites/${favorite_id}`).then(res => res.data);
    return {
        type: UPDATE_FAVORITES,
        payload: data
    };
};

export function editNote(favorite) {
    let data = axios.put(`/favorites/${favorite.favorite_id}`, favorite).then(res => res.data);
    return {
        type: UPDATE_FAVORITES,
        payload: data
    };
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_FAVORITES + '_FULFILLED':
            return {...state, favorites: action.payload};
        default:
            return state;
    };
};