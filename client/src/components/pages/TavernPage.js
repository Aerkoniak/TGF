import React, { useEffect, useState } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchTavernRooms, addTavernRecord, checkTavernRecord } from '../../data/actions/tavernActions';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
import TavernRoom from '../pages/TavernRoom';



const TavernPage = ({ taverns, fetchTavernRooms }) => {

    const [isDescActive, setActiveDesc] = useState(false);

    useEffect(() => {
        fetchTavernRooms();
    }, [])

    const tavernRoom = taverns.map(room => ((
        <div className="tavernRoom" key={`${room.name}`} >
            <NavLink className="tavernName" to={`/tavern/${room.name}`}><p id={`${room.name}`} >{room.name}</p></NavLink>
            {isDescActive ? <p className="tavernDesc" id={`${room.name}`} >{room.desc}</p> : null}
        </div>
    )))

    const tavernRoutes = taverns.map(tavernRoute => ((
        <Route key={tavernRoute.id + tavernRoute.name} path={`/tavern/${tavernRoute.name}`} render={(routeProps) => (<TavernRoom {...routeProps} id={tavernRoute.id} room={tavernRoute} />)} />
    )))

    return (
        <section className="tavernPage mainPage">
            <div className="tavernsRooms">
            <span className="toggleActiveDesc" onClick={() => setActiveDesc(!isDescActive)}>Rozwiń opisy</span>
                {tavernRoom}
            </div>

            <Switch>
                {tavernRoutes}
            </Switch>

            <ProfileViewer />
        </section>
    );
}
const MapStateToProps = state => ({
    taverns: state.taverns.taverns,
})

const MapDispatchToProps = dispatch => {
    return {
        fetchTavernRooms: () => dispatch(fetchTavernRooms()),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(TavernPage);
