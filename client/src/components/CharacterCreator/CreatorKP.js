import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { playersDB } from '../../data/firebase/firebaseConfig';

const CreatorKP = ({ player }) => {

    useEffect(() => {
        const unsubscribe = playersDB.doc(`${player.accountDocRef}`)
            .onSnapshot(doc => {
                let data = doc.data();
                // akcja fetchująca dane pojedynczego gracza
            })
        return function cleanup() {
            unsubscribe()
        }
    }, [])

    const [stageOne, confirmStageOne] = useState(false);
    const [stageTwo, confirmStageTwo] = useState(false);
    useEffect(() => {

    }, [player])

    return (
        <section className="creatorKP mainPage">
            {stageOne ? <h2 className="test">Etap I: ukończony</h2> : <div className="stageOne">Etap I</div>}
            {stageTwo ? <h2 className="test">Etap II: ukończony</h2> : <div className="stageTwo">Etap II</div>}
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})

export default connect(MapStateToProps)(CreatorKP);