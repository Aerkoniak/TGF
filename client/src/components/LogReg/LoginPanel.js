import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';


//  ClassComponents
// import RegisterForm from './RegisterForm'
// import LoginForm from './LoginForm'

// import { parseString } from '../../data/parseString';
import { AutoLogging } from '../../data/actions/generalActions';

import LogFormSFC from './LogFormSFC'
import RegFormSFC from './RegFormSFC'


const LoginPanel = ({ autoLog, AutoLogging }) => {

    useEffect(() => {
        const cookie = Cookies.get('autoLog');
        if (cookie === "true"){
            AutoLogging()
        } 
    }, [])

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
            <p className={isLogFormVisible || isRegFormVisible ? "loadPage gameName formVisible" : "loadPage gameName" } >Oude Aard</p>
            <p className={isLogFormVisible || isRegFormVisible ? "loadPage gameDesc hidden" : "loadPage gameDesc"} >Twoja Tekstowa Gra Fabularna</p>

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

const MapStateToProps = state => ({
    autoLog: state.player.autoLog
})

const MapDispatchToProps = dispatch => {
    return {
        AutoLogging: () => dispatch(AutoLogging())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(LoginPanel);