import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { toggleHand } from '../../data/actions/generalActions'
import { auth } from '../../data/firebase/firebaseConfig'
import { signOut, sendVerification } from '../../data/firebase/firebaseActions'
import { resetCharacter } from '../../data/actions/creatorActions';

import { Spinner, Button } from 'react-bootstrap'


import LeftHandedUtility from '../LeftHandedUtility/LeftHandedUtility';
import AutoLogUtility from '../AutoLogUtility/AutoLogUtility';
import SetRankUtility from '../SetRankUtility/SetRankUtility';
import DropZone from '../DropZone/DropZone';

const SettingsPage = ({ player, isLogged, signOut, sendVerification, resetCharacter }) => {

    const [redirect, setRedirect] = useState(false);
    const [verifyButtonActive, hideVerifyButton] = useState(false);
    const [setAvatar, confirmSettingAvatar] = useState(false);
    const [reset, toggleReset] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            console.log("SettingsPage - useEffect - onAuthStateChanged - res")
            console.log(user)
            if (!user.emailVerified) hideVerifyButton(true);
        })
    }, [])

    const verificationSupporter = (player) => {
        sendVerification(player.login)
    }
    const resetSupporter = () => {
        toggleReset(true);
        let char = player;
        console.log("Reset")
        resetCharacter(char);
        setTimeout(() => {
            toggleReset(false)
        }, 500)
    }
    const signOutSupporter = () => {
        signOut()
        setRedirect(true)
    }

    return (
        <section className="settingsPage mainPage">

            <div className="desktopSetting">
                <div className="gameSettings">
                    <h2 className="test">Ustawienia gry:</h2>
                    {verifyButtonActive ? <button className="verifyBtn" onClick={verificationSupporter}>Wyślij e-mail weryfikacyjny</button> : null}

                    <AutoLogUtility />
                    <p className="logOutUtility" onClick={signOutSupporter}>Wyloguj mnie</p>
                </div>
                <div className="accountSettings">
                    <h2 className="test">Ustawienia konta:</h2>
                    {player.rank != 10 ? <SetRankUtility /> : null}

                    {reset ? <Spinner animation="border" /> : <Button variant="outline-dark" onClick={resetSupporter}>Zresetuj swoją postać</Button>}


                    <button className="resetCharacter" onClick={e => confirmSettingAvatar(!setAvatar)} >Dodaj avatar</button>
                    {setAvatar ? <DropZone /> : null}

                </div>



            </div>



            <div className="mobileSettings">
                <div className="gameSettings">
                    <h2 className="test">Ustawienia gry</h2>
                    <AutoLogUtility />
                    <LeftHandedUtility />
                    <p className="logOutUtility" onClick={signOut}>Wyloguj mnie</p>
                </div>
                <div className="accountSettings">
                    <h2 className="test">Ustawienia konta:</h2>
                    <SetRankUtility />
                </div>


            </div>
            {redirect ? <Redirect to="/login" /> : null}
        </section>
    );
}

const MapStateToProps = (state) => ({
    player: state.player.player,
    isLogged: state.player.isLogged
})

const MapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        sendVerification: email => dispatch(sendVerification(email)),
        resetCharacter: (char) => dispatch(resetCharacter(char))
    }
}

// export default SettingsPage;
export default connect(MapStateToProps, MapDispatchToProps)(SettingsPage);