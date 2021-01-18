import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash'
import { selectSkills, selectFabPoints, setSkills, fetchSkillsList, fetchPFAmount, updateSkills, increaseSkill, updateStatistics, loadingSel } from '../../../data/slices/CPSlice';
import { checkOrigins } from '../../../data/usefullFN'
import Stats from '../Stats';

import { Button, Spinner } from 'react-bootstrap'

const Skills = ({ player, skills, stats }) => {

    const dispatch = useDispatch();
    const ownSkills = useSelector(selectSkills);
    const PF = useSelector(selectFabPoints)
    const loading = useSelector(loadingSel)

    const [warnings, setWarnings] = useState("")
    const [buttonVisible, toggleConfirmButton] = useState(false)
    const [allSkillsArray, setAllSkillsArray] = useState([]);
    const [ownedSkillsArray, setOwnSkillsArray] = useState([]);
    const [bonusStatsArray, setStatsArray] = useState([])
    const [skillPrice, setSkillPrice] = useState(0);
    const [skillUpgPrice, setSkillUpgPrice] = useState(0);

    const [howManyBonusSkills, setAmount] = useState(0)
    const [whatCatBonusSkills, setBonusCat] = useState(0)

    useEffect(() => {
        dispatch(fetchPFAmount(player.FabularPoints))

        if (!player.skills || player.skills.length === 0) {
            let bonuses = checkOrigins(player);
            dispatch(fetchSkillsList(bonuses.skillsArray));
            setAmount(bonuses.howManyBonuses)
            setBonusCat(bonuses.whatCat)
        } else {
            let skillsArray = player.skills;
            dispatch(fetchSkillsList(skillsArray));
        }

    }, [player])

    useEffect(() => {

        if (howManyBonusSkills != 0 && whatCatBonusSkills != 0) {
            setSkillPrice(0);
        }

        let price = (ownedSkillsArray.length - 2) * 1.25;
        if (ownedSkillsArray.length < 6) price = 0
        setSkillPrice(price);

        // let counter = 0;
        // ownedSkillsArray.forEach(skill => {
        //     if (skill.lvl > 2) counter = skill.lvl + counter;
        // })
        // price = counter + 5;
        // setSkillUpgPrice(price)

    }, [ownedSkillsArray])

    useEffect(() => {

        if (loading === "loading") {
            if (!loading) toggleConfirmButton(false)
        } else { toggleConfirmButton(false) }

    }, [loading])

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
        console.log(howManyBonusSkills)
        console.log(whatCatBonusSkills)
        if (howManyBonusSkills != 0 && whatCatBonusSkills != 0) {
            console.log("Z bonusowych punktów.")
            allSkillsArray.forEach(skill => {
                if (skill.name === takenSkill && (skill.cat != whatCatBonusSkills && whatCatBonusSkills != 6)) {
                    setWarnings("Umiejętność nie pasuje do Kategorii");
                } else if (skill.name === takenSkill && (skill.cat === whatCatBonusSkills || whatCatBonusSkills === 6)) {
                    toggleConfirmButton(true);
                    setWarnings("");
                    skill.lvl = 2;
                    let skills = {
                        price: 0,
                        skill
                    }
                    dispatch(setSkills(skills))
                    setAmount(howManyBonusSkills - 1)
                    // setBonusCat(0)
                }
            })

        } else {
            toggleConfirmButton(true);
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

    }
    const upgradeSkill = (id, price) => {
        let bonusArray = bonusStatsArray;
        toggleConfirmButton(true);
        let takenSkill = id;
        let lvl = null;
        let base = "";
        ownedSkillsArray.map(skill => {
            if (skill.name === takenSkill) {
                lvl = skill.lvl;
                base = skill.base
            }
        })

        if (lvl == 2) bonusArray.push(base);
        if (lvl == 3) bonusArray.push(base);
        if (lvl == 4) bonusArray.push(base);

        if (skillUpgPrice > PF) setWarnings("Nie masz dość PFów.");
        else {
            allSkillsArray.forEach(skill => {
                if (skill.name === takenSkill) {
                    let skills = {
                        price,
                        skill
                    }
                    setStatsArray(bonusArray)
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

        let playersStats = [
            ...player.stats
        ]
        bonusStatsArray.forEach(stat => {
            playersStats.forEach(playerStat => {
                if (stat === playerStat.name) {
                    playerStat.val += 5
                }
            })
        })
        let stats = {
            stats: playersStats,
            player: player,
        }

        dispatch(updateSkills(skills))
        dispatch(updateStatistics(stats))
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
                <li className={`skillsEl a${skill.cat}`}>
                    <div className="skills">
                        <p className="skillName">{skill.name}</p>
                        <p className="skillBase">{skill.base}</p>
                        <Button variant="outline-dark" id={skill.name} onClick={(e) => buySkill(e.target.id, skillPrice, e.target.data)} >{`Koszt kupna - ${skillPrice} PFów`}</Button>
                    </div>
                </li>)
        }

    })
    const ownedSkills = ownedSkillsArray.map(skill => {
        let price = null;
        if (skill.lvl === 1) price = 2.5 * 2;
        else if (skill.lvl <= 3) price = (skill.lvl * 3) + ownedSkillsArray.length
        else price = (skill.lvl * 5) + ownedSkillsArray.length * skill.lvl
        let lvl = "";
        if (skill.lvl === 1) lvl = "Przeciętny"
        else if (skill.lvl === 2) lvl = "Ponadprzeciętny"
        else if (skill.lvl === 3) lvl = "Niezły"
        else if (skill.lvl === 4) lvl = "Świetny"
        else if (skill.lvl === 5) lvl = "Mistrzowski"
        return (
            <li className={`skillsEl a${skill.cat}`}>
                <div className="skills">
                    <p className="skillName">{skill.name}</p>
                    <p className="skillName">{lvl}</p>
                    <p className="skillBase">{skill.base}</p>
                    {skill.lvl === 5 ? <p className="skillName"></p> : <Button variant="outline-dark" id={skill.name} onClick={(e) => upgradeSkill(e.target.id, price)} > {`Koszt rozwinięcia - ${price}`}</Button>}
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

                <p className="test">Posiadane umiejętności:</p>

                {ownedSkillsArray
                    ?
                    <>
                        {whatCatBonusSkills != 0 || howManyBonusSkills != 0 ?
                            <p style={{ textAlign: "center" }}>Twoje pochodzenie daje Ci {howManyBonusSkills} umiejętność do wybrania za darmo. </p> : null}
                        <div className="skills">
                            <p className="skillName">Nazwa</p>
                            <p className="skillName">Poziom</p>
                            <p className="skillBase">Statystyka powiązana</p>
                            <p className="skillName"></p>
                        </div>
                        <ul className="skillList">
                            {ownedSkills}
                        </ul>
                    </>
                    : null}

            </div>
            { buttonVisible ? <Button variant="outline-danger" block onClick={confirmChanges}>{loading ? <Spinner animation="border" variant="dark" /> : `Zatwierdź zmiany`}</Button> : null}
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
    stats: state.player.player.stats
})

export default connect(MapStateToProps)(Skills);