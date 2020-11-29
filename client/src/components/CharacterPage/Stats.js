import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { updateStats, modifyStat, selectStats, updateStatistics, loadingSel } from '../../data/slices/CPSlice';
// import { updateStatistics } from '../../data/actions/creatorActions';
import { Button, Spinner } from 'react-bootstrap'


import { Card } from 'react-bootstrap'

const Stats = ({ player, races }) => {

    const dispatch = useDispatch();
    const statistcs = useSelector(selectStats)
    const loading = useSelector(loadingSel)

    const [stats, setStats] = useState([]);
    const [statsValue, setStatsValue] = useState({});
    const [freeStatPoints, setPoints] = useState(0);

    useEffect(() => {
        if (!player.stats) setPoints(10)
        else setPoints(-1)
    }, [player])

    useEffect(() => {
        if (!player.stats) {
            let statsList = [];
            races.forEach(race => {
                if (race.id === player.race) {
                    statsList = race.stats
                }
            })
            let stats = _.sortBy(statsList, ["name"])
            setStats(stats);
            dispatch(updateStats(stats));
        } else {
            let stats = _.sortBy(player.stats, ["name"])
            setStats(stats);
            dispatch(updateStats(stats));
        }

    }, [player])

    useEffect(() => {
        setStatsValue(statistcs)
    }, [statistcs])

    const modStats = (e) => {
        let name = e.target.id;
        let type = e.target.dataset.type;
        let mod = {
            type,
            name
        }
        let freePoints = freeStatPoints;

        if (type === "up" && freePoints > 0) setPoints(freeStatPoints - 1)
        else if (type === "down" && freePoints >= 0) setPoints(freeStatPoints + 1)
        if (freePoints === -1) return
        else if ((freePoints != 0) || (freePoints === 0 && type === "down")) dispatch(modifyStat(mod))
    }

    const confirmChanges = () => {
        let updStats = {};
        let newStats = [];
        stats.forEach(stat => {
            let name = stat.name;
            let val = statsValue[name];
            let newStat = {
                name,
                val
            }
            newStats.push(newStat);
        })
        updStats.stats = newStats;
        updStats.player = player;
        dispatch(updateStatistics(updStats))
    }



    const statsCards = stats.map((raceStat, index) => {
        return (
            <Card>
                <Card.Body className="statCard">
                    <Card.Title>{raceStat.name}</Card.Title>
                    <div className="singleStat">
                        <input type="number" disabled value={statsValue[raceStat.name]} />
                        <div className="arrows">
                            <i id={raceStat.name} data-type="up" onClick={(e) => modStats(e)} className="fas fa-caret-up"></i>
                            <i id={raceStat.name} data-type="down" type="decr" onClick={(e) => modStats(e)} className="fas fa-caret-down"></i>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )

    })

    return (
        <div className="stats">
            <h3 className="test">Dział statystyk:</h3>
            {!player.stats ? <h2 className="test">{`Masz ${freeStatPoints} punktów na edycję swoich startowych statystyk.`}</h2> : null}

            {freeStatPoints < 10 && freeStatPoints >= 0 ? <Button variant="outline-danger" block onClick={confirmChanges} >{loading === "loading" ? <Spinner animation="border" variant="dark" /> : `Zatwierdź zmiany`}</Button> : null}


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