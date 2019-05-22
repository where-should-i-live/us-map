import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteFavorite, editNote } from "../ducks/favoritesReducer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FavoritesCard(props) {
  const [noteInput, setNoteInput] = useState(props.county.favorite_note);
  const [edit, setEdit] = useState(false);

  const {
    favorite_id,
    county_name,
    county_state_name,
    household_income,
    avg_temp,
    property_value,
    commute_time,
    median_age,
    favorite_note
  } = props.county;

  return (
    <div className="favorites-card">
      <div className="card__county--div">
        <p className="card__county">{county_name}</p>
        <p className="card__state">{county_state_name}</p>
        <button
          className="unfavorite"
          onClick={() => props.deleteFavorite(favorite_id)}
        >
          <FontAwesomeIcon icon="heart" />
        </button>
      </div>
      <div className="card__stat--div">
        <div className="county-data">
          <div className="county-data-title">Avg Temperature</div>
          <p>
            {Math.round(avg_temp)}
            <span>&#176;</span>F
          </p>
        </div>
        <div className="county-data">
          <div className="county-data-title">Household Income</div>
          <p>${Math.round(household_income / 1000) * 1000}</p>
        </div>
        <div className="county-data">
          <div className="county-data-title">Property Value</div>
          <p>${Math.round(property_value / 1000) * 1000}</p>
        </div>
        <div className="county-data">
          <div className="county-data-title">Commute Time</div>
          <p>{Math.round(commute_time)} minutes</p>
        </div>
        <div className="county-data">
          <div className="county-data-title">Median Age</div>
          <p>{Math.round(median_age)} years</p>
        </div>
      </div>
      <div className="card__note--div">
        {edit ? (
          <textarea
            className="favorite-note"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            onKeyPress={event => {
              if (event.key === "Enter") {
                props.editNote({ ...props.county, favorite_note: noteInput });
                setEdit(!edit);
              }
            }}
          />
        ) : (
          <div className="favorite-note" onClick={() => setEdit(!edit)}>
            {favorite_note}
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = reduxState => {
  return {
    user: reduxState.user,
    favorites: reduxState.favorites
  };
};

export default connect(
  mapState,
  { deleteFavorite, editNote }
)(FavoritesCard);
