import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import styles from '../../css/atelier.module.css';



import Workshop from '../AtelierFeature/Workshop';
import ProfileViewer from '../ProfileViewer/ProfileViewer';

const Atelier = ({ player }) => {

    return (
        <section className={styles.main}>

            {player.class === "Rzemieślnik" ? <Workshop /> : null}
            {player.class === "Mag" ? <p>Pracownia Magiczna</p> : null}
            {player.class === "Wojownik" ? <p>Sala treningowa</p> : null}
            {player.class === "Łotrzyk" ? <p>Skromna melina</p> : null}

            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})

export default connect(MapStateToProps)(Atelier);