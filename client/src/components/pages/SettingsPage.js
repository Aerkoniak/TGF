import React, { useState } from 'react';
import { connect } from 'react-redux';
import { toggleHand } from '../../data/actions/generalActions'

import LeftHandedUtility from '../LeftHandedUtility/LeftHandedUtility';
import AutoLogUtility from '../AutoLogUtility/AutoLogUtility';

const SettingsPage = () => {


    return (
        <section className="settingsPage mainPage">

            <div className="desktopSetting">
                <h2 className="test">Ustawienia konta:</h2>
                
                <AutoLogUtility />

                <section className="notepadDesktop">
                    <h4 className="note">Notatnik roboczy:</h4>
                </section>
            </div>



            <div className="mobileSettings">
                <h2 className="test">Ustawienia konta</h2>

                <AutoLogUtility />
                <LeftHandedUtility />
               
                <section className="notepad">
                    <h4 className="note">Notatnik roboczy:</h4>
                    <p className="test">Czy te boczne menu powinno być dostępne cały czas czy chowane pod "hamburgerem" i pokazywana po aktywacji?</p>
                    <p className="test">Hamburger to to ustrojstwo - <i className="fas fa-bars"></i></p>
                </section>
            </div>
        </section>
    );
}

// const MapStateToProps = (state) => ({
//     isLeftHanded: state.player.isLeftHanded
// })

// const MapDispatchToProps = dispatch => {
//     return {
//         toggleHand: (argument) => dispatch(toggleHand(argument))
//     }
// }

export default SettingsPage;
// export default connect(MapStateToProps, MapDispatchToProps)(SettingsPage);