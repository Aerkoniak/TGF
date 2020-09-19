import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { setHandCoockie } from '../../data/actions/generalActions';
import { fetchStories } from '../../data/actions/storiesActions';

import Navbar from '../Navbar/Navbar';
import HeroldPage from '../pages/HeroldPage';
import SessionPage from '../pages/SessionPage';
import MailPage from '../pages/MailPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';
import OneSession from '../pages/OneStory';



const GamePanel = ({ stories, downloadNeed, isLeftHanded, setHandCoockie, fetchStories }) => {

    
    useEffect(() => {
        if (downloadNeed) {
            fetchStories();
        }
    }, [downloadNeed])

    const storiesRoutes = stories.map(storyRoute => ((
        <Route key={storyRoute.id} path={`/sessions/id${storyRoute.id}`} render={(routeProps) => (<OneSession {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
    )))

    return (
        <section className={isLeftHanded ? "gamePanel left" : "gamePanel"}  >
            <Navbar />
            <Switch>
                <Route exact path='/' component={HeroldPage} />
                <Route exact path="/sessions" component={SessionPage} />
                <Route path="/mails" component={MailPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/charakter" component={CharakterPage} />
                <Route path="/settings" component={SettingsPage} />
                {storiesRoutes}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>

        </section>
    );
}
const MapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded,
    stories: state.stories.stories,
    downloadNeed: state.stories.downloadNeed
})
const MapDispatchToProps = dispatch => {
    return {
        setHandCoockie: () => dispatch(setHandCoockie()),
        fetchStories: () => dispatch(fetchStories())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);