import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { fetchMails } from '../../data/actions/mailsActions';

// import { fetchStories } from '../../data/actions/storiesActions';
import { fetchGlobalStories } from '../../data/slices/globalStoriesSlice';
import { selectPlayersIn } from '../../data/slices/tavernSlice';
import TavernListener from '../tavernsFeature/TavernListener';


const Navbar = ({ globalStories, priveStories, isLeftHanded, fetchGlobalStories, player, mails, taverns }) => {

    // każdy z link wymaga osobnej zmiennej wskazującej, ze doszła jakas nowa wiadomość lub sesja. 

    const playersIn = useSelector(selectPlayersIn);
    const [playersArray, setArray] = useState([])

    const [newSessionChapter, changeSessionChapterStatus] = useState(false);
    const [newChapterInPrive, changePriveChapterStatus] = useState(false);
    const [newMailRecord, changeMailRecordStatus] = useState(false);

    useEffect(() => {
        let counter = 0;
        globalStories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id && !spectator.seen) {
                    counter++
                }
            })
        });
        if (counter > 0) changeSessionChapterStatus(true)
        else changeSessionChapterStatus(false)

    }, [globalStories]);

    useEffect(() => {
        let counter = 0;
        priveStories.map(story => {
            story.spectators.map(spectator => {
                if (spectator.id === player.id && !spectator.seen) {
                    counter++
                }
            })
        });
        if (counter > 0) changePriveChapterStatus(true)
        else changePriveChapterStatus(false)
    }, [priveStories])

    useEffect(() => {
        let counter = 0;
        mails.map(mail => {
            if (player.id === mail.addreesse.id && !mail.addreesse.read) counter++
            else if (player.id === mail.sender.id && !mail.sender.read) counter++
            mail.viewers.map(viewer => {
                if (player.id === viewer.id && !viewer.read) counter++
            })
        })
        if (counter > 0) changeMailRecordStatus(true);
        else changeMailRecordStatus(false);
    }, [mails])

    useEffect(() => {
        setArray(playersIn)
    }, [playersIn])

    return (
        <>
            <TavernListener />
            <nav className={isLeftHanded ? "mobile left" : "mobile"} >
                <NavLink exact className="navMob" to="/">H</NavLink>
                <NavLink className={newSessionChapter || newChapterInPrive ? "navMob newMessage" : "navMob"} to="/stories">S</NavLink>
                <NavLink className={newMailRecord ? "navMob newMessage" : "navMob"} to="/mails">P</NavLink>
                <NavLink className="navMob" to="/tavern">K</NavLink>
                <NavLink className="navMob" to="/character">KP</NavLink>
                <NavLink className="navMob" to="/settings">U</NavLink>
            </nav>
            <nav className="desktop">
                <NavLink to="/" exact className="navDesk">Herold</NavLink>
                <NavLink to="/stories" className={newSessionChapter || newChapterInPrive ? "navDesk sessions newMessage" : "navDesk sessions"}>Sesje
                <p className={newChapterInPrive ? "subLink prive new" : "subLink"}><Link to="/sessions/prive" >Sesje prywatne</Link></p>
                </NavLink>
                <NavLink to="/mails" className={newMailRecord ? "navDesk newMessage" : "navDesk"}>Poczta</NavLink>
                <NavLink to="/tavern" className="navDesk tavern">{`Karczmy ${playersArray ? `[${playersArray.length}]` : "[0]"}`}</NavLink>
                <NavLink to="/character" className="navDesk">Karta Postaci</NavLink>
                <NavLink to="/settings" className="navDesk">Ustawienia</NavLink>
            </nav>
        </>
    );
}

const mapStateToProps = state => ({
    isLeftHanded: state.player.isLeftHanded,
    priveStories: state.stories.priveStories,
    player: state.player.player,
    // nowy state
    globalStories: state.globalStories.stories,
    mails: state.m.otMails,
    taverns: state.t.taverns,

})

const MapDispatchToProps = dispatch => {
    return {
        fetchGlobalStories: () => dispatch(fetchGlobalStories())
    }
}

export default connect(mapStateToProps, MapDispatchToProps)(Navbar);