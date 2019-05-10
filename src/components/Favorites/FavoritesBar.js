import React from 'react';
import {connect} from 'react-redux';
import {getFavorites} from '../../ducks/favoritesReducer';
import FavoritesCard from './subcomponents/FavoritesCard/FavoritesCard';


function FavoritesBar(props) {

    return (
        <div>
            {props.user.user.isLoggedIn ? 
            <>
                {props.favorites.favorites.map(favorite => {
                    return <FavoritesCard key={favorite.favorite_id} county={favorite} />
                })}
            </>
            :
            null
            }
        </div>
    );
};

const mapState = reduxState => {
    return {
        user: reduxState.user,
        favorites: reduxState.favorites
    };
};

export default connect(mapState, {getFavorites})(FavoritesBar);