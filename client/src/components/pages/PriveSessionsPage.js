import React, { useState } from 'react';
import { connect } from 'react-redux'

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import PriveStoryCreator from '../PriveStoryCreator/PriveStoryCreator';

const PriveSessionsPage = ({ player }) => {

    const [priveCreatorActive, setPriveCreator] = useState(false)
    return (
        <section className="mainPage priveSessionPage">
            <button className="newStory creator" onClick={(e) => {
                e.preventDefault();
                setPriveCreator(!priveCreatorActive)
            }} >Stwórz nową sesję prywatną</button>
            {priveCreatorActive ? <PriveStoryCreator /> : null}


            <ProfileViewer />
        </section>
    );
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(PriveSessionsPage);