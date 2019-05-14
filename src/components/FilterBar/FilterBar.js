import React from 'react';
import {connect} from 'react-redux';

function FilterBar() {

    return (
        <div className='filterbar-container'>
            
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

export default connect(mapState)(FilterBar);