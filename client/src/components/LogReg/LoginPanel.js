import React from 'react';
import { connect } from 'react-redux'


const LoginPanel = ({ logIn }) => {

    return (
        <section className="loginPanel mainPage">
            <p className="loadPage">Oude Aard</p>
            <p className="loadPage">Tekstowa Gra Fabularna</p>
            
            <div className="logPanel">

                <div className="login" onClick={logIn} >Zaloguj</div>
                <div className="reg">Zarejestruj</div>
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