import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';

import { addProfileOverlap } from '../../../data/actions/creatorActions';
import { playersDB } from '../../../data/firebase/firebaseConfig'


import ProfileOverlap from '../../ProfileOverlap/ProfileOverlap';
import TinyEditor from '../../RichEditor/TinyEditor';


const Profile = ({ player, addProfileOverlap }) => {


    const [overlapTitle, setOverlapTitle] = useState("")
    const [addNewOverlap, setNewOverlap] = useState(false);



    const profileOverlaps = player.profile.map(overlap => ((
        <NavLink key={overlap.name + player.id} to={`/character/profile/${overlap.name}`}>{overlap.name}</NavLink>
    )))
    const overlapsRoutes = player.profile.map(overlap => ((
        <Route key={overlap.name} path={`/character/profile/${overlap.name}`} render={(routeProps) => (<ProfileOverlap {...routeProps} id={overlap.name} profile={overlap} character={player} />)} />
    )))
    return (

        <>
            <button className="addProfile" onClick={(e) => {
                e.preventDefault();
                setNewOverlap(!addNewOverlap)
            }}>Dodaj zakładkę do profilu</button>

            {addNewOverlap ?
                <>
                    <div>
                        <label htmlFor="overlap" className="creatorLabel">Nazwij swoją nową zakładkę</label>
                        <input type="text" id="overlap" className="creatorInput" value={overlapTitle} onChange={e => setOverlapTitle(e.target.value)} />
                    </div>

                    <TinyEditor title={overlapTitle} addProfileOverlap={addProfileOverlap} />
                </>
                : null}

            <div className="overlapsLinks">
                {profileOverlaps}
            </div>
            <Switch>
                {overlapsRoutes}
            </Switch>
        </>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})
const MapDispatchToProps = dispatch => ({
    addProfileOverlap: profile => dispatch(addProfileOverlap(profile)),
})

export default connect(MapStateToProps, MapDispatchToProps)(Profile);

