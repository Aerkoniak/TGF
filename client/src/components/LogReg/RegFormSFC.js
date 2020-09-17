import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { createAccount } from '../../data/actions/generalActions'

const RegFormSFC = ({ regClassName, isLogged, createAccount }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repPass, setRepPass] = useState("");
    const [information, setInformation] = useState("");
    const [warnings, setWarnings] = useState(false);

    const submitForm = e => {
        e.preventDefault();

        let isFormOk = false;
        let account = {};

        if (login === "" || password === "" || repPass === "") {
            setInformation("Wszystkie pola muszą zostać wypełnione.");
            setWarnings(true);
        } else if (password.length < 3) {
            setInformation("Twoje hasło musi być dłuższe niż 3 znaki.");
            setWarnings(true);
        } else if (password !== repPass) {
            setInformation("Twoje hasła muszą być takie same.");
            setWarnings(true);
        } else if (login === " " || login === "  ") {
            setInformation("Twoje hasło nie może być spacją.");
            setWarnings(true);
        } else {
            isFormOk = true;
            account.login = login;
            account.password = password;
            account.repPass = repPass;
        }

        if (isFormOk) {
            createAccount(account);
            setInformation("Twoje konto jest zakładane");
            setWarnings(true)
        }
    }


    return (
        <form className={regClassName} onSubmit={submitForm} >
            <input className="regInput" type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} />
            <input className="regInput" type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="regInput" type="password" id="repPass" value={repPass} onChange={(e) => setRepPass(e.target.value)} />
            { isLogged === "checking" ?
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                :
                <input className="registerSubmit" type="submit" value="Zarejestruj" onSubmit={submitForm} />
            }
            {/* <input className="registerSubmit" type="submit" value="Zarejestruj" onSubmit={submitForm} /> */}
            {warnings ? <p>{information}</p> :
                <div className="info">
                    <p className="formInfo">Mail jest niepotrzebny do rejestracji.</p>
                    <p className="formInfo">Logować będzie można się nickiem, jak i nazwą postaci (po wypełnieniu kreatora).</p>
                </div>}
        </form>
    );
}

const MapStateToProps = state => ({
    isLogged: state.player.isLogged
})

const MapDispatchToProps = (dispatch) => {
    return {
        createAccount: (account) => dispatch(createAccount(account))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(RegFormSFC);