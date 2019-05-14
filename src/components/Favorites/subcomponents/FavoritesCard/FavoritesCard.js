import React, {useState} from 'react';
import {connect} from 'react-redux';
import {deleteFavorite, editNote} from './../../../../ducks/favoritesReducer';

function FavoritesCard(props) {

    const [noteInput, setNoteInput] = useState(props.county.favorite_note);
    const [edit, setEdit] = useState(false); 
    
    const {county} = props;
    const {favorite_id, favorite_county_name, favorite_county_state_name, favorite_note} = county;
    const {county_name, county_state_name, household_income, property_value, commute_time, median_age} = props.county;

    return (
        <div className='favorites-card'>
            {county_name}
            {county_state_name}
            {edit ? <textarea  value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    props.editNote({...county, favorite_note: noteInput});
                                    setEdit(!edit);
                                }
                            }}/>
                : <p onClick={() => setEdit(!edit)}>{favorite_note}</p>}
            <button onClick={() => props.deleteFavorite(favorite_id)}>Delete</button>
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