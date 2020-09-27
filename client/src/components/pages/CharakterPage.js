import React from 'react';

import NameCreator from '../NameCreator/NameCreator';
import ProfileCreator from '../ProfileCreator/ProfileCreator';
import ProfileViewer from '../ProfileViewer/ProfileViewer';


const CharakterPage = () => {

    return (
        <section className="charakterPage mainPage">
            <h4 className="test">Karta Postaci</h4>
            <NameCreator />
            <ProfileCreator />
            
            <ProfileViewer />
        </section>
    );
}

// const MapStateToProps = (state) => ({
//     player: state.player.player
// })

export default CharakterPage;