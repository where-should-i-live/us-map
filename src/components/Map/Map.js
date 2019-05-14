import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getCountyData} from './../../ducks/countyReducer';

function Map(props) {

    useEffect(() => {props.getCountyData()}, [])

    return (
        <div className='map-container'>
        </div>
    );
};

const mapState = reduxState => {
    return {
        user: reduxState.user,
        favorites: reduxState.favorites,
        county: reduxState.county
    };
};

export default connect(mapState, {getCountyData})(Map);