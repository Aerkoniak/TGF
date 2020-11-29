import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

const Diary = ({ player, character }) => {

    const [diary, setDiary] = useState({})
    useEffect(() => {
        if (!character) {
            setDiary(player)
        } else setDiary(character)
    }, [character])

    return (
        <>
            <div>
                <h2>Kronika</h2>
                <p>{`To jest kronika ${diary.name}`}</p>
            </div>

        </>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(Diary);