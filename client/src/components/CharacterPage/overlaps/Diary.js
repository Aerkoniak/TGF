import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import parse from 'html-react-parser';


import { updateDiary, loadingSel } from '../../../data/slices/CPSlice';
// import { updateDiary } from '../../../data/actions/creatorActions';

import TinyEditor from '../../RichEditor/TinyEditor';

const Diary = ({ player, character, inPlayerPage, updateDiary }) => {

    const dispatch = useDispatch();
    const loading = useSelector(loadingSel)
    const [diary, setDiary] = useState({});
    const [addEntry, toggleAddingEntry] = useState(false);
    const [diariesArray, setDiariesArray] = useState([])
    const [buttonVisible, toggleConfirmButton] = useState(false)


    useEffect(() => {
        if (!character) {
            setDiary(player);
            setDiariesArray(player.diary || [])
        } else {
            setDiary(character)
            console.log(character.diary)
            setDiariesArray(character.diary)
        }
    }, [character])


    const diaryEntries = diariesArray.map(diary => {
        return (
            <div className="diaryEntry">
                <p className="test">{parse(diary.text)}</p>
                <p className="test">{`Wpis dodany przez ID${diary.author.id} - ${diary.author.name}`}</p>
                <p className="test">{diary.date}</p>
            </div>
        )
    })

    return (
        <>
            <div className="diary">
                <h2>Kronika</h2>

                {diaryEntries}

                {inPlayerPage ?
                    <div className="editWrap">
                        {player.rank <= 2 ? <Button onClick={() => toggleAddingEntry(!addEntry)} variant="outline-dark" size="lg">{loading ? <Spinner animation="border" variant="dark" /> : `Zatwierdź zmiany`}</Button> : null}

                        {addEntry ? <TinyEditor player={player} character={character} updateDiary={updateDiary} /> : null}
                    </div>
                    : null
                }



            </div>

        </>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
const MapDispatchToProps = dispatch => ({
    updateDiary: object => dispatch(updateDiary(object))
})

export default connect(MapStateToProps, MapDispatchToProps)(Diary);