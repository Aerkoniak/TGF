import React, { Component } from 'react';
import './css/App.css';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import LoginPanel from './components/LogReg/LoginPanel';


function App({ isLogged }) {
  return (
    <BrowserRouter>
      <section className="App">
      <p className="loadPage">Oude Aard</p>
      <p className="loadPage">Tekstowa Gra Fabularna</p>
      <p className="loadPage"></p>

        {isLogged ? <p className="loadPage">Zalogowany</p> : <LoginPanel />}

      </section>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  isLogged: state.player.isLogged
})

export default connect(mapStateToProps)(App);
