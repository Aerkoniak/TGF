import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { parseString } from '../../data/parseString';
import { setProfile } from '../../data/actions/generalActions';


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
        let character = {};
        character = player;

        if (value.length < 10) {
            setWarnings("Zbyt krótki profil. Minimum 50 znaków.")
        } else {
            character.profile = value;
            setProfile(character)
        }
    }

    return (
        <div className="profileCreator">
            { player.profile
                ?
                <>
                    <p className="test">Twój profil:<span className="changeProfileSpan" onClick={() => showTextArea(!textAreaShown)} >Zmień profil</span></p>
                    <p className="profile">{parseString(player.profile)}</p>
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
                        <textarea className="profileArea" name="" id="" minLength="100" value={value} onChange={(e) => setValue(e.target.value)} ></textarea>
                        <button className="profileViewer" onClick={(e) => {
                            e.preventDefault();
                            setAnswerPreview(value)
                        }}>Podgląd</button>
                        <input type="submit" value="Zaktualizuj" className="submitProfile" />
                    </form>
                    <p className="test">{warnings}</p>
                </>
                :
                null}
            {answerPreview ?
                <>
                    <span className="answerPreviewSpan">Tak będzie wyglądać Twoja wiadomość:</span>
                    <p className="answerPreview">{parseString(answerPreview)}</p>
                </>
                : null}
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