import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import FavoritesBar from './components/Favorites/FavoritesBar';

function App() {
  return (
    <div className="App">
      <Login />
      <FavoritesBar />
    </div>
  );
}

export default App;
