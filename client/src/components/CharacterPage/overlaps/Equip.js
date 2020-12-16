import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import _ from 'lodash';
import styles from '../../../css/atelier.module.css'
import { Button, Accordion, Card, InputGroup, FormControl, Spinner, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { makeItem, setEq, magazineItem } from '../../../data/slices/workshopSlice';
import { loadingSel, confirmEqChanges, addBody } from '../../../data/slices/CPSlice';
import { tryStealing, selectEffect } from '../../../data/slices/theftSlice';



const Equip = ({ player, equipment, isLogged, inPlayerPage, character }) => {



    const dispatch = useDispatch();
    const loading = useSelector(loadingSel);
    const theftEffect = useSelector(selectEffect)
    const [eqList, setEqList] = useState([]);
    const [bodyEq, setBodyEq] = useState([]);
    const [saveChangeBtn, toggleBtn] = useState(false);

    useEffect(() => {
        if (!character) {
            if (player.equipment) {
                dispatch(setEq(player.equipment.privEq));
                setBodyEq(player.equipment.body)
            }
        } else {
            dispatch(setEq(character.equipment.privEq));
            setBodyEq(character.equipment.body);
        }

    }, [player, character])

    useEffect(() => {
        let equip = _.sortBy(equipment, ["bodyCat", "name"])
        setEqList(equip);
    }, [equipment])

    useEffect(() => {
        if (loading === "loading") {
            if (!loading) toggleBtn(false)
        } else { toggleBtn(false) }

    }, [loading])

    const pickEquip = (item) => {
        toggleBtn(true)
        // ustalenie tablic własnego eq i magazynu
        let bodyArray = [...bodyEq];
        let eqArray = [...eqList];

        // ustalenie jaki index ma przedmiot z magazynu i wyciągnięcie go z tej tablicy
        let ind = 0;
        eqArray.forEach((thing, index) => {
            if (thing.id === item.id) ind = index;
        })
        eqArray.splice(ind, 1);

        // ustalamy jaką kategorię ma przedmiot i na podstawie tego zamieniamy
        // przedmioty w ekwipunku na sobie, ściągając stary
        let itemFromEq = null;
        switch (item.bodyCat) {
            case "1":
                {
                    itemFromEq = bodyArray.splice(0, 1, item);
                }
                break;
            case "2":
                {
                    itemFromEq = bodyArray.splice(1, 1, item);
                }
                break;
            case "3":
                {
                    itemFromEq = bodyArray.splice(2, 1, item);
                }
                break;
            case "4":
                {
                    if (bodyArray[3] === null) {
                        itemFromEq = bodyArray.splice(3, 1, item);
                    } else if (bodyArray[3] != null && bodyArray[4] === null) {
                        itemFromEq = bodyArray.splice(4, 1, item);
                    } else if (bodyArray[3] != null && bodyArray[4] != null) {
                        itemFromEq = bodyArray.splice(3, 1, item);
                    }
                }
                break;
            case "5":
                {
                    if (bodyArray[5] === null) {
                        itemFromEq = bodyArray.splice(5, 1, item);
                    } else if (bodyArray[5] != null && bodyArray[6] === null) {
                        itemFromEq = bodyArray.splice(6, 1, item);
                    } else if (bodyArray[5] != null && bodyArray[6] != null) {
                        itemFromEq = bodyArray.splice(5, 1, item);
                    }
                }
                break;
            case "6":
                {
                    itemFromEq = bodyArray.splice(7, 1, item);
                }
                break;

        }

        // let itemFromEq = bodyArray.splice((item.bodyCat - 1), 1, item);
        console.log(itemFromEq)
        if (itemFromEq[0] != null) {
            eqArray.push(itemFromEq[0]);
        }

        let equipList = _.sortBy(eqArray, ["bodyCat", "name"])
        setEqList(equipList);
        setBodyEq(bodyArray);
    }
    const takeItem = (item) => {
        toggleBtn(true)
        let bodyArray = [...bodyEq];
        let eqArray = [...eqList];
        let ind = 0;
        bodyArray.forEach((thing, index) => {
            if (thing != null) {
                if (thing.id === item.id) ind = index;
            }
        })
        let itemFromEq = bodyArray.splice(ind, 1, null);
        if (itemFromEq[0] != null) {
            eqArray.push(itemFromEq[0]);
        }
        let equipList = _.sortBy(eqArray, ["bodyCat", "name"])
        setEqList(equipList);
        setBodyEq(bodyArray);
    }

    const confirmChanges = () => {
        let data = {
            body: [...bodyEq],
            store: [...eqList],
            docRef: player.accountDocRef,
        }
        console.log(data);
        dispatch(confirmEqChanges(data))
    }

    const stealAttempt = (itemID) => {
        dispatch(tryStealing(character.accountDocRef, player, itemID))
    }



    const JustDoneItem = ({ item, set }) => {
        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" {...props}>
                {item.desc}
            </Tooltip>
        );


        return (
            <div className={styles.newItem}>
                <p>{item.bodyPlace}</p>
                <p>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <span>{item.name}</span>
                    </OverlayTrigger>
                </p>
                <p>{item.quality}</p>

                {/* jeśli character jest true, a gracz ma klasę łotrzyk to pojawi mu się przycisk do kradzieży, a jeśli !character to znaczy że jest w KP i są przyciski do edycji ekwipunku - załóż/zdejmij */}
                {character ?

                    player.class === "Łotrzyk" && item.bodyCat === "5" ?
                        <Button onClick={() => stealAttempt(item.id)}>Spróbuj ukraść</Button> : null

                    : set ?
                        <Button onClick={() => pickEquip(item)} variant="outline-dark">Załóż</Button> :
                        <Button onClick={() => takeItem(item)} variant="outline-danger">Zdejmij</Button>}

            </div>
        )
    }

    const itemsInStore = eqList.map(eqElement => ((
        <JustDoneItem set item={eqElement} />
    )))

    const onMyself = bodyEq.map((eqElement, index) => {
        if (eqElement === null) {
            let prefix = "";
            let part = "";
            switch (index) {
                case 0:
                    {
                        part = "głowie";
                        prefix = "na"
                    }
                    break;
                case 1:
                    {
                        part = "szyi";
                        prefix = "na"
                    }
                    break;
                case 2:
                    {
                        part = "korpusie";
                        prefix = "na"
                    }
                    break;
                case 3:
                    {
                        part = "prawej ręce";
                        prefix = "w"
                    }
                    break;
                case 4:
                    {
                        part = "lewej ręce";
                        prefix = "w"
                    }
                    break;
                case 5:
                    {
                        part = "prawej dłoni";
                        prefix = "na"
                    }
                    break;
                case 6:
                    {
                        part = "lewej dłoni";
                        prefix = "w"
                    }
                    break;
                case 7:
                    {
                        part = "nogach";
                        prefix = "na"
                    }
                    break;
            }
            return (
                <p>{`Bohater nie ma nic ${prefix} ${part}`}</p>
            )
        } else if (eqElement != null) {
            return (
                <JustDoneItem item={eqElement} />
            )
        }

    })

    return (
        <section className={styles.equip}>

            <div className={styles.onBody}>
                <h5>Na sobie</h5>
                {onMyself}
            </div>
            {saveChangeBtn ? <Button onClick={confirmChanges}>Zatwierdź zmiany</Button> : null}

            {loading === "loading" ? <Spinner animation="border" variant="danger" /> : null}
            {!inPlayerPage ?
                <div className={styles.inStore}>
                    <h5>W ekwipunku</h5>
                    {itemsInStore}
                </div> : null}

            {theftEffect === "loading" ? <Spinner animation="border" /> : null}
            {theftEffect === true && theftEffect != "loading" ? theftEffect : null}

        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    equipment: state.w.equipment,
    isLogged: state.player.player
})

export default connect(MapStateToProps)(Equip);