import React, { useState } from "react";
import swal from "sweetalert";
import { connect } from "react-redux";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser
} from "../ducks/userReducer";
import { getFavorites } from "../ducks/favoritesReducer";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import {
  testUserName,
  testEmailValidity,
  testPassword
} from "./../Logic/brittneyfunctions";

library.add(faBan);

function Login(props) {
  const [user_name, setUserName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState("");
  const [tempPass, setTempPass] = useState("");
  const [showPassReset, setShowPassReset] = useState(false);

  const processUser = async event => {
    if (event.key === "Enter" && login) {
      console.log(login);
      const user = await props.loginUser({ user_email, password });
      if (user.value.user_id) {
        props.getFavorites(user.value.user_id);
        setUserEmail("");
        setPassword("");
        setLogin(false);
      } else
        swal({ text: `${user.value.message}`, button: false, timer: 3000 });
    } else if (event.key === "Enter" && register) {
      let name = await testUserName(user_name);
      if (name !== "Name accepted.") {
        return swal({ text: `${name}`, button: false, timer: 3000 });
      }
      let email = await testEmailValidity(user_email);
      if (!email.includes("@")) {
        return swal({ text: `${email}`, button: false, timer: 3000 });
      }
      let pass = await testPassword(password);
      if (pass !== "Password accepted") {
        return swal({ text: `${pass}`, button: false, timer: 3000 });
      }
      const user = await props.registerUser({
        user_name,
        user_email,
        password
      });
      if (user.value.user_id) {
        props.getFavorites(user.value.user_id);
        setUserName("");
        setUserEmail("");
        setPassword("");
        setRegister(false);
      } else
        swal({ text: `${user.value.message}`, button: false, timer: 3000 });
    }
  };

  function sendEmail(event) {
    if (event.key === "Enter") {
      let randomStr = Math.random()
        .toString(15)
        .slice(-10);
      setTempPass(randomStr);
      axios.post("/reset", { email, randomStr });
    }
  }

  function checkTempPass(event, value) {
    if (event.key === "Enter" && value === tempPass) {
      setShowPassReset(true);
    }
  }

  function updatePassword(event, value) {
    if (event.key === "Enter") {
      axios.post("/updatePassword", { value, email }).then(() => {
        setEmail("");
        setShowPassReset(false);
        setShowReset(false);
        setTempPass("");
      });
    }
  }

  return (
    <div className="nav">
      {props.user.user.isLoggedIn ? (
        <p className="user-name">{props.user.user.user_name}</p>
      ) : null}
      {register ? (
        <div className="text-input">
          <input
            className="input-box"
            type="text"
            placeholder="name"
            value={user_name}
            onChange={e => setUserName(e.target.value)}
          />
          <span className="bottom" />
          <span className="right" />
          <span className="top" />
          <span className="left" />
        </div>
      ) : null}
      {login || register ? (
        <div className="text-input">
          <input
            className="input-box"
            type="text"
            placeholder="email"
            value={user_email}
            onChange={e => setUserEmail(e.target.value)}
          />
          <span className="bottom" />
          <span className="right" />
          <span className="top" />
          <span className="left" />
        </div>
      ) : null}
      {login || register ? (
        <div className="text-input">
          <input
            className="input-box"
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => processUser(e)}
          />
          <span className="bottom" />
          <span className="right" />
          <span className="top" />
          <span className="left" />
        </div>
      ) : null}
      {(login || register) && (
        <div>
          <button
            className="cancel-button"
            onClick={() => {
              setUserName("");
              setPassword("");
              setUserEmail("");
              {
                login ? setLogin(!login) : setRegister(!register);
                setShowReset(false);
              }
            }}
          >
            <FontAwesomeIcon icon="ban" />
          </button>
        </div>
      )}
      {login && (
        <div
          className="forgot-password-container"
          style={{
            width: 150,
            position: "absolute",
            top: 45,
            right: 130,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <button
            className="forgot-password-btn"
            onClick={() => setShowReset(!showReset)}
          >
            forgot password?
          </button>
          {showReset && (
            <div className="text-input new-email">
              <input
                className="input-box"
                type="text"
                placeholder="email"
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => sendEmail(e)}
              />
              <span className="bottom" />
              <span className="right" />
              <span className="top" />
              <span className="left" />
              {tempPass !== "" && (
                <div className="text-input temp-pass">
                  <input
                    className="input-box"
                    placeholder="temporary password"
                    onKeyPress={e => checkTempPass(e, e.target.value)}
                  />
                  <span className="bottom" />
                  <span className="right" />
                  <span className="top" />
                  <span className="left" />
                </div>
              )}
            </div>
          )}
          {showPassReset && (
            <div className="text-input">
              <input
                className="input-box new-pass"
                placeholder="new password"
                onKeyPress={e => updatePassword(e, e.target.value)}
              />
              <span className="bottom" />
              <span className="right" />
              <span className="top" />
              <span className="left" />
            </div>
          )}
        </div>
      )}
      {!props.user.user.isLoggedIn && !login && !register ? (
        <button className="login-button" onClick={() => setLogin(!login)}>
          Login
        </button>
      ) : null}
      {!props.user.user.isLoggedIn && !login && !register ? (
        <button className="login-button" onClick={() => setRegister(!register)}>
          Register
        </button>
      ) : null}
      {props.user.user.isLoggedIn && (
        <button className="login-button" onClick={() => props.logoutUser()}>
          Logout
        </button>
      )}
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
  { registerUser, loginUser, logoutUser, getUser, getFavorites }
)(Login);
