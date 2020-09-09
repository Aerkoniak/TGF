import React, {useState} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Navbar = ( { isLeftHanded } ) => {
    // zrób checkboxa w settings do zmiany ustawienia nawigacji mobile

    return (
        <>
            <nav className="mobile">
                <NavLink exact className={isLeftHanded ? "navMob left" : "navMob"} to="/">H</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/sessions">S</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/tavern">K</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/charakter">KP</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/settings">U</NavLink>
            </nav>
            <nav className="desktop">
                <p>Desktop</p>
            </nav>
        </>
    );
}

const mapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded
  })

export default connect(mapStateToProps)(Navbar);