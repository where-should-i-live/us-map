import React from 'react';
import { connect } from "react-redux";
import { addFavorite } from "./../../../ducks/favoritesReducer";


function ActiveCounty(props) {
    return (
        <div className='active-county'>
            {props.user.user.isLoggedIn ? <button onClick={() => props.addFavorite(props.county.activeCounty.county_id)}>Add to Favorites</button> : null}
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

export default connect(mapState, {addFavorite})(ActiveCounty);