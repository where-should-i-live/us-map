import React from 'react';
import { connect } from "react-redux";
import { addFavorite } from "./../ducks/favoritesReducer";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


library.add(faHeart);

function ActiveCounty(props) {
    const {county_id, county_name, county_state_name, household_income, property_value, commute_time, median_age, avg_temp} = props.county.activeCounty;
    return (
        <>
        {county_id ?
        <div className='active-county'>
            <div className='title-bar'>
                <h1>{county_name}, {county_state_name}</h1>
                {props.user.user.isLoggedIn ? <button className='favorite' onClick={() => props.addFavorite(props.county.activeCounty.county_id)}><FontAwesomeIcon icon='heart' /></button> : null}
            </div>
            <div className='county-data'>
                <div className='county-data-title'>Avg Temperature</div>
                {avg_temp ? <p>{Math.round(avg_temp)}<span>&#176;</span>F</p> : <p>-</p>}
            </div>
            <div className='county-data'>
                <div className='county-data-title'>Household Income</div>
                <p>${Math.round(household_income/1000)*1000}</p>
            </div>
            <div className='county-data'>
                <div className='county-data-title'>Property Value</div>
                <p>${Math.round(property_value/1000)*1000}</p>
            </div>
            <div className='county-data'>
                <div className='county-data-title'>Commute Time</div>
                <p>{Math.round(commute_time)} minutes</p>
            </div>
            <div className='county-data'>
                <div className='county-data-title'>Median Age</div>
                <p>{Math.round(median_age)} years</p>
            </div>
        </div> 
        : <div className='active-county'></div>}
        </>           
    );
};

const mapState = reduxState => {
    return {
        user: reduxState.user,
        favorites: reduxState.favorites,
        county: reduxState.county
    };
};

export default connect(mapState, {addFavorite})(ActiveCounty);