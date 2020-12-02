import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap'

import { auth } from '../../data/firebase/firebaseConfig';
import { signInFirebase } from '../../data/firebase/firebaseActions';

const ResetPasswordPage = ({ signInFirebase }) => {

    const [redirect, forceRedirect] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [password, setPassword] = useState("");
    const [repPass, setRepPass] = useState("");
    const [warnings, setWarnigns] = useState("")

    const resetPassword = () => {
        setSpinner(true)
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        // Get the action to complete.
        const mode = getParameterByName('mode');
        // Get the one-time code from the query parameter.
        console.log(mode)
        const actionCode = getParameterByName('oobCode');
        // (Optional) Get the continue URL from the query parameter if available.
        const continueUrl = getParameterByName('continueUrl');
        // (Optional) Get the language code if available.
        const lang = getParameterByName('lang') || 'pl';



        // const handleVerifyEmail = (auth, actionCode, continueUrl, lang) => {
        //     console.log("Kolejny etap weryfikacji")
        //     // Try to apply the email verification code.
        //     auth.applyActionCode(actionCode).then((resp) => {
        //         console.log("Zweryfikowany");
        //         forceRedirect(true);
        //     }).catch(function (error) {
        //         // again.
        //     });
        // }

        const handleResetPassword = (auth, actionCode, continueUrl, lang) => {
            console.log("resetPassword - etap 2");
            let accountEmail = null;

            auth.verifyPasswordResetCode(actionCode)
                .then(email => {
                    console.log("resetPassword - etap 3", email);
                    accountEmail = email;
                    let newPassword = ""
                    if (password === repPass) {
                        newPassword = password;
                        auth.confirmPasswordReset(actionCode, newPassword)
                            .then(resp => {
                                auth.signInWithEmailAndPassword(accountEmail, newPassword);
                                console.log("Hasło zmienione");
                                let account = {}
                                account.login = accountEmail;
                                signInFirebase(accountEmail, newPassword, account)
                                forceRedirect(true)
                            })
                            .catch(err => console.log(err))
                    }
                    else if (password != repPass) {
                        setWarnigns("Hasła nie są takie same.")
                        setPassword("")
                        setRepPass("")
                    }

                })
                .catch(err => console.log(err))
        }

        switch (mode) {
            case 'resetPassword':
                // Display email verification handler and UI.
                handleResetPassword(auth, actionCode, continueUrl, lang);
                break;
            default:
            // Error: invalid mode.
        }
    }

    return (
        <section className="verifyPage">
            <p className="loadPage gameName" >Oude Aard</p>
            <p className="loadPage gameDesc" >Twoja Tekstowa Gra Fabularna</p>
            <p className="logOutinfo">Zmiana hasła</p>
            {warnings ? warnings : null}
            <div className="resetForm">
                <input className="regInput" type="password" id="pass" placeholder="Podaj hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input className="regInput" type="password" id="repPass" placeholder="Powtórz hasło" value={repPass} onChange={(e) => setRepPass(e.target.value)} />
            </div>
            <Button variant="outline-dark" onClick={resetPassword} >{spinner ? <Spinner animation="border" variant="dark" /> : `Zatwierdź hasło`}</Button>
            {redirect ? <Redirect to="/" /> : null}
        </section>
    );
}

const MapDispatchToProps = dispatch => ({
    signInFirebase: (login, email, account) => dispatch(signInFirebase(login, email, account))
})

export default connect(null, MapDispatchToProps)(ResetPasswordPage);