import React, { useState, useEffect } from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileViewer from '../ProfileViewer/ProfileViewer';
import ProfileOverlap from '../ProfileOverlap/ProfileOverlap';
import TinyEditor from '../RichEditor/TinyEditor';



import { playersDB } from '../../data/firebase/firebaseConfig';
import { addProfileOverlap } from '../../data/actions/creatorActions';
import { fetchCharactersList } from '../../data/actions/generalActions';
import { updateActive } from '../../data/actions/generalActions';



const PlayerPage = ({ character, player, addProfileOverlap, fetchCharactersList }) => {

    const checkRang = (player) => {
        switch (player.rank) {
            case 0:
                return (
                    <h2 className="metrics">Administrator</h2>
                )
                break;
            case 2:
                return (
                    <h2 className="metrics">Mistrz Gry</h2>
                )
                break;
            case 3:
                return (
                    <h2 className="metrics">Mieszkaniec</h2>
                )
                break;
            case 4:
                return (
                    <h2 className="metrics">Przybysz</h2>
                )
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (character.id === player.id) {
            const unsubscribe = playersDB.doc(`${player.accountDocRef}`)
                .onSnapshot(doc => {
                    let data = doc.data();
                    if (data.profile.length > character.profile.length) {
                        setNewOverlap(false);
                        fetchCharactersList();
                    }

                })
            updateActive(player)
            const myInterval = setInterval(updateActive(player), 300000);
            setTimeout(() => {
                clearInterval(myInterval);
            }, 900000)
            return function cleanup() {
                unsubscribe()
                clearInterval(myInterval);
            }
        }
    }, [character])

    const [isPlayer, confirmPlayer] = useState(false);
    const [addNewOverlap, setNewOverlap] = useState(false);
    const [overlapTitle, setOverlapTitle] = useState("")
    const [image, setImage] = useState(null)

    useEffect(() => {
        let avatar = character.avatar64;
        let source = 'data:image/jpeg;base64,' + avatar;
        setImage(source)
    }, [character])

    useEffect(() => {
        if (character.id === player.id) confirmPlayer(true);
        else confirmPlayer(false);
    }, [character])

    const profileOverlaps = character.profile.map(overlap => ((
        <NavLink key={overlap.name + character.id} to={`/characters/id${character.id}/${overlap.name}`}>{overlap.name}</NavLink>
    )))
    const overlapsRoutes = character.profile.map(overlap => ((
        <Route key={overlap.name} path={`/characters/id${character.id}/${overlap.name}`} render={(routeProps) => (<ProfileOverlap {...routeProps} id={overlap.name} profile={overlap} character={character} />)} />
    )))


    return (
        <section className="mainPage playerPage">
            {isPlayer ? <h2 className="test">Oto Twoje konto:</h2> : <p className="test">Oglądasz konto gracza:</p>}
            <div className="metricsWrap">
                <div className="avatar" id="avatar">
                    <img className="avatarFile" src={image} alt="avatar" />
                </div>
                <div className="metricsData">
                    {checkRang(character)}
                    <h2 className="metrics">{character.name}</h2>
                    <p className="metrics">Rasa: {character.race}</p>
                    <p className="metrics">Z zamiłowania: {character.class}</p>
                    <p className="metrics">Wiek: {character.age} lat</p>
                    {character.height ? <p className="metrics">Wzrost: {character.height} centymetrów</p> : null}
                    {character.posture ? <p className="metrics">{character.posture} postura.</p> : null}
                    {character.hairColor ? <p className="metrics">{`Ma ${character.hairColor} włosy i ${character.eyeColor} oczy.`}</p> : null}
                </div>
            </div>



            {character.profile.length > 0 ?
                <>
                    <div className="profile">
                        <h2 className="metrics">Profil</h2>
                        <div className="overlapsLinks">
                            {profileOverlaps}
                        </div>

                        <Switch>
                            {overlapsRoutes}
                        </Switch>
                    </div> </>
                : <p className="test">Gracz nie ma żadnego profilu.</p>}

            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    addProfileOverlap: profile => dispatch(addProfileOverlap(profile)),
    fetchCharactersList: () => dispatch(fetchCharactersList())
})
export default connect(MapStateToProps, MapDispatchToProps)(PlayerPage);