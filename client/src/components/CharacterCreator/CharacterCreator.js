import React, { useState } from 'react';
import { connect } from 'react-redux'

import NameCreator from '../NameCreator/NameCreator';
import ProfileCreator from '../ProfileCreator/ProfileCreator';

import { setCharacter } from '../../data/actions/creatorActions';

const CharacterCreator = ({ creator, player, setCharacter }) => {

    const [nameValue, setNameValue] = useState("")
    const [raceValue, setRaceValue] = useState("");
    const [ageValue, setAgeValue] = useState(null);
    const [classValue, setClassValue] = useState("");
    const [raceObject, setRaceObject] = useState("");
    const [classObject, setClassObject] = useState("");
    const [baseRaseStats, setRaceStats] = useState([]);
    const [baseAbilitiesArray, setAbilities] = useState([]);
    const [warnings, setWarnings] = useState("");

    const [isNameOk, setNameOk] = useState(false)
    const [isRaceOk, setRaceOk] = useState(false)
    const [isAgeOk, setAgeOk] = useState(false)
    const [isClassOk, setClassOk] = useState(false)


    const setRace = e => {
        setRaceOk(false)
        setRaceValue(e.target.value)
        creator.races.map(race => {
            if (race.id === e.target.value) {
                setRaceObject(race);
                setRaceStats(race.stats);
            }
        })
    }
    const setClass = e => {
        setClassOk(false)
        setClassValue(e.target.value)
        creator.classes.map(clas => {
            if (clas.id === e.target.value) {
                setClassObject(clas);
                setAbilities(clas.baseAbilities);
            }
        })
    }

    const raceOptions = creator.races.map(race => ((
        <option value={race.id}>{race.name}</option>
    )))
    const classOptions = creator.classes.map(clas => ((
        <option value={clas.id}>{clas.name}</option>
    )))

    const baseStats = baseRaseStats.map(stat => ((
        <li>
            <label htmlFor="">{stat.name}</label><p>{stat.value}</p>
        </li>
    )))
    const baseAbilities = baseAbilitiesArray.map(ability => ((
        <li>
            <label htmlFor="">{ability}</label>
        </li>
    )))

    const setAge = e => {
        let age = e.target.value;
        setAgeOk(false);
        if (raceValue === "" || !isRaceOk) {
            setWarnings('Musisz mieć wybraną rasę by móc wybrać wiek.');
        }
        else if (age < 16) {
            setWarnings('Minimalny wiek dla postaci to 16 lat.');
        } else if (raceValue === "Człowiek" && age > 80) {
            setWarnings('Ludzie nie dożywają więcej niż 90 lat, więc wiek grywalny kończy się na 80 latach.');
        } else if (raceValue === "Długowieczny" && age > 140) {
            setWarnings('Długowieczni nie dożywają więcej niż 160 lat, więc wiek grywalny kończy się na 140 latach.');
        } else if ((raceValue === "Elf" || raceValue === "Krasnolud") && age > 120) {
            setWarnings('Elfowie i Krasnoludy nie dożywają więcej niż 140 lat, więc wiek grywalny kończy się na 120 latach.');
        } else {
            setAgeOk(true);
            setAgeValue(age);
            setWarnings("");
        }
    }

    const confirmCharacterCreation = (e) => {
        e.preventDefault();
        let char = player;
        if (isNameOk && isRaceOk && isClassOk && isAgeOk) {
            char.name = nameValue;
            char.age = ageValue;
            char.race = raceValue;
            char.class = classValue;
            setCharacter(char)
        } else {
            setWarnings("Wszystkie pola muszą być poprawnie wypełnione")
        }
    }
    return (
        <section className="characterCreator">
            <h3 className="noCharacter">Kreator tworzenia postaci:</h3>
            <div className="wrapCreator">
                <div className="submitCreator">
                    {player.name ? <p className="test">Imię: <span className="kp">{player.name}</span> </p> :
                        <div>
                            <label className="creatorLabel" htmlFor="name">Wybierz swoje imię:</label>
                            <input type="text" id="name" className="changeNameInput" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
                            <button className="submitCreatorField" onClick={e => {
                                e.preventDefault();
                                if (nameValue && nameValue != " ") setNameOk(true)
                            }}>Potwierdź</button>
                            {isNameOk ? <p>ok</p> : null}
                        </div>
                    }

                    {player.race ? <p className="test">Rasa: <span className="kp">{player.race}</span> </p> :
                        <div>
                            <label className="creatorLabel" htmlFor="race">Wybierz swoją rasę:</label>
                            <select className="creatorSelect" name="" id="race" value={raceValue} onChange={setRace}>
                                <option value=""></option>
                                {raceOptions}
                            </select>
                            <button className="submitCreatorField" onClick={e => {
                                e.preventDefault();
                                if (raceValue) setRaceOk(true)
                                setRaceObject(false);
                                setRaceStats([]);
                            }}>Potwierdź</button>
                            {isRaceOk ? <p>ok</p> : null}
                        </div>
                    }

                    {player.age ? <p className="test">Wiek: <span className="kp">{player.age}</span> lat</p> :
                        <div>
                            <label className="creatorLabel" htmlFor="age">Wybierz swój wiek:</label>
                            <input type="number" id="age" min="16" className="changeNameInput" value={ageValue} onChange={setAge} />
                            <button className="submitCreatorField" onClick={e => {
                                e.preventDefault();
                                // setAge(ageValue);

                            }}>Potwierdź</button>
                            {isAgeOk ? <p>ok</p> : null}
                        </div>
                    }

                    {player.class ? <p className="test">Klasa: <span className="kp">{player.class}</span> </p> :
                        <div>
                            <label className="creatorLabel" htmlFor="class">Wybierz swoją klasę:</label>
                            <select className="creatorSelect" name="" id="class" value={classValue} onChange={setClass}>
                                <option value=""></option>
                                {classOptions}
                            </select>
                            <button className="submitCreatorField" onClick={e => {
                                e.preventDefault();
                                if (classValue) setClassOk(true)
                                setClassObject(false);
                                setAbilities([]);
                            }}>Potwierdź</button>
                            {isClassOk ? <p>ok</p> : null}
                        </div>
                    }


                    {warnings ? <p className="warnings">{warnings}</p> : null}
                    <button className="confirmCreator" onClick={confirmCharacterCreation} >Potwierdź stworzenie postaci</button>
                </div>


                <div className="infoCreator">
                    {raceObject ? <p>Rasy:</p> : null}
                    {raceObject ? <div>
                        <h3 className="name">{raceObject.name}</h3>
                        <p className="desc">{raceObject.desc}</p>
                        <p className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit eum et iste molestiae ullam, aspernatur, ut, dicta deleniti ratione ea molestias perspiciatis. Dolor in eos labore magnam beatae, eaque vero!</p>
                        <p>Bazowe statystyki:</p>
                        <ul className="baseStats" >
                            {baseStats}
                        </ul>
                    </div> : null}
                    {classObject ? <p>Klasy:</p> : null}
                    {classObject ? <div>
                        <h3 className="name">{classObject.name}</h3>
                        <p className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit eum et iste molestiae ullam, aspernatur, ut, dicta deleniti ratione ea molestias perspiciatis. Dolor in eos labore magnam beatae, eaque vero!</p>
                        <p>Bazowe statystyki:</p>
                        <ul className="baseStats" >
                            {baseAbilities}
                        </ul>
                    </div> : null}
                </div>
            </div>


            {/* <NameCreator /> */}
            {/* <ProfileCreator /> */}
        </section>
    );
}

const MapStateToProps = state => ({
    creator: state.creator,
    player: state.player.player,
})
const MapDispatchToProps = dispatch => ({
    setCharacter: char => dispatch(setCharacter(char)),
})

export default connect(MapStateToProps, MapDispatchToProps)(CharacterCreator);