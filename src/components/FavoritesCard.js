import React, {useState} from 'react';
import {connect} from 'react-redux';
import {deleteFavorite, editNote} from '../ducks/favoritesReducer';

function FavoritesCard(props) {

    const [noteInput, setNoteInput] = useState(props.county.favorite_note);
    const [edit, setEdit] = useState(false); 
    
    const {favorite_id, county_name, county_state_name, household_income, property_value, commute_time, median_age, favorite_note} = props.county;

    return (
        <div className='favorites-card'>
            <p>{county_name}</p>
            <p>{county_state_name}</p>
            <p>Median Household Income: ${household_income}</p>
            <p>Median Property Value: ${property_value}</p>
            <p>Average Commute Time: {commute_time} minutes</p>
            <p>Median Age: {median_age} years</p>
            {edit ? <textarea  className='favorite-note' value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    props.editNote({...props.county, favorite_note: noteInput});
                                    setEdit(!edit);
                                }
                            }}/>
                : <div className='favorite-note' onClick={() => setEdit(!edit)}>{favorite_note}</div>}
            <button className='login-button remove' onClick={() => props.deleteFavorite(favorite_id)}>Remove</button>
        </div>
    );
};

const mapState = reduxState => {
    return {
        user: reduxState.user,
        favorites: reduxState.favorites
    };
};

export default connect(mapState, {deleteFavorite, editNote})(FavoritesCard);