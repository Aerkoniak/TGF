import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth } from '../../data/firebase/firebaseConfig'


import { setHandCoockie, logInPlayer } from '../../data/actions/generalActions';
import { fetchStories } from '../../data/actions/storiesActions';
import { fetchMails } from '../../data/actions/mailsActions';
import { fetchTavernRooms } from '../../data/actions/tavernActions';

// import { storiesDB } from '../../data/firebase/firebaseConfig'
// import { mailsDB } from '../../data/firebase/firebaseConfig'



import Navbar from '../Navbar/Navbar';
import HeroldPage from '../pages/HeroldPage';
import SessionPage from '../pages/SessionPage';
import MailPage from '../pages/MailPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';
import OneSession from '../pages/OneStory';
import OneMail from '../pages/OneMail';
import LogOutPage from '../pages/LogOutPage';



const GamePanel = ({ player, stories, mails, downloadNeed, isLeftHanded, setHandCoockie, fetchStories, fetchMails, fetchTavernRooms, logInPlayer }) => {

    const [redirectToLogOut, setLogOutRedirect] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                let account = {}
                account.login = user.email;
                logInPlayer(account);
                fetchStories();
                setHandCoockie();
                fetchTavernRooms();
                fetchMails(user.email);
            } else {
                setLogOutRedirect(!redirectToLogOut)
            }
        })
    }, [])

    useEffect(() => {
        if (downloadNeed) {
            fetchStories();
            fetchMails(player.login);
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
                <Route path='/logout' component={LogOutPage} />


                {storiesRoutes}
                {mailsRoutes}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>
            {redirectToLogOut ? <Redirect to="/logout" /> : null}

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
        fetchTavernRooms: () => dispatch(fetchTavernRooms()),
        logInPlayer: (account) => dispatch(logInPlayer(account))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);