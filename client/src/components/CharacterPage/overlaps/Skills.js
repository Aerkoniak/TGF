import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash'
import { selectSkills, selectFabPoints, setSkills, fetchSkillsList, fetchPFAmount, updateSkills, increaseSkill } from '../../../data/slices/CPSlice';
import Stats from '../Stats';

import { Button } from 'react-bootstrap'

const Skills = ({ player, skills }) => {

    const dispatch = useDispatch();
    const ownSkills = useSelector(selectSkills);
    const PF = useSelector(selectFabPoints)

    const [warnings, setWarnings] = useState("")
    const [allSkillsArray, setAllSkillsArray] = useState([]);
    const [ownedSkillsArray, setOwnSkillsArray] = useState([])
    const [skillPrice, setSkillPrice] = useState(0);
    const [skillUpgPrice, setSkillUpgPrice] = useState(0);

    useEffect(() => {
        let skillsArray = player.skills;
        dispatch(fetchSkillsList(skillsArray));
        dispatch(fetchPFAmount(player.FabularPoints))
    }, [player])

    useEffect(() => {
        let price = (ownedSkillsArray.length - 2) * 1.25;
        if (ownedSkillsArray.length < 2) price = 0
        setSkillPrice(price);
        let counter = 0;
        ownedSkillsArray.forEach(skill => {
            if (skill.lvl > 2) counter = skill.lvl + counter;
        })
        price = counter + 5;
        setSkillUpgPrice(price)
    }, [ownedSkillsArray])

    useEffect(() => {
        let skillsList = skills;
        let newSkills = _.sortBy(skillsList, ["cat", "name"]);
        setAllSkillsArray(newSkills);
    }, [skills])

    useEffect(() => {
        let skillsList = ownSkills;
        let newSkills = _.orderBy(skillsList, ["lvl", "name"], ["desc", "asc"]);
        setOwnSkillsArray(newSkills)
    }, [ownSkills])

    const buySkill = (id, price) => {
        let takenSkill = id;
        let flag = true;
        ownedSkillsArray.forEach(skill => {
            if (skill.name === takenSkill) {
                flag = false
            }
        })
        if (skillPrice > PF) setWarnings("Nie masz dość PFów.");
        else if (flag) {
            allSkillsArray.forEach(skill => {
                if (skill.name === takenSkill) {
                    skill.lvl = 1;
                    let skills = {
                        price,
                        skill
                    }
                    dispatch(setSkills(skills))
                }
            })
        }
    }
    const upgradeSkill = (id, price) => {
        let takenSkill = id;
        let lvl = null
        ownedSkillsArray.map(skill => {
            if (skill.name === takenSkill) {
                lvl = skill.lvl
            }
        })
        if (skillUpgPrice > PF) setWarnings("Nie masz dość PFów.");
        else if (lvl == 5) setWarnings("Maksymalny poziom umiejętności to Piątka.");
        else {
            allSkillsArray.forEach(skill => {
                if (skill.name === takenSkill) {
                    let skills = {
                        price,
                        skill
                    }
                    dispatch(increaseSkill(skills))
                }
            })
        }
    }

    const confirmChanges = () => {
        let skills = {};
        skills.player = player;
        skills.skillsArray = ownSkills;
        skills.PF = PF;
        dispatch(updateSkills(skills))
    }

    const skillsList = allSkillsArray.map(skill => {
        let flag = true;
        ownedSkillsArray.forEach(owned => {
            if (owned.name === skill.name) {
                flag = false
            }
        })
        if (flag) {
            return (
                <li>
                    <div className="skills">
                        <p className="skillName">{skill.name}</p>
                        <p className="skillBase">{skill.base}</p>
                        <Button variant="outline-dark" id={skill.name} onClick={(e) => buySkill(e.target.id, skillPrice, e.target.data)} >{`Koszt kupna - ${skillPrice} PFów`}</Button>
                    </div>
                </li>)
        }

    })
    const ownedSkills = ownedSkillsArray.map(skill => {
        let price = (skill.lvl * 2.5) + (skillUpgPrice * 1.5);
        if (skill.lvl === 1) price = 2.5 * 2;
        return (
            <li>
                <div className="skills">
                    <p className="skillName">{skill.name}</p>
                    <p className="skillName">{skill.lvl}</p>
                    <p className="skillBase">{skill.base}</p>
                    <Button variant="outline-dark" id={skill.name} onClick={(e) => upgradeSkill(e.target.id, price)} > {`Koszt rozwinięcia - ${price}`}</Button>
                </div>
            </li>
        )
    })

    return (
        <>
            <Stats />
            <div className="ownSkills">
                <h3 className="test">Umiejętności:</h3>
                <p>{`Masz ${PF} wolnych Punktów Fabularnych`}<span className="fabPointSpan">{warnings ? warnings : null}</span> </p>
                {ownSkills > player.skills ? <Button variant="outline-dark" onClick={confirmChanges}>Zatwierdź zmiany</Button> : null}

                <p className="test">Posiadane umiejętności:</p>
                {ownSkills ?
                    <ul className="skillList">
                        {ownedSkills}
                    </ul>
                    : null}
            </div>
            <div className="allSkills">
                <p className="test">Wszystkie umiejętności:</p>
                <div className="skills">
                    <p className="skillName">Nazwa umiejętności</p>
                    <p className="skillBase">Statystyka bazowa</p>
                    <p className="test">Koszt rozwinięcia</p>
                </div>

                <ul className="skillList">
                    {skillsList}
                </ul>
            </div>

        </>
    );
}


const MapStateToProps = state => ({
    player: state.player.player,
    skills: state.creator.skills,
})

export default connect(MapStateToProps)(Skills);