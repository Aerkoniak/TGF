import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import _ from 'lodash';
import styles from '../../../css/atelier.module.css'
import { Button, Accordion, Card, InputGroup, FormControl, Spinner, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { makeItem, setEq, magazineItem } from '../../../data/slices/workshopSlice';
import { loadingSel, confirmEqChanges, addBody } from '../../../data/slices/CPSlice';


const Equip = ({ player, equipment, isLogged }) => {



    const dispatch = useDispatch();
    const loading = useSelector(loadingSel);
    const [eqList, setEqList] = useState([]);
    const [bodyEq, setBodyEq] = useState([]);
    const [saveChangeBtn, toggleBtn] = useState(false);

    useEffect(() => {
        if (player.equipment) {
            dispatch(setEq(player.equipment.privEq));
            setBodyEq(player.equipment.body)
        }
    }, [player])

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
        let bodyArray = [...bodyEq];
        let eqArray = [...eqList];

        let ind = 0;
        eqArray.forEach((thing, index) => {
            if (thing.id === item.id) ind = index;
        })

        eqArray.splice(ind, 1);

        let itemFromEq = bodyArray.splice((item.bodyCat - 1), 1, item);

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



    const JustDoneItem = ({ item, set }) => {
        const renderTooltip = (props) => (
            <Tooltip id="button-tooltip" {...props}>
                {item.desc}
            </Tooltip>
        );


        return (
            <div className={styles.newItem}>
                <p>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <span>{item.name}</span>
                    </OverlayTrigger>
                </p>
                <p>{item.bodyPlace}</p>
                <p>{item.quality}</p>
                {set ?
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
                        part = "torsie";
                        prefix = "na"
                    }
                    break;
                case 2:
                    {
                        part = "nogach";
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
            <div className={styles.inStore}>
                <h5>W ekwipunku</h5>
                {itemsInStore}
            </div>

        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    equipment: state.w.equipment,
    isLogged: state.player.player
})

export default connect(MapStateToProps)(Equip);