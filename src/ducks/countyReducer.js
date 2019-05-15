import axios from 'axios';

const initialState = {
    countyData: [],
    activeCounty: {}
};

export const GET_COUNTY_DATA = 'GET_COUNTY_DATA';
export const GET_ACTIVE_COUNTY = 'GET_ACTIVE_COUNTY';

export function getCountyData() {
    let data = axios.get('/data').then(res => res.data);
    return {
        type: GET_COUNTY_DATA,
        payload: data
    };
};

export function getActiveCounty(county_id) {
    let data = axios.get(`/data/${county_id}`).then(res => res.data);
    return {
        type: GET_ACTIVE_COUNTY,
        payload: data
    };
};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case GET_COUNTY_DATA + '_FULFILLED':
            return {...state, countyData: action.payload};
        case GET_ACTIVE_COUNTY + '_FULFILLED':
            return {...state, activeCounty: action.payload};
        default:
            return state;
    };
};