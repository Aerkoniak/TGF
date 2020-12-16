import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux'
import styles from '../../css/atelier.module.css';
import _ from 'lodash';
import { Button, Card, InputGroup, FormControl, Spinner, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { tryStealing } from '../../data/slices/theftSlice';

const Lair = ({ player, characters }) => {

    const dispatch = useDispatch();
    const [type, setType] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [charactersList, setCharacters] = useState([]);

    useEffect(() => {
        setCharacters(characters)
    }, [characters])

    const pickTheft = (id) => {
        setType(id);
    }

    const makeTheft = (docRef) => {
        let thief = {
            stats: player.stats,
            skills: player.skills,
            player: player
        }
        let targetDocRef = docRef;
        // dispatch(tryStealing(targetDocRef, thief))

    }

    const TypeCard = ({ title, subtitle, desc, id }) => {
        return (
            <Card className={styles.type} bg="light" border="dark" >
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Subtitle>{subtitle}</Card.Subtitle>
                <Card.Text className={styles.desc}>
                    {desc}
                </Card.Text>
                <Button onClick={() => pickTheft(id)} variant="outline-dark">Idź</Button>
            </Card>
        )
    }

    const options = charactersList.map(character => {
        return (
            <option value={character.accountDocRef}>{character.name}</option>
        )
    })

    const ActionCard = ({ title }) => {
        return (
            <Card bg="light" border="dark" >
                <Card.Title>
                    {title}
                </Card.Title>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Wybierz nieszczęśliwca</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="select" value={nameValue} onChange={e => setNameValue(e.target.value)}>
                        {options}
                    </FormControl>
                    <InputGroup.Append>
                        <Button onClick={() => makeTheft(nameValue)} variant="outline-dark">Kradniemy</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Card>
        )
    }

    return (
        <div>
            <h5>Złodziejska melinka</h5>
            <div className={styles.lairWrap}>
                <TypeCard title="Nocne włamanie" subtitle="Cena - 1 PD" id="1"
                    desc="Zaufaj swojemu nosowi i zobacz czym zaskutkuje nocny spacer po mieście." />
                <TypeCard title="Upatrzony Cel" subtitle="Cena - 2 PD" id="2"
                    desc="Przygotuj sprzęt i uderz celnie tam gdzie najbardziej zaboli. Spróbuj okraść upatrzony cel." />
                <TypeCard title="Kradzież kieszonkowa" subtitle="Cena - 3 PD" id="3"
                    desc="Bądź niczym podmuch wiatru. Przesuń się obok swojego celu i zniknij w tłumie nim zorientuje się gdzie jest jego pierścień." />
            </div>

            <div className={styles.action}>
                {type === "3" ?
                    <ActionCard title="Kradzież kieszonkowa" />
                    : null}
            </div>
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    characters: state.characters.characters
})

export default connect(MapStateToProps)(Lair)