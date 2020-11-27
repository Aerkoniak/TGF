import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, Switch } from 'react-router-dom';
import { playersDB } from '../../data/firebase/firebaseConfig';

import Summary from '../CharacterPage/overlaps/Summary'
import Profile from '../CharacterPage/overlaps/Profile'
import Skills from '../CharacterPage/overlaps/Skills'
import Diary from '../CharacterPage/overlaps/Diary'

import ProfileViewer from '../ProfileViewer/ProfileViewer';


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
    useEffect(() => {
        const unsubscribe = playersDB.doc(`${player.accountDocRef}`)
            .onSnapshot(doc => {
                let data = doc.data();
                console.log("Zmiana w koncie")
                // fetchCharactersList();
            })
        return function cleanup() {
            unsubscribe()
        }
    }, [player])



    return (
        <section className="charakterPage mainPage">
            <ul className="navigationCP">
                <li><NavLink to="/character/summary" >Podsumowanie</NavLink></li>
                <li><NavLink to="/character/profile" >Profil</NavLink></li>
                <li><NavLink to="/character/skills" >Umiejętności i statystyki</NavLink></li>
                <li><NavLink to="/character/diary" >Dziennik</NavLink></li>
            </ul>
            <Switch>
                <Route path="/character/summary" component={Summary} />
                <Route path="/character/profile" component={Profile} />
                <Route path="/character/skills" component={Skills} />
                <Route path="/character/diary" component={Diary} />
            </Switch>



            <ProfileViewer />
        </section>
    );
}


const MapStateToProps = state => ({
    player: state.player.player,
})


export default connect(MapStateToProps)(CharakterPage);