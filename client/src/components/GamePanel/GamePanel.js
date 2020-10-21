import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth } from '../../data/firebase/firebaseConfig'


import { setHandCoockie, logInPlayer, fetchCharactersList, updateActive } from '../../data/actions/generalActions';
import { fetchStories } from '../../data/actions/storiesActions';
import { fetchPriveStories } from '../../data/actions/priveStoriesActions';
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
import PriveSessionsPage from '../pages/PriveSessionsPage';
import PriveStory from '../pages/PriveStory';



const GamePanel = ({ player, stories, mails, downloadNeed, isLeftHanded, setHandCoockie, fetchStories, fetchMails, fetchTavernRooms, logInPlayer, fetchPriveStories, priveStories, fetchCharactersList, setActive, updateActive, isLogged }) => {

    const [redirectToLogOut, setLogOutRedirect] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                let account = {}
                account.login = user.email;
                logInPlayer(account);
            } else {
                setLogOutRedirect(!redirectToLogOut)
            }
        })
    }, [])

    useEffect(() => {
        if (isLogged === "logged") {
            fetchStories();
            setHandCoockie();
            fetchTavernRooms();
            fetchMails(player.login);
            fetchPriveStories(player.login);
            fetchCharactersList();
        }
    }, [isLogged])

    useEffect(() => {
        if (downloadNeed) {
            fetchStories();
            fetchMails(player.login);
            fetchPriveStories(player.login);
        }
    }, [downloadNeed])






    const storiesRoutes = stories.map(storyRoute => {
        return (
            <Route key={storyRoute.id} path={`/sessions/id${storyRoute.id}`} render={(routeProps) => (<OneSession {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
        )
    })
    const priveStoriesRoutes = priveStories.map(storyRoute => {
        return (
            <Route key={storyRoute.id} path={`/sessions/prive/id${storyRoute.id}`} render={(routeProps) => (<PriveStory {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
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
                <Route exact path="/sessions/prive" component={PriveSessionsPage} />
                <Route exact path="/mails" component={MailPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/charakter" component={CharakterPage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path='/logout' component={LogOutPage} />

                {priveStoriesRoutes}
                {storiesRoutes}
                {mailsRoutes}
                {/* <Route path='/storyCreator' render={(routeProps) => (<StoryCreator {...routeProps} player={player}></StoryCreator>)} /> */}
            </Switch>
            {redirectToLogOut ? <Redirect to="/logout" /> : null}

        </section>
    );
}
const MapStateToProps = state => ({
    isLogged: state.player.isLogged,
    isLeftHanded: state.player.isLeftHanded,
    stories: state.stories.stories,
    priveStories: state.stories.priveStories,
    mails: state.mails.mails,
    downloadNeed: state.stories.downloadNeed,
    player: state.player.player,
    setActive: state.player.setActive,
})
const MapDispatchToProps = dispatch => {
    return {
        setHandCoockie: () => dispatch(setHandCoockie()),
        fetchStories: () => dispatch(fetchStories()),
        fetchMails: (id) => dispatch(fetchMails(id)),
        fetchTavernRooms: () => dispatch(fetchTavernRooms()),
        logInPlayer: (account) => dispatch(logInPlayer(account)),
        fetchPriveStories: mail => dispatch(fetchPriveStories(mail)),
        fetchCharactersList: () => dispatch(fetchCharactersList()),
        updateActive: player => dispatch(updateActive(player)),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);