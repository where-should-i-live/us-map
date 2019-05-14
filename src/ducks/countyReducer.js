import axios from 'axios';

const initialState = {
    countyData: []
};

export const GET_COUNTY_DATA = 'GET_COUNTY_DATA';

export function getCountyData() {
    let data = axios.get('/data').then(res => res.data);
    return {
        type: GET_COUNTY_DATA,
        payload: data
    };
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case GET_COUNTY_DATA + '_FULFILLED':
            return {...state, countyData: action.payload};
        default:
            return state;
    };
};