import React from "react";
import "./scss/styles.scss";
import { connect } from "react-redux";
import Login from "./components/Login";
import Map from "./components/Map";
import FavoritesBar from "./components/FavoritesBar";

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
