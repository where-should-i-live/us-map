import React, {useState} from 'react';
import swal from 'sweetalert';
import {connect} from 'react-redux';
import {registerUser, loginUser, logoutUser, getUser} from './../../ducks/userReducer';
import {getFavorites} from './../../ducks/favoritesReducer';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';


library.add(faMinus);


function Login(props) {
    const [user_name, setUserName] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const processUser = async (event) => {
        if (event.key === 'Enter' && login) {
            const user = await props.loginUser({user_email, password});
            if (user.value.user_id) {
                props.getFavorites(user.value.user_id);
                setUserEmail('');
                setPassword('');
                setLogin(false);
            }
            else swal({text: `${user.value.message}`, button: false, timer: 3000});
        }
        else if (event.key === 'Enter' && register) {
            const user = await props.registerUser({user_name, user_email, password});
            if (user.value.user_id) {
                props.getFavorites(user.value.user_id);
                setUserName('');
                setUserEmail('');
                setPassword('');
                setRegister(false);
            }
            else swal({text: `${user.value.message}`, button: false, timer: 3000});
        }
    }

    return (
        <div className='login'>
            {props.user.user.isLoggedIn ? <p style={{color: 'white'}}>{props.user.user.user_name}</p> : null}
            {(register) ?
                <div className='text-input'>
                    <input type="text" placeholder="name" value={user_name} onChange={e => setUserName(e.target.value)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) ? 
                <div className='text-input'>
                    <input type="text" placeholder="email" value={user_email} onChange={e => setUserEmail(e.target.value)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) ? 
                <div className='text-input'>
                    <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={(e) => processUser(e)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) ? <button className='cancel-button' onClick={() => {setUserName('');setPassword('');setUserEmail('');{(login) ? setLogin(!login) : setRegister(!register)}}}><FontAwesomeIcon icon='minus' /></button> : null}
            {(!props.user.user.isLoggedIn && !login && !register) ? <button className='login-button' onClick={() => setLogin(!login)}>Login</button> : null}
            {(!props.user.user.isLoggedIn && !login && !register) ? <button className='login-button' onClick={() => setRegister(!register)}>Register</button> : null}
            {props.user.user.isLoggedIn ? <button className='login-button' onClick={() => props.logoutUser()}>Logout</button> : null}
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