import React, { useState, useEffect } from 'react';
import { NavLink, Redirect, Switch, Route } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { selectSend, selectID } from '../../data/slices/globalStoriesSlice'
import _ from 'lodash';
import { Button, Accordion, Card } from 'react-bootstrap'
import styles from '../../css/stories.module.css';
import District from '../globalStories/District';
import StoriesCreator from '../globalStories/StoriesCreator';
import ProfileViewer from '../ProfileViewer/ProfileViewer';

const GlobalStories = ({ globalStories, player }) => {

    const isSend = useSelector(selectSend);
    const ID = useSelector(selectID);
    const [storiesArray, setStoriesArray] = useState([]);
    const [commonDistrict, setCommonDistrict] = useState([]);
    const [tradeDistrict, setTradeDistrict] = useState([]);
    const [nobleDistrict, setNobleDistrict] = useState([]);
    const [deletedStories, setDelStories] = useState([]);

    const [newStory, addNewStory] = useState(false);
    const [redirectToNewSession, forceRedirect] = useState(false)

    const [commonDistNewCounter, setCommonCounter] = useState(null);
    const [tradeDistNewCounter, setTradeCounter] = useState(null);
    const [nobleDistNewCounter, setNobleCounter] = useState(null);

    useEffect(() => {
        setStoriesArray(globalStories);
    }, [globalStories]);

    useEffect(() => {
        let common = [];
        let trade = [];
        let noble = [];
        let deleted = [];
        let _array = _.orderBy(storiesArray, ['id'], ["desc"])
        _array.map(story => {
            if (story.place === "4") deleted.push(story)
            else if (story.place === "3") noble.push(story)
            else if (story.place === "2") trade.push(story)
            else if (story.place === "1") common.push(story)
        })
        setCommonDistrict(common);
        setTradeDistrict(trade);
        setNobleDistrict(noble);
        setDelStories(deleted);
    }, [storiesArray])

    useEffect(() => {
        if (isSend) addNewStory(false)
    }, [isSend])

    useEffect(() => {
        if (ID) forceRedirect(true)
    }, [ID])

    useEffect(() => {
        let counter = 0;
        commonDistrict.map(story => {
            story.spectators.map(spec => {
                if (spec.id === player.id && spec.seen === false) {
                    counter++
                }
            });
        })
        setCommonCounter(counter);
    }, [commonDistrict])

    useEffect(() => {
        let counter = 0;
        tradeDistrict.forEach(story => {
            story.spectators.forEach(spec => {
                if (spec.id === player.id && spec.seen === false) {
                    counter++
                }
            });
        })
        setTradeCounter(counter);
    }, [tradeDistrict])

    useEffect(() => {
        let counter = 0;
        nobleDistrict.forEach(story => {
            story.spectators.forEach(spec => {
                if (spec.id === player.id && spec.seen === false) {
                    counter++
                }
            });
        })
        setNobleCounter(counter);
    }, [nobleDistrict])

    return (
        <section className={styles.main}>
            <nav className={styles.links}>
                <NavLink to="/stories/commons">Dzielnica Mieszczańska <span>{commonDistNewCounter ? commonDistNewCounter : null}</span> </NavLink>
                <NavLink to="/stories/trades">Dzielnica Kupiecka <span>{tradeDistNewCounter ? tradeDistNewCounter : null}</span> </NavLink>
                <NavLink to="/stories/nobles">Dzielnica Szlachecka <span>{nobleDistNewCounter ? nobleDistNewCounter : null}</span> </NavLink>
                <NavLink to="/stories/closed">Sesje Zamknięte</NavLink>
            </nav>

            {/* <Button size="lg" variant="outline-dark">Dodaj nową sesję</Button> */}
            <Accordion activeKey={newStory ? `0` : false}>
                <Card>
                    <Accordion.Toggle className={styles.addStory} as={Card.Header} onClick={() => addNewStory(!newStory)} eventKey="0">
                        Dodaj nową sesję
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <StoriesCreator />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

            <Switch>
                <Route path="/stories/commons" render={(routeProps) => (<District {...routeProps} district="Dzielnica Mieszczańska" storiesArray={commonDistrict} />)} />
                <Route path="/stories/trades" render={(routeProps) => (<District {...routeProps} district="Dzielnica Kupiecka" storiesArray={tradeDistrict} />)} />
                <Route path="/stories/nobles" render={(routeProps) => (<District {...routeProps} district="Dzielnica Szlachecka" storiesArray={nobleDistrict} />)} />
                <Route path="/stories/closed" render={(routeProps) => (<District {...routeProps} district="Sesje Zamknięte" storiesArray={deletedStories} />)} />
            </Switch>
            {redirectToNewSession ? <Redirect to={`/story/id${ID}`} /> : null}
            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    globalStories: state.globalStories.stories,
    player: state.player.player
})

export default connect(MapStateToProps)(GlobalStories);