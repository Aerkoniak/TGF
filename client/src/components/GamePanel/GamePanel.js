import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { setHandCoockie } from '../../data/actions/generalActions';
import { fetchStories } from '../../data/actions/storiesActions';
import { fetchMails } from '../../data/actions/mailsActions';
import { fetchTavernRooms } from '../../data/actions/tavernActions';

import { storiesDB } from '../../data/firebase/firebaseConfig'


import Navbar from '../Navbar/Navbar';
import HeroldPage from '../pages/HeroldPage';
import SessionPage from '../pages/SessionPage';
import MailPage from '../pages/MailPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';
import OneSession from '../pages/OneStory';
import OneMail from '../pages/OneMail';



const GamePanel = ({ player, stories, mails, downloadNeed, isLeftHanded, setHandCoockie, fetchStories, fetchMails, fetchTavernRooms }) => {

  

    useEffect(() => {
        fetchStories();
        setHandCoockie();
        fetchMails(player.id);
        fetchTavernRooms()
    }, []);

    useEffect(() => {
        if (downloadNeed) {
            fetchStories();
            fetchMails(player.id);
        }
    }, [downloadNeed])


    const storiesRoutes = stories.map(storyRoute => {
        return (
                <Route key={storyRoute.id} path={`/sessions/id${storyRoute.id}`} render={(routeProps) => (<OneSession {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
        )
    })


    const mailsRoutes = mails.map(mailRoute => ((
        <Route key={mailRoute.id} path={`/mails/id${mailRoute.id}`} render={(routeProps) => (<OneMail {...routeProps} id={mailRoute.id} mail={mailRoute} />)} />
    )))

    return (
        <section className={isLeftHanded ? "gamePanel left" : "gamePanel"}  >
            <Navbar />

            <Switch>
                <Route exact path='/' component={HeroldPage} />
                <Route exact path="/sessions" component={SessionPage} />
                <Route exact path="/mails" component={MailPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/charakter" component={CharakterPage} />
                <Route path="/settings" component={SettingsPage} />
                {storiesRoutes}
                {mailsRoutes}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>

        </section>
    );
}
const MapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded,
    stories: state.stories.stories,
    mails: state.mails.mails,
    downloadNeed: state.stories.downloadNeed,
    player: state.player.player,
})
const MapDispatchToProps = dispatch => {
    return {
        setHandCoockie: () => dispatch(setHandCoockie()),
        fetchStories: () => dispatch(fetchStories()),
        fetchMails: (id) => dispatch(fetchMails(id)),
        fetchTavernRooms: () => dispatch(fetchTavernRooms())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);