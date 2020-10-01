import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// import { parseString } from '../../data/parseString';
import { setProfile } from '../../data/actions/generalActions';
import parse from 'html-react-parser';
import RichEditor from '../RichEditor/RichEditor';


const ProfileCreator = ({ msg, player, setProfile }) => {



    const [textAreaShown, showTextArea] = useState(false);
    const [warnings, setWarnings] = useState(false);
    const [value, setValue] = useState("");
    const [answerPreview, setAnswerPreview] = useState("")


    useEffect(() => {
        if (player.profile) {
            let oldProfile = player.profile;
            setValue(oldProfile)
        }
    }, [])

    useEffect(() => {
        if (msg) {
            setWarnings(false);
            let oldProfile = player.profile;
            setValue(oldProfile);
            showTextArea(false);
            setAnswerPreview("");
        }
    }, [msg])

    const submitProfile = e => {
        e.preventDefault();
    }

    return (
        <div className="profileCreator">
            { player.profile
                ?
                <>
                    <p className="test">Twój profil:<span className="changeProfileSpan" onClick={() => showTextArea(!textAreaShown)} >Zmień profil</span></p>
                    <div className="profile">{parse(player.profile)}</div>
                </>
                :
                <>
                    <p className="test" style={{ cursor: "pointer" }} onClick={() => showTextArea(!textAreaShown)}>Nie masz jeszcze profilu. Kliknij by napisać go teraz</p>

                </>
            }
            { textAreaShown
                ?
                <>
                    <form className="profileForm" onSubmit={submitProfile}>
                        <RichEditor action={setProfile} oldProfile={value} player={player} />
                    </form>
                    <p className="test">{warnings}</p>
                </>
                :
                null}
        </div>
    );
}

const MapStateToProps = state => ({
    player: state.player.player,
    msg: state.player.msg,
})
const MapDispatchToProps = dispatch => {
    return {
        setProfile: (character) => dispatch(setProfile(character))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(ProfileCreator);