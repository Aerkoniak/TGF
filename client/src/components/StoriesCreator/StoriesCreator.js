import React, { useState } from 'react';
import { connect } from 'react-redux';

// import RichEditor from '../RichEditor/RichEditor'
import { createStory } from '../../data/actions/storiesActions';

const StoriesCreator = ({ player, createStory }) => {

    const [titleValue, setTitleValue] = useState("");
    const [placeValue, setPlaceValue] = useState("1");

    const createStorySupporter = (e) => {
        e.preventDefault();
        let story = {};
        let author = {
            name: player.name,
            id: player.id,
            rank: player.rank
        };
        story.author = author;
        story.title = titleValue;
        story.place = placeValue;
        console.log(story)
        createStory(story);
    }

    return (
        <div className="storyCreator">
            <h2 className="test">Kreator sesji globalnej</h2>
            <form className="createStory" onSubmit={createStorySupporter}>
                <label htmlFor="titleForStory" className="titleForStory" >Nadaj tytuł sesji:</label>
                <input type="text" id="titleForStory" className="titleForStoryInput" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
                <label htmlFor="place" className="placeLabel">Wybierz dział:</label>
                <select name="" id="place" className="placeSelect" value={placeValue} onChange={(e) => setPlaceValue(e.target.value)} >
                    <option value="1">Dział 1</option>
                    <option value="2">Dział 2</option>
                    <option value="3">Dział 3</option>
                </select>
                <input type="submit" className="newStorySubmit" value="Zaakceptuj" />
            </form>
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    createStory: story => dispatch(createStory(story))
})

export default connect(MapStateToProps, MapDispatchToProps)(StoriesCreator);