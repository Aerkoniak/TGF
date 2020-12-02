import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch, Route } from 'react-router-dom';
import { Button } from 'react-bootstrap'

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
        <Route key={overlap.name} path={`/character/profile/${overlap.name}`} render={(routeProps) => (<ProfileOverlap {...routeProps} id={overlap.name} inCP profile={overlap} character={player} />)} />
    )))
    return (

        <div className="profile">
            <Button variant="outline-dark" className="addProfile" onClick={(e) => {
                e.preventDefault();
                setNewOverlap(!addNewOverlap)
            }}>Dodaj zakładkę do profilu</Button>

            {addNewOverlap ?
                <>
                    <div className="addOverlapWrap">
                        <input type="text" id="overlap" placeholder="Tytuł nowej zakładki" className="creatorInput" value={overlapTitle} onChange={e => setOverlapTitle(e.target.value)} />
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
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
})
const MapDispatchToProps = dispatch => ({
    addProfileOverlap: profile => dispatch(addProfileOverlap(profile)),
})

export default connect(MapStateToProps, MapDispatchToProps)(Profile);

