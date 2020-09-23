import React from 'react';
import { connect } from 'react-redux';

import { toggleAutoLog } from '../../data/actions/generalActions';

const AutoLogUtility = ({ autoLog, player, toggleAutoLog }) => {

    const toggleAutoLogSupporter = () => {
        let log = {};
        log.login = player.login;
        log.pass = player.password;

        if (!autoLog) {
            log.argument = true;
            toggleAutoLog(log)
        } else if (autoLog) {
            log.argument = false;
            toggleAutoLog(log)
        }
    }

    return (
        <div className="autoLogUtility">
            <label className="settingsLabel" htmlFor="autoLog">Chciałbym włączyć autologowanie:</label><input type="checkbox" name="" id="autoLog" className="settingInput" defaultChecked={autoLog} onChange={toggleAutoLogSupporter} />
        </div>
    );
}

const MapStateToProps = state => ({
    autoLog: state.player.autoLog,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        toggleAutoLog: (log) => dispatch(toggleAutoLog(log))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(AutoLogUtility);