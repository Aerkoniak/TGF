import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { resetCharacter } from '../../data/actions/creatorActions';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import CreatorKP from '../CharacterCreator/CreatorKP';


const CharakterPage = ({ player, done, resetCharacter }) => {


    const resetKP = () => {
        let char = player;
        resetCharacter(char)
    }

    return (
        <section className="charakterPage mainPage">
           
            <CreatorKP />

            <button className="resetCharacter" onClick={resetKP}>Zresetuj swoją KP</button>
          
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