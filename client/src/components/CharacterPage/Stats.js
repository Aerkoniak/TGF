import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import { updateStats } from '../../data/slices/CPSlice'


import { Card } from 'react-bootstrap'

const Stats = ({ player, races }) => {

    const dispatch = useDispatch();
    const [stats, setStats] = useState([]);

    useEffect(() => {
        let statsList = [];
        races.forEach(race => {
            if (race.id === player.race) {
                statsList = race.stats
            }
        })
        let stats = _.sortBy(statsList, ["name"])
        setStats(stats);
        console.log(stats);
        dispatch(updateStats(stats))
    }, [player])

    const modStats = (id) => {

    }



    const statsCards = stats.map((raceStat, index) => {
        return (
            <Card>
                <Card.Body className="statCard">
                    <Card.Title>{raceStat.name}</Card.Title>
                    <div className="singleStat">
                        <input type="number" disabled value={raceStat.value} />
                        <div className="arrows">
                            <i id={raceStat.name} name="coś" onClick={(e) => console.log(e.target.name)} className="fas fa-caret-up"></i>
                            <i id={raceStat.name} type="decr" onClick={(e) => console.log(e.target)} className="fas fa-caret-down"></i>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )

    })

    return (
        <div className="stats">
            <h3 className="test">Dział statystyk:</h3>
            <div className="statsWrap">
                {statsCards}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    races: state.creator.races
})

export default connect(MapStateToProps)(Stats);