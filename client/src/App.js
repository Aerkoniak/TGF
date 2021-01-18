import React, { useEffect, useState } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { setRefreshToken } from './data/actions/generalActions'

import { auth } from './data/firebase/firebaseConfig'

import LoginPanel from './components/LogReg/LoginPanel';
import GamePanel from './components/GamePanel/GamePanel';
import RemindPass from './components/pages/RemindPass';





AOS.init({
  once: true
});

// auth.signOut()
function App({ isLogged, player }) {

  const [redirectToHerold, setHeroldRedirect] = useState(false);
  const [redirectToLogOut, setLogOutRedirect] = useState(false);

  return (
    <BrowserRouter>
      <section className="App">

        <Switch>

          <Route exact path="/login" component={LoginPanel} />
          <Route path="/login/reminder" component={RemindPass} />
          <Route path='/' component={GamePanel} />

        </Switch>

        {redirectToHerold ? <Redirect to="/" /> : null}
        {redirectToLogOut ? <Redirect to="/login" /> : null}



      </section>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  isLogged: state.player.isLogged,
  player: state.player.player
})
// const MapDispatchToProps = dispatch => ({

// })

export default connect(mapStateToProps)(App);
