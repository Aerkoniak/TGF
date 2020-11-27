import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

import CreatorKP from '../CreatorKP';
import CharacterPreview from '../CharacterPreview';

const Summary = ({ player }) => {

    const [isCreatorComplete, confirmCreator] = useState(false);
    useEffect(() => {
        if (!player.name || !player.race || !player.class || !player.age || !player.height || !player.posture || !player.hairColor || !player.eyeColor) {
            confirmCreator(false);
        }
        else {
            confirmCreator(true)
        }
    }, [player])

    return (
        <>
            {isCreatorComplete ?
                <CharacterPreview />
                :
                <CreatorKP />
            }
        </>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})

export default connect(MapStateToProps)(Summary);