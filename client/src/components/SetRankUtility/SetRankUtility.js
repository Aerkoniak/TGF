import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { setRank } from '../../data/actions/generalActions';

const SetRankUtility = ({ player, msg, setRank }) => {

    const [rankValue, setRankValue] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        setRankValue(String(player.rank))
    }, [player])

    useEffect(() => {
        if (msg) {
            setWarning(msg)
        }
    }, [msg])

    const submitRankUpdate = (e) => {
        e.preventDefault();
        let char = {};
        char.accountDocRef = player.accountDocRef;
        char.newRank = Number(rankValue);
        if (player.rank > 0 && char.newRank === 0) {
            setWarning("Nie masz uprawnień do nadania sobie rangi Administratora, cwaniaku.")
        } else if (!player.name || !player.profile) {
            setWarning("Żeby awansować z Przybysza niezbędne jest imię i profil.")
        } else {
            setRank(char);
            setWarning("");
        }

    }

    return (
        <form className="setRank" onSubmit={submitRankUpdate}>
            <label htmlFor="setRank" className="rankLabel">Ustaw swoją rangę:</label>
            <select className="rankSelect" id="setRank" value={rankValue} onChange={(e) => setRankValue(e.target.value)}>
                <option value="4">Przybysz</option>
                <option value="3">Mieszkaniec</option>
                <option value="2">Mistrz Gry</option>
                <option value="0">Administrator</option>
            </select>
            <input type="submit" className="rankSubmit" value="Potwierdź nadanie rangi" />
            {warning ? <p className="test">{warning}</p> : null}
        </form>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    msg: state.player.msg
})
const MapDispatchToProps = dispatch => ({
    setRank: (char) => dispatch(setRank(char)),
})

export default connect(MapStateToProps, MapDispatchToProps)(SetRankUtility);