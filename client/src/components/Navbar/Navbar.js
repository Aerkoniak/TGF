import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { fetchMails } from '../../data/actions/mailsActions';

import { fetchStories } from '../../data/actions/storiesActions';

const Navbar = ({ stories, isLeftHanded, fetchStories, player, mails, taverns }) => {

    // każdy z link wymaga osobnej zmiennej wskazującej, ze doszła jakas nowa wiadomość lub sesja. 

    const [newSessionChapter, changeSessionChapterStatus] = useState(false);
    const [newMailRecord, changeMailRecordStatus] = useState(false);

    useEffect(() => {
        stories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id) {
                    if (!spectator.seen) {
                        changeSessionChapterStatus(true)
                    } else {
                        changeSessionChapterStatus(false)
                    }
                }
            })
        })
    }, [stories]);

    useEffect(() => {
        mails.map(mail => {
            if (player.id === mail.addreesse.id && !mail.addreesse.read) changeMailRecordStatus(true)
            else if (player.id === mail.sender.id && !mail.sender.read) changeMailRecordStatus(true)
            else changeMailRecordStatus(false)
        })
    }, [mails])

    const tavernSubLinks = taverns.map((tavern, index) => ((
        <p key={tavern + index} className="subLink"><Link to={`/tavern/${tavern.name}`}>{tavern.name}</Link></p>
    )))

    return (
        <>
            <nav className={isLeftHanded ? "mobile left" : "mobile"} onClick={fetchStories} >
                <NavLink exact className="navMob" to="/">H</NavLink>
                <NavLink className={newSessionChapter ? "navMob newMessage" : "navMob"} to="/sessions">S</NavLink>
                <NavLink className={newMailRecord ? "navMob newMessage" : "navMob"} to="/mails">P</NavLink>
                <NavLink className="navMob" to="/tavern">K</NavLink>
                <NavLink className="navMob" to="/charakter">KP</NavLink>
                <NavLink className="navMob" to="/settings">U</NavLink>
            </nav>
            <nav className="desktop" onClick={fetchStories}>
                <NavLink to="/" exact className="navDesk">Herold</NavLink>
                <NavLink to="/sessions" className={newSessionChapter ? "navDesk sessions newMessage" : "navDesk sessions"}>Sesje
                <p className="subLink"><Link to="/sessions/prive" >Sesje prywatne</Link></p>
                </NavLink>
                <NavLink to="/mails" className={newMailRecord ? "navDesk newMessage" : "navDesk"}>Poczta</NavLink>
                <NavLink to="/tavern" className="navDesk tavern">Karczmy
                    {tavernSubLinks}
                </NavLink>
                <NavLink to="/charakter" className="navDesk">Karta Postaci</NavLink>
                <NavLink to="/settings" className="navDesk">Ustawienia</NavLink>
            </nav>
        </>
    );
}

const mapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded,
    stories: state.stories.stories,
    player: state.player.player,
    mails: state.mails.mails,
    taverns: state.taverns.taverns,
})

const MapDispatchToProps = dispatch => {
    return {
        fetchStories: () => dispatch(fetchStories())
    }
}

export default connect(mapStateToProps, MapDispatchToProps)(Navbar);