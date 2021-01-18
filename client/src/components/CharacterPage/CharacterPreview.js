import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import styles from '../../css/cp.module.css'

const CharacterPreview = ({ player }) => {
    return (
        <section className="characterPreview">
            <Link className="previewLink" to={`/characters/id${player.id}`}>kliknij tutaj by przejść do podglądu swojego konta</Link>
            <div className="stageTwo">
                <h2 className={styles.labelInfo}>Twoja postać:</h2>
                <p className={styles.labelInfo}>Imię: <span className={styles.labelValue}>{player.name}</span> </p>
                <p className={styles.labelInfo}>Rasa: <span className={styles.labelValue}>{player.race}</span> </p>
                <p className={styles.labelInfo}>Klasa: <span className={styles.labelValue}>{player.class}</span></p>

                <p className={styles.labelInfo}>Wiek: <span className={styles.labelValue}>{player.age}</span></p>
                <p className={styles.labelInfo}>Wzrost: <span className={styles.labelValue}>{player.height} centymetrów</span></p>
                <p className={styles.labelInfo}>Postura: <span className={styles.labelValue}>{player.posture}</span></p>
                {player.hairColor === "łysy" ?
                    <p className={styles.labelInfo}>Jest <span className={styles.labelValue}>{`łysą`}</span> istotą.</p>
                    :
                    <p className={styles.labelInfo}>Ma <span className={styles.labelValue}>{player.hairColor}</span> włosy</p>}

                <p className={styles.labelInfo}>Ma <span className={styles.labelValue}>{player.eyeColor}</span> oczy</p>
            </div>
        </section>
    );
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(CharacterPreview);