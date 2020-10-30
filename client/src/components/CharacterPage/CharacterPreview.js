import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

const CharacterPreview = ({ player }) => {
    return (
        <section className="characterPreview">
            <Link className="previewLink" to={`/character/id${player.id}`}>kliknij tutaj by przejść do podglądu swojego konta</Link>
            <div className="stageTwo">
                <h2 className="test">Twoja postać:</h2>
                <p className="test">Imię: <span className="kp">{player.name}</span> </p>
                <p className="test">Rasa: <span className="kp">{player.race}</span> </p>
                <p className="test">Klasa: <span className="kp">{player.class}</span></p>

                <p className="test">Wiek: <span className="kp">{player.age}</span></p>
                <p className="test">Wzrost: <span className="kp">{player.height} centymetrów</span></p>
                <p className="test">Postura: <span className="kp">{player.posture}</span></p>
                <p className="test">Ma <span className="kp">{player.hairColor}</span> włosy</p>
                <p className="test">Ma <span className="kp">{player.eyeColor}</span> oczy</p>
            </div>
        </section>
    );
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(CharacterPreview);