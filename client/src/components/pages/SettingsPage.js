import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toggleHand } from '../../data/actions/generalActions'
import { auth } from '../../data/firebase/firebaseConfig'
import { signOut, sendVerification } from '../../data/firebase/firebaseActions'
import { resetCharacter } from '../../data/actions/creatorActions';

import { Spinner, Button } from 'react-bootstrap';
import styles from '../../css/settings.module.css';


import LeftHandedUtility from '../LeftHandedUtility/LeftHandedUtility';
import AutoLogUtility from '../AutoLogUtility/AutoLogUtility';
import SetRankUtility from '../SetRankUtility/SetRankUtility';
import DropZone from '../DropZone/DropZone';

const SettingsPage = ({ player, isLogged, signOut, sendVerification, resetCharacter }) => {

    const [redirect, setRedirect] = useState(false);
    const [verifyButtonActive, hideVerifyButton] = useState(false);
    const [setAvatar, confirmSettingAvatar] = useState(false);
    const [reset, toggleReset] = useState(false);

    const [value, changeValue] = useState("Zmień")

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            console.log("SettingsPage - useEffect - onAuthStateChanged - res")
            console.log(user)
            if (!user.emailVerified) hideVerifyButton(true);
        })
    }, [])

    // const verificationSupporter = (player) => {
    //     sendVerification(player.login)
    // }

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

    const changeByEveryone = () => {
        axios.post('/everyone', { player })
    }

    return (
        <section className="settingsPage mainPage">
            {player.rank <= 2 ?
                < Link to="/panel"><Button variant="outline-warning">Przejdź do Panelu</Button></Link>
                : null}


            <div className="desktopSetting">
                <div className="gameSettings">

                    {/* <h2 className="test">Ustawienia gry:</h2> */}

                    {/* {verifyButtonActive ? <button className="verifyBtn" onClick={verificationSupporter}>Wyślij e-mail weryfikacyjny</button> : null} */}

                    {/* <AutoLogUtility /> */}

                </div>

                <div className={styles.accountSettings}>

                    <h2 className="test">Ustawienia konta:</h2>

                    <Button className={styles.btn} variant="outline-success" onClick={e => confirmSettingAvatar(!setAvatar)} >Dodaj avatar</Button>
                    {setAvatar ? <DropZone /> : null}

                    {reset ? <Spinner className={styles.btn} animation="border" /> : <Button className={styles.btn} variant="outline-dark" onClick={resetSupporter}>Zresetuj swoją postać</Button>}

                    <Button className={styles.btn} variant="outline-danger" onClick={signOutSupporter} >Wyloguj</Button>

                    {player.rank === 0 ? <Button onClick={changeByEveryone}>Test</Button> : null}


                    {/* {player.rank != 10 ? <SetRankUtility /> : null} */}

                </div>



            </div>



            <div className="mobileSettings">
                <div className="gameSettings">
                    <h2 className="test">Ustawienia konta</h2>
                    {/* <AutoLogUtility /> */}
                    <LeftHandedUtility />

                    <Button variant="outline-danger" onClick={signOutSupporter} >Wyloguj</Button>
                </div>


            </div>
            { redirect ? <Redirect to="/login" /> : null}
        </section >
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