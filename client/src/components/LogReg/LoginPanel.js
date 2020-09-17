import React, { useState } from 'react';
// import { connect } from 'react-redux'

//  ClassComponents
// import RegisterForm from './RegisterForm'
// import LoginForm from './LoginForm'

import LogFormSFC from './LogFormSFC'
import RegFormSFC from './RegFormSFC'


const LoginPanel = () => {

    const [isLogFormVisible, setLogVisibility] = useState(false);
    const [isRegFormVisible, setRegVisibility] = useState(false);

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
                    <LogFormSFC loginClassName={isLogFormVisible ? "loginForm" : "loginForm hidden"} />
                </div>
                <div className="reg">
                    <p className="regSent" onClick={toggleFormsVisibility}>Zarejestruj</p>
                    <RegFormSFC regClassName={isRegFormVisible ? "registerForm" : "registerForm hidden"} />
                </div>
            </div>
        </section>

    );
}



export default LoginPanel;