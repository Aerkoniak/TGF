import React, {useState} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Navbar = ( { isLeftHanded } ) => {
    // zrób checkboxa w settings do zmiany ustawienia nawigacji mobile

    return (
        <>
            <nav className="mobile">
                {/* <button className="navburger"><i className="fas fa-bars"></i></button> */}
                <NavLink exact className={isLeftHanded ? "navMob left" : "navMob"} to="/">H</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/sessions">S</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/mails">P</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/tavern">K</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/charakter">KP</NavLink>
                <NavLink className={isLeftHanded ? "navMob left" : "navMob"} to="/settings">U</NavLink>
            </nav>
            <nav className="desktop">
                <NavLink to="/" exact className="navDesk">Herold</NavLink>
                <NavLink to="/sessions" className="navDesk">Sesje</NavLink>
                <NavLink to="/mails" className="navDesk">Poczta</NavLink>
                <NavLink to="/tavern" className="navDesk">Karczmy</NavLink>
                <NavLink to="/charakter" className="navDesk">Karta Postaci</NavLink>
                <NavLink to="/settings" className="navDesk">Ustawienia</NavLink>
            </nav>
        </>
    ); 
}

const mapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded
  })

export default connect(mapStateToProps)(Navbar);