import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { createAccount } from '../../data/actions/generalActions';
import { createDate } from '../../data/usefullFN'
import { Spinner, Button } from 'react-bootstrap'
import styles from '../../css/login.module.css'


import { Firebase } from '../../data/firebase/firebaseConfig';
import { createFirebaseAccount, signInFirebase } from '../../data/firebase/firebaseActions';





const RegFormSFC = ({ regClassName, isLogged, createAccount, createFirebaseAccount, signInFirebase }) => {

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
        } else if (password.length < 6) {
            setInformation("Twoje hasło musi być dłuższe niż 6 znaków.");
            setWarnings(true);
        } else if (password !== repPass) {
            setInformation("Twoje hasła muszą być takie same.");
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

            <div className="info">
                <p className="formInfo header">Regulamin rejestracji:</p>
                <p className="formInfo">Hasło musi mieć 6 znaków/liter długości.</p>
                <p className="formInfo">Do prawidłowego działania niezbędne jest kliknięcie w link weryfikacyjny.</p>
                {/* <p className="formInfo"></p> */}
            </div>

            <input className="regInput" type="text" id="login" placeholder="Podaj swój e-mail" value={login} onChange={(e) => setLogin(e.target.value)} />
            <input className="regInput" type="password" id="pass" placeholder="Podaj hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="regInput" type="password" id="repPass" placeholder="Powtórz hasło" value={repPass} onChange={(e) => setRepPass(e.target.value)} />


            <div className={styles.wrap}>
                {warnings ? <p className={styles.warning}>{warnings}</p> : null}
                {information ? <p className={styles.warning}>{information}</p> : null}

                {isLogged === "checking" ? <Spinner animation="border" variant="danger" /> : <Button variant="outline-dark" type="submit" onClick={submitForm} >Zarejestruj</Button>}
            </div>



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