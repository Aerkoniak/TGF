import React from 'react';
import { connect } from 'react-redux';



const SettingsPage = ( {isLeftHanded, toggleHand }) => {
    console.log(isLeftHanded)
    return ( 
        <section className="settingsPage mainPage">
            <h2>Ustawienia konta</h2>
            <label htmlFor="isLeftHanded">Wolę nawigację z lewej strony:</label>
            <input type="checkbox" name="" id="isLeftHanded" onChange={toggleHand} />
        </section>
     );
}
 
const MapStateToProps = (state) => ({
    isLeftHanded: state.player.isLeftHanded
})
const MapDispatchToProps = dispatch => {
    return {
        toggleHand: () => dispatch({ type: "TOGGLE_HAND" })
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(SettingsPage);