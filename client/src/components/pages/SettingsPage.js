import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { toggleHand } from '../../data/actions/generalActions'
import { auth } from '../../data/firebase/firebaseConfig'
import { signOut } from '../../data/firebase/firebaseActions'


import LeftHandedUtility from '../LeftHandedUtility/LeftHandedUtility';
import AutoLogUtility from '../AutoLogUtility/AutoLogUtility';
import SetRankUtility from '../SetRankUtility/SetRankUtility';

const SettingsPage = ({ signOut }) => {
    const [redirect, setRedirect] = useState(false)

    return (
        <section className="settingsPage mainPage">

            <div className="desktopSetting">
                <div className="gameSettings">
                    <h2 className="test">Ustawienia gry:</h2>
                    <AutoLogUtility />
                    <p className="logOutUtility" onClick={signOut}>Wyloguj mnie</p>
                </div>
                <div className="accountSettings">
                    <h2 className="test">Ustawienia konta:</h2>
                    <SetRankUtility />
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

// const MapStateToProps = (state) => ({
//     isLeftHanded: state.player.isLeftHanded
// })

const MapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    }
}

// export default SettingsPage;
export default connect(null, MapDispatchToProps)(SettingsPage);