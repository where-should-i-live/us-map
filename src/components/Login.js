import React, {useState} from 'react';
import swal from 'sweetalert';
import {connect} from 'react-redux';
import {registerUser, loginUser, logoutUser, getUser} from '../ducks/userReducer';
import {getFavorites} from '../ducks/favoritesReducer';
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';


library.add(faBan);

// const componentDidMount = async (props) => {
//     let user = await axios.get('/checkForUser')
//     if(user.data) {props.getFavorites(user.data.user_id)}
//     if(user.data) return
//   }
// hello

function Login(props) {
    const [user_name, setUserName] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [tempPass, setTempPass] = useState('')
    const [showUpdateEmail, setShowUpdateEmail] = useState(false)

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

    async function sendEmail(user_email) {
        const res = await axios.post('/checkEmail', user_email)
        if(res.data){
            alert('A temporary password has been sent to your email')
            let randomStr = Math.random().toString(15).slice(-10)
            setTempPass(randomStr)
            axios.post('/reset', {user_email, randomStr})
        }else{alert('Please enter valid email or Register')}
    }
    
    function checkTempPass(event, value){
        if(event.key === 'Enter' && value === tempPass) {
            setShowUpdateEmail(true)
        }
    }

    async function updatePassword(event, newPassword){
        if(event.key === 'Enter'){
            const user = await axios.post('/updatePassword', {newPassword, user_email})
            await props.loginUser({user_email, password})
            if(user.data.user_id){
                props.getFavorites(user.data.user_id);
                setShowUpdateEmail(false)
                setTempPass('')
                setUserEmail('')
                setPassword('')
                setLogin(false)
            }
        }
    }

    return (
        <div className='nav'>
            {props.user.user.isLoggedIn ? <p className='user-name'>{props.user.user.user_name}</p> : null}
            {(register) ?
                <div className='text-input'>
                    <input className='input-box' type="text" placeholder="name" value={user_name} onChange={e => setUserName(e.target.value)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) ? 
                <div className='text-input'>
                    <input className='input-box' type="text" placeholder="email" value={user_email} onChange={e => setUserEmail(e.target.value)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) ? 
                <div className='text-input'>
                    <input className='input-box' type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={(e) => processUser(e)}/>
                    <span className="bottom"></span>
                    <span className="right"></span>
                    <span className="top"></span>
                    <span className="left"></span>
                </div>
            : null}
            {(login || register) && 
                <div>
                    <button className='cancel-button' 
                        onClick={() => {setUserName('');setPassword('');setUserEmail('');
                        {(login) ?
                            setLogin(!login) : 
                            setRegister(!register)
                            }}}>
                            <FontAwesomeIcon icon='ban' />
                    </button> 
                </div>
            }
            {login &&
                <div style={{
                    width: 150,
                    position: 'absolute', 
                    top: 45, right: 130, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center'
                    }}>
                <button onClick={() => sendEmail()} style={{width: 108,border: 'none', background: 'none', color: 'red', }}>
                    forgot password?
                </button>

                {(tempPass !== '') &&
                    <input style={{position: 'absolute', top: 26, right: 9, textAlign: 'center'}}
                        placeholder='temporary password'
                        onKeyPress={(e) => checkTempPass(e, e.target.value)}
                    />
                
                }
                {showUpdateEmail &&
                    <input placeholder='new password' 
                        style={{position: 'absolute', textAlign: 'center', top: 26, right: 9}} 
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => updatePassword(e, e.target.value)} 
                    />
                }
            </div>
            }
            {(!props.user.user.isLoggedIn && !login && !register) ? <button className='login-button' onClick={() => setLogin(!login)}>Login</button> : null}
            {(!props.user.user.isLoggedIn && !login && !register) ? <button className='login-button' onClick={() => setRegister(!register)}>Register</button> : null}
            {props.user.user.isLoggedIn &&
                <button className='login-button' onClick={() => props.logoutUser()}>Logout</button>
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

export default connect(mapState, {registerUser, loginUser, logoutUser, getUser, getFavorites})(Login);