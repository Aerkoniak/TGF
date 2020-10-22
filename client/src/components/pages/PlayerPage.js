import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';

const PlayerPage = () => {
    return ( 
        <section className="mainPage playerPage">
            <div className="metrics">
                <div className="avatar">
                    tu będzie avatar
                </div>
                <div className="metricsData">
                    tu będzie metryka
                </div>
            </div>
            <div className="profile">
                tu będzie profil
            </div>
        </section>
     );
}
 
const MapStateToProps = state =>({
    player: state.player.player
})
export default connect(MapStateToProps)(PlayerPage);