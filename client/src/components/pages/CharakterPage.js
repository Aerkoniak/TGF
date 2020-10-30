import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import { resetCharacter } from '../../data/actions/creatorActions';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import CreatorKP from '../CharacterPage/CreatorKP';
import CharacterPreview from '../CharacterPage/CharacterPreview';


const CharakterPage = ({ player }) => {

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
        <section className="charakterPage mainPage">

            {isCreatorComplete ?
                <CharacterPreview />
                :
                <CreatorKP />
            }

            <ProfileViewer />
        </section>
    );
}


const MapStateToProps = state => ({
    player: state.player.player,
})

const MapDispatchToProps = dispatch => ({

})

export default connect(MapStateToProps, MapDispatchToProps)(CharakterPage);