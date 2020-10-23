import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { auth } from '../../data/firebase/firebaseConfig'


const VerifyPage = () => {

    const [redirectToMain, forceRedirect] = useState(false);

    const verifyMail = () => {
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



        const handleVerifyEmail = (auth, actionCode, continueUrl, lang) => {
            console.log("Kolejny etap weryfikacji")
            // Try to apply the email verification code.
            auth.applyActionCode(actionCode).then((resp) => {
                console.log("Zweryfikowany");
                forceRedirect(true);
            }).catch(function (error) {
                // again.
            });
        }

        switch (mode) {
            case 'verifyEmail':
                // Display email verification handler and UI.
                handleVerifyEmail(auth, actionCode, continueUrl, lang);
                break;
            default:
            // Error: invalid mode.
        }
    }

    useEffect(() => {
        console.log("Weryfikacja wstępna");
        if (document.readyState !== "loading") {
            console.log("Weryfikacja wstępna etap II");
            verifyMail()
        } else {
            console.log("Weryfikacja wstępna etap 1.5");
            document.addEventListener('DOMContentLoaded', verifyMail);
        }
    }, [])

    return (
        <section className="verifyPage">
            <p className="loadPage gameName" >Oude Aard</p>
            <p className="loadPage gameDesc" >Twoja Tekstowa Gra Fabularna</p>
            <p className="logOutinfo">Weryfikacja e-mail.</p>
            {redirectToMain ? <Redirect to="/" /> : null}
        </section>
    );
}

export default VerifyPage;