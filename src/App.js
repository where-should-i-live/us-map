import React from 'react';
import './App.scss';
import {connect} from 'react-redux';
import Login from './components/Login/Login';
import FilterBar from './components/FilterBar/FilterBar';
import Map from './components/Map/Map';
import FavoritesBar from './components/Favorites/FavoritesBar';

function App(props) {
  return (
    <div className="usmap">
      <Login />
      {/* <FilterBar /> */}
      <Map />
      {props.user.user.isLoggedIn ? <FavoritesBar /> : null}
    </div>
  );
}

const mapState = reduxState => {
  return {
      user: reduxState.user,
      favorites: reduxState.favorites,
      county: reduxState.county
  };
};

export default connect(mapState)(App);
