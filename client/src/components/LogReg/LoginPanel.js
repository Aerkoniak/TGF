import React from 'react';
import { connect } from 'react-redux'


const LoginPanel = ({ logIn }) => {

    return (

        <div className="logPanel">
            <div className="login" onClick={ logIn } >Zaloguj</div>
            <div className="reg">Zarejestruj</div>
        </div>

    );
}

const MapDispatchToProps = (dispatch) => {
    return {
        logIn: () => dispatch({ type: "LOG_IN" })
    }
}

export default connect(null,MapDispatchToProps)(LoginPanel);