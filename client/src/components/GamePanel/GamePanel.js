import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { auth, playersDB } from '../../data/firebase/firebaseConfig'

import { fetchGlobalStories } from '../../data/slices/globalStoriesSlice';
import { fetchPriveStories } from '../../data/slices/priveStoriesSlice';
import { fetchMails } from '../../data/slices/mailsSlice';
import { fetchTaverns } from '../../data/slices/tavernSlice';


import { setHandCoockie, logInPlayer, fetchCharactersList, updateActive } from '../../data/actions/generalActions';
// import { fetchStories } from '../../data/actions/storiesActions';
// import { fetchPriveStories } from '../../data/actions/priveStoriesActions';
// import { fetchMails } from '../../data/actions/mailsActions';
import { fetchTavernRooms } from '../../data/actions/tavernActions';

// import { storiesDB } from '../../data/firebase/firebaseConfig'
// import { mailsDB } from '../../data/firebase/firebaseConfig'



import Navbar from '../Navbar/Navbar';
import HeroldPage from '../pages/HeroldPage';
import MailPage from '../pages/MailPage';
import TavernPage from '../pages/TavernPage';
import CharakterPage from '../pages/CharakterPage';
import SettingsPage from '../pages/SettingsPage';
import LogOutPage from '../pages/LogOutPage';
import PriveSessionsPage from '../pages/PriveSessionsPage';
import VerifyPage from '../pages/VerifyPage';
import PlayerPage from '../pages/PlayerPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

import GlobalStories from '../pages/GlobalStories';
import SingleStory from '../globalStories/SingleStory';
import SingleMail from '../MailFeature/SingleMail';
import Tavern from '../tavernsFeature/Tavern';
import Atelier from '../pages/Atelier';
import Panel from '../PanelFeature/Panel';
import EmailUnVerified from '../pages/EmailUnVerified';
import SinglePrive from '../priveStories/SinglePrive';



const GamePanel = ({ player, globalStories, mails, characters, downloadNeed, isLeftHanded, setHandCoockie, fetchGlobalStories, fetchMails, fetchTaverns, logInPlayer, fetchPriveStories, priveStories, fetchCharactersList, isLogged, taverns }) => {

    const [redirectToLogOut, setLogOutRedirect] = useState(false)
    const [redirectToVerify, setVerifyRedirect] = useState(false)
    const [charactersArray, setCharactersArray] = useState([])
    const [userVerified, verifyUser] = useState(false)

    useEffect(() => {
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        const mode = getParameterByName('mode');
        if (mode === "resetPassword") {
        } else {
            auth.onAuthStateChanged(function (user) {
                console.log("GamePanel - useEffect - getParameterbyName - onAuthStateChanged")
                if (user) {
                    console.log(user);
                    if (!user.emailVerified) {
                        console.log("Niezweryfikowany")
                        setVerifyRedirect(true)
                    } else {
                        verifyUser(true)
                        let account = {}
                        account.login = user.email;
                        logInPlayer(account);
                        console.log("GamePanel - useEffect - getParameterbyName - onAuthStateChanged - user zweryfikowany")
                    }

                } else {
                    setLogOutRedirect(!redirectToLogOut)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (isLogged === "logged") {
            console.log("GamePanel - useEffect - isLogged - logged")
            fetchGlobalStories();
            setHandCoockie();
            fetchTaverns();
            fetchMails(player.login);
            fetchPriveStories(player.id);
            fetchCharactersList();
        }
    }, [isLogged])

    useEffect(() => {
        if (downloadNeed) {
            console.log("GamePanel - useEffect - downloadNeed - downloadNeed fetches")
            fetchPriveStories(player.login);
            fetchGlobalStories()
            fetchMails(player.login);
        }
    }, [downloadNeed])

    useEffect(() => {
        setCharactersArray(characters)
    }, [characters])


    useEffect(() => {
        if (isLogged === "logged") {
            const unsubscribe = playersDB.doc(`${player.accountDocRef}`)
                .onSnapshot((doc) => {
                    console.log("GamePanel - useEffect - onSnapshot - res")
                    let snapshotPlayer = doc.data()
                    if (player.mailsField < snapshotPlayer.mailsField) {
                        fetchMails(player.login);
                    } else if (player.storyField < snapshotPlayer.storyField) {
                        fetchGlobalStories();
                    } else if (player.priveField < snapshotPlayer.priveField) {
                        fetchPriveStories(player.id);
                    }
                });
            return function cleanup() {
                unsubscribe()
            }
        }
    }, [isLogged])



    const storiesRoutes = globalStories.map(storyRoute => {
        return (
            <Route key={storyRoute.id} path={`/story/id${storyRoute.id}`} render={(routeProps) => (<SingleStory {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
        )
    })
    const priveStoriesRoutes = priveStories.map(storyRoute => {
        return (
            <Route key={storyRoute.id} path={`/sessions/prive/id${storyRoute.id}`} render={(routeProps) => (<SinglePrive {...routeProps} id={storyRoute.id} story={storyRoute} />)} />
        )
    })
    const mailsRoutes = mails.map(mailRoute => ((
        <Route key={mailRoute.id} path={`/mail/id${mailRoute.id}`} render={(routeProps) => (<SingleMail {...routeProps} id={mailRoute.id} mail={mailRoute} />)} />
    )))
    const playerRoutes = charactersArray.map(character => {
        return (<Route key={character.accountDocRef} path={`/characters/id${character.id}`} render={(routeProps) => (<PlayerPage {...routeProps} id={character.id} character={character} />)} />)
    })

    const tavernRoutes = taverns.map((tavernRoute, index) => ((
        <Route key={tavernRoute.id + tavernRoute.name} path={`/taverns/${tavernRoute.name}`} render={(routeProps) => (<Tavern {...routeProps} tavern={tavernRoute} index={index} />)} />
    )))

    return (

        <section className={isLeftHanded ? "gamePanel left" : "gamePanel"}  >
            {isLogged === "logged" && userVerified ? <Navbar /> : null}
            {/* {!player.name || !player.race || !player.age ?
                <p style={{ display: "block", paddingTop: "110px", textAlign: "center" }}>Ups, wygląda na to, że nie dokończyłeś tworzyć swojej postaci. Przejdź <Link to='/character/summary'>tutaj</Link> by ukończyć Kreator.</p> :
                null} */}

            <Switch>
                {isLogged === "logged" && userVerified ? <Route exact path='/' component={HeroldPage} /> : null}

                {/* <Route exact path='/' component={HeroldPage} /> */}
                <Route path="/stories" component={GlobalStories} />
                <Route exact path="/sessions/prive" component={PriveSessionsPage} />
                <Route path="/mails" component={MailPage} />
                <Route path="/tavern" component={TavernPage} />
                <Route path="/character" component={CharakterPage} />
                <Route path="/atelier" component={Atelier} />

                <Route path="/settings" component={SettingsPage} />
                <Route path="/panel" component={Panel} />
                <Route exact path='/logout' component={LogOutPage} />
                <Route exact path="/email" component={VerifyPage} />
                <Route exact path="/emailUnVerified" component={EmailUnVerified} />

                <Route path="/logout/password" component={ResetPasswordPage} />

                {priveStoriesRoutes}
                {storiesRoutes}
                {mailsRoutes}
                {tavernRoutes}
                {playerRoutes}

            </Switch>
            {redirectToLogOut ? <Redirect to="/logout" /> : null}
            {redirectToVerify ? <Redirect to="/emailUnVerified" /> : null}
        </section>

    );
}
const MapStateToProps = state => ({
    isLogged: state.player.isLogged,
    isLeftHanded: state.player.isLeftHanded,
    // priveStories: state.stories.priveStories,
    downloadNeed: state.stories.downloadNeed,
    player: state.player.player,
    setActive: state.player.setActive,
    characters: state.characters.characters,
    // nowy state
    globalStories: state.globalStories.stories,
    priveStories: state.priveStories.stories,
    mails: state.m.otMails,
    taverns: state.t.taverns

})
const MapDispatchToProps = dispatch => {
    return {
        setHandCoockie: () => dispatch(setHandCoockie()),
        // fetchStories: () => dispatch(fetchStories()),
        // fetchMails: (id) => dispatch(fetchMails(id)),
        // fetchTavernRooms: () => dispatch(fetchTavernRooms()),
        logInPlayer: (account) => dispatch(logInPlayer(account)),
        fetchPriveStories: id => dispatch(fetchPriveStories(id)),
        fetchCharactersList: () => dispatch(fetchCharactersList()),
        updateActive: player => dispatch(updateActive(player)),
        // nowy format state'u
        fetchGlobalStories: () => dispatch(fetchGlobalStories()),
        fetchMails: (id) => dispatch(fetchMails(id)),
        fetchTaverns: () => dispatch(fetchTaverns())

    }
}

export default connect(MapStateToProps, MapDispatchToProps)(GamePanel);