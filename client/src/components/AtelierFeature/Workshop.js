import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import styles from '../../css/atelier.module.css';
import _ from 'lodash';

import { Button, Accordion, Card, InputGroup, FormControl, Spinner, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { makeItem, setEq, magazineItem } from '../../data/slices/workshopSlice';

const Workshop = ({ player, equipment }) => {

    const dispatch = useDispatch();
    const [newItem, toggleNewItem] = useState(false);
    const [eqStore, toggleEqStore] = useState(false);
    const [bodyPart, setBodyPart] = useState("");
    // const [bodyWord, setBodyWord] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemDesc, setItemDesc] = useState("");

    const [eqList, setEqList] = useState([]);

    const [itemDone, setItemDone] = useState(false);

    useEffect(() => {
        if (player.equipment) {
            dispatch(setEq(player.equipment.privEq));
        }
    }, [player])
    useEffect(() => {
        let equip = _.sortBy(equipment, ["bodyCat", "name"])
        setEqList(equip);
    }, [equipment])

    const forgeItem = () => {
        let item = {
            name: itemName,
            bodyCat: bodyPart,
            desc: itemDesc
        };
        switch (item.bodyCat) {
            case "1": {
                item.bodyPlace = "Na głowie"
            } break;
            case "2": {
                item.bodyPlace = "Na szyi"
            } break;
            case "3": {
                item.bodyPlace = "Korpus"
            } break;
            case "4": {
                item.bodyPlace = "W rękach"
            } break;
            case "5": {
                item.bodyPlace = "Na dłoniach"
            } break;
            case "6": {
                item.bodyPlace = "Na nogach"
            } break;
        }

        let skills = player.skills;
        const newItem = makeItem(skills, item);
        console.log(newItem);
        setItemDone(newItem);
    }

    const throwItem = () => {
        setBodyPart("");
        setItemName("");
        setItemDesc("");
        setItemDone(false);
    }
    const saveItem = () => {
        dispatch(magazineItem(player, itemDone))
        setBodyPart("");
        setItemName("");
        setItemDesc("");
        setItemDone(false);
    }


    const JustDoneItem = ({ item }) => {
        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" {...props}>
                {item.desc}
            </Tooltip>
        );

        return (
            <div className={styles.newItem}>
                <p>{item.name}</p>
                <p>{item.bodyPlace}</p>
                <p>{item.quality}</p>
                <p>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <span>Opis</span>
                    </OverlayTrigger>
                </p>
            </div>
        )
    }

    const itemsInStore = eqList.map(eqElement => ((
        <JustDoneItem item={eqElement} />
    )))

    return (
        <div>
            <h4>Warsztat rzemieślniczy {player.name}a</h4>

            <Accordion activeKey={newItem ? `0` : false} >
                <Card>
                    <Accordion.Toggle className={styles.newItemAcc} as={Card.Header} eventKey="0" onClick={() => toggleNewItem(!newItem)} >
                        Stwórz nowy przedmiot
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Form>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Wybierz część ciała</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl as='select' custom value={bodyPart} onChange={(e) => {
                                        setBodyPart(e.target.value)

                                    }}>
                                        <option value=""></option>
                                        <option value="1">Głowa</option>
                                        <option value="2">Szyja</option>
                                        <option value="3">Korpus</option>
                                        <option value="4">Ręce</option>
                                        {/* opcja Dłonie z val 5 będzie dostępna tylko po spełnieniu odpowiednich warunków. */}
                                        <option value="5">Dłonie</option>
                                        <option value="6">Stopy</option>

                                    </FormControl>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Nazwij swój przedmiot</InputGroup.Text>

                                    </InputGroup.Prepend>
                                    <FormControl value={itemName} onChange={(e) => setItemName(e.target.value)} />
                                </InputGroup>
                                <FormControl as="textarea" placeholder="Opisz krótko swój przedmiot" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} />
                                <Button block onClick={forgeItem} variant="outline-dark">Stwórz</Button>
                            </Form>

                            {itemDone ?
                                <div className={styles.itemDoneWrap}>
                                    <JustDoneItem item={itemDone} />
                                    <Button onClick={throwItem} variant="outline-warning">Wyrzuć</Button>
                                    <Button onClick={saveItem} variant="outline-success">Zostaw</Button>
                                </div>

                                : null}

                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Accordion activeKey={eqStore ? `0` : false} >
                <Card>
                    <Accordion.Toggle className={styles.newItemAcc} as={Card.Header} eventKey="0" onClick={() => toggleEqStore(!eqStore)} >
                        Otwórz magazyn
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            {itemsInStore}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}
const MapStateToProps = state => ({
    player: state.player.player,
    equipment: state.w.equipment,
})

export default connect(MapStateToProps)(Workshop);