import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HeroldPage from '../pages/HeroldPage';
import SessionPage from '../pages/SessionPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';



const GamePanel = () => {
    return ( 
        <section className="gamePanel" data-aos="fade-up" >
            <p>Nawigacja</p>
            <Switch>
                <Route exact path='/' component={HeroldPage} />
                <Route path="/sessions" component={SessionPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/charakter" component={CharakterPage} />
                <Route path="/settings" component={SettingsPage} />
                {/* {sessionsRoutes} */}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>

        </section>
     );
}
 
export default GamePanel;