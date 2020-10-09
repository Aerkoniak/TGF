import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import NameCreator from '../NameCreator/NameCreator';
import ProfileCreator from '../ProfileCreator/ProfileCreator';
import ProfileViewer from '../ProfileViewer/ProfileViewer';
import CharacterCreator from '../CharacterCreator/CharacterCreator';


const CharakterPage = ({ player }) => {

    const [isCharacterCreated, setCreation] = useState(false);

    useEffect(() => {
        if (player.race && player.name && player.age && player.class) setCreation(true);
        console.log("Kreator powinien się schować.")
    }, [player.name])

    const checkRang = (player) => {
        switch (player.rank) {
            case 0:
                return (
                    <p className="test">Administrator</p>
                )
                break;
            case 2:
                return (
                    <p className="test">Mistrz Gry</p>
                )
                break;
            case 3:
                return (
                    <p className="test">Mieszkaniec</p>
                )
                break;
            case 4:
                return (
                    <p className="test">Przybysz</p>
                )
                break;

            default:
                break;
        }
    }

    return (
        <section className="charakterPage mainPage">
            {isCharacterCreated ? <>
                <h2 className="test">Twoja Karta Postaci</h2>
                <p className="test">Ranga: <span className="kp">{checkRang(player)}</span> </p>
                <p className="test">Imię: <span className="kp">{player.name}</span> </p>
                <p className="test">Rasa: <span className="kp">{player.race}</span> </p>
                <p className="test">Wiek: <span className="kp">{player.age}</span> lat</p>
                <p className="test">Klasa: <span className="kp">{player.class}</span> </p>
            </> : <CharacterCreator />}




            {/* <ProfileCreator /> */}
            <ProfileViewer />
        </section>
    );
}


const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(CharakterPage);