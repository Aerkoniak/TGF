import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { fetchStories } from '../../data/actions/storiesActions';

const Navbar = ({ stories, isLeftHanded, fetchStories, player }) => {

    // każdy z link wymaga osobnej zmiennej wskazującej, ze doszła jakas nowa wiadomość lub sesja. 

    const [newMessage, changeMessageState] = useState(false);

    useEffect(() => {
        stories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id) {
                    if (!spectator.seen) {
                        changeMessageState(true)
                    } else {
                        changeMessageState(false)
                    }
                }
            })
        })
    }, [stories])


    return (
        <>
            <nav className={isLeftHanded ? "mobile left" : "mobile"} onClick={fetchStories} >
                {/* <button className="navburger"><i className="fas fa-bars"></i></button> */}
                <NavLink exact className="navMob" to="/">H</NavLink>
                <NavLink className={newMessage ? "navMob newMessage" : "navMob"} to="/sessions">S</NavLink>
                <NavLink className="navMob" to="/mails">P</NavLink>
                <NavLink className="navMob" to="/tavern">K</NavLink>
                <NavLink className="navMob" to="/charakter">KP</NavLink>
                <NavLink className="navMob" to="/settings">U</NavLink>
            </nav>
            <nav className="desktop" onClick={fetchStories}>
                <NavLink to="/" exact className="navDesk">Herold</NavLink>
                <NavLink to="/sessions" className={newMessage ? "navDesk newMessage" : "navDesk"}>Sesje</NavLink>
                <NavLink to="/mails" className="navDesk">Poczta</NavLink>
                <NavLink to="/tavern" className="navDesk">Karczmy</NavLink>
                <NavLink to="/charakter" className="navDesk">Karta Postaci</NavLink>
                <NavLink to="/settings" className="navDesk">Ustawienia</NavLink>
            </nav>
        </>
    );
}

const mapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded,
    stories: state.stories.stories,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        fetchStories: () => dispatch(fetchStories())
    }
}

export default connect(mapStateToProps, MapDispatchToProps)(Navbar);