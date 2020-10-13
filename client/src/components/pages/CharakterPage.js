import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { resetCharacter } from '../../data/actions/creatorActions';

// import NameCreator from '../NameCreator/NameCreator';
import ProfileCreator from '../ProfileCreator/ProfileCreator';
import ProfileViewer from '../ProfileViewer/ProfileViewer';
import CharacterCreator from '../CharacterCreator/CharacterCreator';


const CharakterPage = ({ player, done, resetCharacter }) => {

    const [isCharacterCreated, setCreation] = useState(false);

    useEffect(() => {
        if (player.race && player.name && player.age && player.class) setCreation(true);
        else if (!player.race && !player.name && !player.age && !player.class) setCreation(false);
    }, [done])

    const resetKP = () => {
        let char = player;
        char.name = "";
        char.age = null;
        char.race = "";
        char.class = "";
        resetCharacter(char)
    }

    return (
        <section className="charakterPage mainPage">
            {isCharacterCreated ? <>
                <h2 className="test">Twoja Karta Postaci</h2>
                <p className="test">Imię: <span className="kp">{player.name}</span> </p>
                <p className="test">Rasa: <span className="kp">{player.race}</span> </p>
                <p className="test">Wiek: <span className="kp">{player.age}</span> lat</p>
                <p className="test">Klasa: <span className="kp">{player.class}</span> </p>
                <button className="resetCharacter" onClick={resetKP}>Zresetuj swoją KP</button>
            </> : <CharacterCreator />}
            
            <ProfileCreator />
            <ProfileViewer />
        </section>
    );
}


const MapStateToProps = state => ({
    player: state.player.player,
    done: state.creator.done
})

const MapDispatchToProps = dispatch => ({
    resetCharacter: char => dispatch(resetCharacter(char))
})

export default connect(MapStateToProps, MapDispatchToProps)(CharakterPage);