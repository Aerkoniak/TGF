import React from 'react';
import { connect } from 'react-redux'

import RegisterForm from './RegisterForm'


const LoginPanel = ({ logIn }) => {

    return (
        <section className="loginPanel">
            <p className="loadPage">Oude Aard</p>
            <p className="loadPage">Tekstowa Gra Fabularna</p>
            
            <div className="logPanel">
                <div className="login" onClick={logIn} >
                    <p className="logSent">Zaloguj</p>
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