import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { logInPlayer } from '../../data/actions/generalActions';
import { signInFirebase } from '../../data/firebase/firebaseActions';
import { Spinner, Button } from 'react-bootstrap';

import styles from '../../css/login.module.css'



const LogFormSFC = ({ player, loginClassName, msg, isLogged, logInPlayer, signInFirebase }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [warnings, setWarning] = useState(false);

    const submitLogin = e => {
        e.preventDefault();
        let account = {};
        account.login = login;
        if (login === "Konto testowe") {
            let login = process.env.REACT_APP_TEST_LOGIN;
            let testPass = process.env.REACT_APP_TEST_PASS
            account.login = login;
            signInFirebase(login, testPass, account);
        } else {
            signInFirebase(login, password, account);
        }
    }

    useEffect(() => {
        if (msg) {
            setWarning(msg);
        }
    }, [msg])


    return (
        <form className={loginClassName} onSubmit={submitLogin}>

            <input className="logInput" type="text" id="login" placeholder="twój e-mail" value={login} onChange={(e) => setLogin(e.target.value)} />
            <input className="logInput" type="password" id="password" placeholder="twoje hasło" value={password} onChange={(e) => setPassword(e.target.value)} />



            <div className={styles.wrap}>
                {warnings ? <p className={styles.warning}>{warnings}</p> : null}

                {isLogged === "checking" ? <Spinner animation="border" variant="danger" /> : <Button variant="outline-dark" type="submit" onClick={submitLogin} onSubmit={submitLogin} >Zaloguj</Button>}

                <p className={styles.info}><Link to="/login/reminder">Zapomniałem hasła</Link></p>
            </div>


            {isLogged === "logged" ? <Redirect to="/" /> : null}
        </form>
    );
}

const MapStateToProps = state => ({
    msg: state.player.msg,
    isLogged: state.player.isLogged,
    player: state.player.player
})

const MapDispatchToProps = (dispatch) => {
    return {
        logInPlayer: (account) => dispatch(logInPlayer(account)),
        signInFirebase: (email, password, account) => dispatch(signInFirebase(email, password, account)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(LogFormSFC);