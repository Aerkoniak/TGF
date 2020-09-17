import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { logInPlayer } from '../../data/actions/generalActions';



const LogFormSFC = ({ loginClassName, msg, isLogged, logInPlayer }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [warnings, setWarning] = useState(false);

    const submitLogin = e => {
        e.preventDefault();
        let account = {};
        account.login = login;
        account.password = password;
        logInPlayer(account);
    }

    useEffect(() => {
        if (msg) {
            setWarning(msg);
        }
    }, [msg])

    // const loadingIndicator = () => (
    //     <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    // )
    // const loginSubmit = () => {
    //     return (
    //         <input className='loginSubmit' type="submit" value="Zaloguj" onSubmit={submitLogin} />
    //     )
    // }

    return (
        <form className={loginClassName} onSubmit={submitLogin}>
            <input className="logInput" type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} />
            <input className="logInput" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            { isLogged === "checking" ?
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                :
                <input className='loginSubmit' type="submit" value="Zaloguj" onSubmit={submitLogin} />
            }
            {/* <input className='loginSubmit' type="submit" value="Zaloguj" onSubmit={submitLogin} /> */}
            { warnings ? <p>{warnings}</p> : <p className="formInfo">Później będzie można logować się loginem lub imieniem postaci. Powiem kiedy.</p>}

        </form>
    );
}

const MapStateToProps = state => ({
    msg: state.player.msg,
    isLogged: state.player.isLogged
})

const MapDispatchToProps = (dispatch) => {
    return {
        logInPlayer: (account) => dispatch(logInPlayer(account))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(LogFormSFC);