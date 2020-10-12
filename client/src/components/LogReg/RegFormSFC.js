import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { createAccount } from '../../data/actions/generalActions';
import {createDate} from '../../data/usefullFN'

import { Firebase } from '../../data/firebase/firebaseConfig';
import { createFirebaseAccount, signInFirebase } from '../../data/firebase/firebaseActions';





const RegFormSFC = ({ regClassName, isLogged, createAccount, createFirebaseAccount,signInFirebase }) => {

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
            account.registrationDay = createDate();

        }

        if (isFormOk) {
            // createAccount(account);
            console.log(account)
            createFirebaseAccount(account, login, password)
            setInformation("Twoje konto jest zakładane");
            setWarnings(true)
        }
    }


    return (
        <form className={regClassName} onSubmit={submitForm} >
            {warnings ? <p>{information}</p> :
                <div className="info">
                    <p className="formInfo header">Regulamin rejestracji:</p>
                    <p className="formInfo">Po rejestracji należy zweryfikować adres e-mail.</p>
                    <p className="formInfo header">ale weryfikacja NIE DZIAŁA - jeszcze</p>
                    <p className="formInfo">Drugi punkt regulaminu, na który nie mam pomysłu.</p>
                    <p className="formInfo">Trzeci punkt regulaminu, w którym również nie wiem co wsadzić.</p>
                </div>}
            <input className="regInput" type="text" id="login" placeholder="Podaj swój e-mail" value={login} onChange={(e) => setLogin(e.target.value)} />
            <input className="regInput" type="password" id="pass" placeholder="Podaj hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="regInput" type="password" id="repPass" placeholder="Powtórz hasło" value={repPass} onChange={(e) => setRepPass(e.target.value)} />
            { isLogged === "checking" ?
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                :
                <input className="registerSubmit" type="submit" value="Zarejestruj" onSubmit={submitForm} />
            }
            {/* <input className="registerSubmit" type="submit" value="Zarejestruj" onSubmit={submitForm} /> */}
        </form>
    );
}

const MapStateToProps = state => ({
    isLogged: state.player.isLogged
})

const MapDispatchToProps = (dispatch) => {
    return {
        createAccount: (account) => dispatch(createAccount(account)),
        createFirebaseAccount: (account, email, password) => dispatch(createFirebaseAccount(account, email, password)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(RegFormSFC);