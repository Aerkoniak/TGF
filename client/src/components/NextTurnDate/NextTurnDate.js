import React from 'react';
import { connect } from 'react-redux';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/pl'
import "react-datetime/css/react-datetime.css";


const NextTurnDate = () => {
    return (
        <div className="nextTurnWrap">
            <label htmlFor="nextTurn">Ustaw datę i godzinę dla następnego odpisu:</label>
            <Datetime id="nextTurn" locale="pl" />
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(NextTurnDate);