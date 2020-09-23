import React from 'react';
import { connect } from 'react-redux';

import { toggleHand } from '../../data/actions/generalActions'

const LeftHandedUtility = ({ isLeftHanded, toggleHand }) => {

    const toggleHandSupporter = () => {
        if (!isLeftHanded) {
            toggleHand(true)
        } else if (isLeftHanded) {
            toggleHand(false)
        }
    }

    return (
        <div className="leftHandedUtility">
            <label className="settingsLabel" htmlFor="isLeftHanded">Wolę nawigację z lewej strony:</label>
            <input className="settingInput" type="checkbox" name="" id="isLeftHanded" defaultChecked={isLeftHanded} onChange={toggleHandSupporter} />
        </div>
    );
}

const MapStateToProps = (state) => ({
    isLeftHanded: state.player.isLeftHanded
})

const MapDispatchToProps = dispatch => {
    return {
        toggleHand: (argument) => dispatch(toggleHand(argument))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(LeftHandedUtility);