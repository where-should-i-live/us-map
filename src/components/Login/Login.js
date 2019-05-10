import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {registerUser, loginUser, logoutUser, getUser} from './../../ducks/userReducer';
import {getFavorites} from './../../ducks/favoritesReducer';

function Login(props) {
    const [user_name, setUserName] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');

    //// useEffect replaces componentDidMount, and processes each time something changes ////
    useEffect(() => console.log(), []);

    const newUser = async () => {
        const user = await props.registerUser({user_name, user_email, password});
        setUserName('');
        setUserEmail('');
        setPassword('');
        props.getFavorites(user.value.user_id);
    }

    const login = async () => {
        const user = await props.loginUser({user_email, password});
        setUserEmail('');
        setPassword('');
        props.getFavorites(user.value.user_id);
    }

    return (
        <div>
            <input placeholder='username' value={user_name} onChange={e => setUserName(e.target.value)}/>
            <input placeholder='email' value={user_email} onChange={e => setUserEmail(e.target.value)}/>
            <input placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
            <button onClick={() => login()}>Login</button>
            <button onClick={() => newUser()}>Register</button>
            <button onClick={() => props.logoutUser()}>Logout</button>
        </div>
    );
};

const mapState = reduxState => {
    return {
        user: reduxState.user,
        favorites: reduxState.favorites
    };
};

export default connect(mapState, {registerUser, loginUser, logoutUser, getUser, getFavorites})(Login);