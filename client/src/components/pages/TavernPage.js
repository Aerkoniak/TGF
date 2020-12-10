import React, { useEffect, useState } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import styles from '../../css/tavern.module.css'


import { fetchTavernRooms, addTavernRecord, checkTavernRecord } from '../../data/actions/tavernActions';

import ProfileViewer from '../ProfileViewer/ProfileViewer';
// import TavernRoom from '../pages/TavernRoom';
import Tavern from '../tavernsFeature/Tavern';
import { selectPlayersIn } from '../../data/slices/tavernSlice';



const TavernPage = ({ player, taverns, fetchTavernRooms }) => {

    const playersIn = useSelector(selectPlayersIn);

    const [isDescActive, setActiveDesc] = useState(false);
    const [tavernsArray, setTavernsArray] = useState([]);

    useEffect(() => {
        setTavernsArray(taverns)
    }, [taverns])

    const tavernRoom = tavernsArray.map(tavern => {
        let rooms = [];
        let guests = [];
        tavern.rooms.forEach(room => {
            rooms.push(room.name)
        });
        playersIn.forEach(guest => {
            if (tavern.name === guest.tavern) guests.push(guest.name)
        })
        return (
            <div className={styles.tavernRoom} key={`${tavern.name}`} >
                <NavLink className="tavernName" to={`/taverns/${tavern.name}`}>
                    <p>{`Karczma ${tavern.name}`}</p>
                </NavLink>
                <p>{tavern.desc}</p>
                <p>{`Dostępne pokoje: ${rooms} `}</p>
                {guests.length > 0 ? <p className="">{`W karczmie znajdują się: ${guests}`}</p> : <p className="">W karczmie aktualnie nikogo nie ma.</p>}
            </div>
        )
    }
    )


    return (
        <section className={styles.main}>
            <div className={styles.tavernsRooms}>
                {tavernRoom}
            </div>

            <ProfileViewer />
        </section>
    );
}
const MapStateToProps = state => ({
    taverns: state.t.taverns,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        fetchTavernRooms: () => dispatch(fetchTavernRooms()),
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(TavernPage);
