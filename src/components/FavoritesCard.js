import React, {useState} from 'react';
import {connect} from 'react-redux';
import {deleteFavorite, editNote} from '../ducks/favoritesReducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FavoritesCard(props) {
    const [noteInput, setNoteInput] = useState(props.county.favorite_note);
    const [edit, setEdit] = useState(false); 
    
    const {favorite_id, county_name, county_state_name, household_income, avg_temperature, property_value, commute_time, median_age, favorite_note} = props.county;

    return (
        <div className='favorites-card'>
            <div className="card__county--div">
                <p className="card__county">{county_name}</p>
                <p className="card__state">{county_state_name}</p>
                <button className='unfavorite' onClick={() => props.deleteFavorite(favorite_id)}><FontAwesomeIcon icon='heart' /></button>
            </div>
            <div className="card__stat--div">
                <p className="card__stat">Average Temperature: {avg_temperature}</p>
                <p className="card__stat">Median Household Income: ${household_income}</p>
                <p className="card__stat">Median Property Value: ${property_value}</p>
                <p className="card__stat">Average Commute Time: {commute_time} minutes</p>
                <p className="card__stat">Median Age: {median_age} years</p>
            </div>
            <div className="card__note--div">
            {edit ? <textarea  className='favorite-note' value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    props.editNote({...props.county, favorite_note: noteInput});
                                    setEdit(!edit);
                                }
                            }}/>
                : <div className='favorite-note' onClick={() => setEdit(!edit)}>{favorite_note}</div>}
            </div>
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