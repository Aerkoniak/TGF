import React, { useState } from 'react';
import { connect } from 'react-redux';

import { toggleAutoLog } from '../../data/actions/generalActions';

const AutoLogUtility = ({ autoLog, player, toggleAutoLog }) => {

    const [confirmAutolog, setConfirm] = useState(false);
    const [passValue, setPassValue] = useState("");

    const toggleAutoLogSupporter = () => {
        let log = {};
        log.login = player.login;
        setConfirm(!confirmAutolog)

        if (autoLog) {
            log.argument = false;
            toggleAutoLog(log)
        }
    }
    const sendConfirmAutolog = (e) => {
        e.preventDefault()

        let log = {};
        log.login = player.login;
        log.pass = passValue;
        log.argument = true;
        toggleAutoLog(log);
        setPassValue("");
        setConfirm(!confirmAutolog)
    }

    return (
        <div className="autoLogUtility">
            <label className="settingsLabel" htmlFor="autoLog">Chciałbym włączyć autologowanie:</label><input type="checkbox" name="" id="autoLog" className="settingInput" defaultChecked={autoLog} onChange={toggleAutoLogSupporter} />
            {confirmAutolog ? <div className="autologWrap">
                <label className="autologLabel" htmlFor="confirmAutolog">Potwierdź swoje hasło:</label>
                <input className="autologPass" type="text" id="confirmAutolog" value={passValue} onChange={(e) => setPassValue(e.target.value)} />
                <button className="confirmAutolog" onClick={sendConfirmAutolog}>Prześlij</button>
            </div> : null}
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