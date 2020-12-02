import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const Overview = ({ player, character }) => {

    const [skillsArray, setSkillsArray] = useState([]);
    const [statsArray, setStatsArray] = useState([]);

    useEffect(() => {
        let skills = _.sortBy(character.skills, ["name"])
        setSkillsArray(skills)
        let stats = _.orderBy(character.stats, ["val"], ["desc"])
        setStatsArray(stats)
    }, [character])

    const hisSkills = skillsArray.map(skill => {
        return (
            <p className="test">{skill.name}</p>
        )
    })
    const hisStats = statsArray.map(stats => {
        return (
            <p className="test">{stats.name}</p>
        )
    })

    return (
        <div className="characterOverview">
            <p className="test">{`Chcesz dowiedzieć się czegoś o bohaterze ${character.name}? Dobrze więc, oto garść informacji. Bez szczegółów oczywiście, czego się spodziewałeś.`}</p>

            <div className="setWrap">
                <div className="skillSet">
                    <h5>Umiejętności</h5>
                    {skillsArray.length === 0 ? <p className="test">Gracz nie wypełnił jeszcze tej marginalnej statystyki.</p> : hisSkills}
                </div>
                <div className="statsSet">
                    <h5>Statystyki</h5>
                    {statsArray.length === 0 ? <p className="test">Gracz nie wypełnił jeszcze tej marginalnej statystyki.</p> : hisStats}
                </div>
            </div>

        </div>
    );
}
const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(Overview);