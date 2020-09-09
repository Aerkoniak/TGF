import React, { Component } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/App.css';

import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPanel from './components/LogReg/LoginPanel';
import GamePanel from './components/GamePanel/GamePanel';


AOS.init({
  once: true
});

function App({ isLogged }) {
  return (
    <BrowserRouter>
      <section className="App">

        {isLogged ? <GamePanel /> : <LoginPanel />}

      </section>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  isLogged: state.player.isLogged
})

export default connect(mapStateToProps)(App);
