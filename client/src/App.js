import React, { useEffect, useState } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/App.css';

import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { setRefreshToken } from './data/actions/generalActions'

import { auth } from './data/firebase/firebaseConfig'

import LoginPanel from './components/LogReg/LoginPanel';
import GamePanel from './components/GamePanel/GamePanel';
import LogOutPage from './components/pages/LogOutPage';




AOS.init({
  once: true
});

// auth.signOut()
function App({ isLogged, player, setRefreshToken }) {
  const [redirectToHerold, setHeroldRedirect] = useState(false)
  const [redirectToLogOut, setLogOutRedirect] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // setHeroldRedirect(!redirectToHerold)
      } else {
        setLogOutRedirect(!redirectToLogOut)
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <section className="App">

        <Switch>
          <Route exact path="/login" component={LoginPanel} />
          <Route path='/' component={GamePanel} />
        </Switch>

        {redirectToHerold ? <Redirect to="/" /> : null}
        {redirectToLogOut ? <Redirect to="/logout" /> : null}


      </section>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  isLogged: state.player.isLogged,
  player: state.player.player
})
const MapDispatchToProps = dispatch => ({
  setRefreshToken: token => dispatch(setRefreshToken(token))
})

export default connect(mapStateToProps, MapDispatchToProps)(App);
