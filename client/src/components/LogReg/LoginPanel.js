import React from 'react';
import { connect } from 'react-redux'

import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'


const LoginPanel = ({ logIn }) => {

    return (
        <section className="loginPanel">
            <p className="loadPage">Oude Aard</p>
            <p className="loadPage">Tekstowa Gra Fabularna</p>
            
            <div className="logPanel">
                <div className="login" >
                    <p className="logSent">Zaloguj</p>
                    <LoginForm loginClassName="loginForm" />
                </div>
                <div className="reg">
                    <p className="regSent">Zarejestruj</p>
                    <RegisterForm formClassName="registerForm" />
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