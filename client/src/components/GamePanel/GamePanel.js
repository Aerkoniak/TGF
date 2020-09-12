import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { setHandCoockie } from '../../data/actions/generalActions';

import Navbar from '../Navbar/Navbar';
import HeroldPage from '../pages/HeroldPage';
import SessionPage from '../pages/SessionPage';
import MailPage from '../pages/MailPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';



const GamePanel = ({ isLeftHanded, setHandCoockie }) => {
    setHandCoockie();
    return ( 
        <section className={isLeftHanded ? "gamePanel left" : "gamePanel"}  >
            <Navbar />
            <Switch>
                <Route exact path='/' component={HeroldPage} />
                <Route path="/sessions" component={SessionPage} />
                <Route path="/mails" component={MailPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/charakter" component={CharakterPage} />
                <Route path="/settings" component={SettingsPage} />
                {/* {sessionsRoutes} */}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>

        </section>
     );
}
const MapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded
})
const MapDispatchToProps = dispatch => {
    return {
        setHandCoockie: () => dispatch(setHandCoockie())
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);