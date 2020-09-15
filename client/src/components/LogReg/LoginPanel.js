import React, { useState } from 'react';
import { connect } from 'react-redux'

import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'


const LoginPanel = ({ logIn }) => {

    const [isLogFormVisible, setLogVisibility] = useState(true);
    const [isRegFormVisible, setRegVisibility] = useState(true);

    const toggleFormsVisibility = (e) => {
        if (e.target.className === "logSent") {
            setLogVisibility(!isLogFormVisible)
            if (isRegFormVisible) {
                setRegVisibility(false)
            }
        } else {
            setRegVisibility(!isRegFormVisible);
            if (isLogFormVisible) {
                setLogVisibility(false)
            }
        }
    }

    return (
        <section className="loginPanel">
            <p className="loadPage">Oude Aard</p>
            <p className="loadPage">Tekstowa Gra Fabularna</p>

            <div className="logPanel">
                <div className="login" >
                    <p className="logSent" onClick={toggleFormsVisibility}>Zaloguj</p>
                    <LoginForm loginClassName={isLogFormVisible ? "loginForm" : "loginForm hidden"} />
                </div>
                <div className="reg">
                    <p className="regSent" onClick={toggleFormsVisibility}>Zarejestruj</p>
                    <RegisterForm formClassName={isRegFormVisible ? "registerForm" : "registerForm hidden"} />
                </div>
            </div>
        </section>

    );
}

const MapDispatchToProps = (dispatch) => {
    return {
        logIn: () => dispatch({ type: "LOG_IN" })
    }
}

export default connect(null, MapDispatchToProps)(LoginPanel);