import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { setCharName } from '../../data/actions/generalActions';

const NameCreator = ({ msg, player, setCharName }) => {

    const [name, setName] = useState("");
    const [warnings, setWarnings] = useState(false);
    const [isNameOk, toggleIsNameOk] = useState(true);

    const submitNameChange = (e) => {
        e.preventDefault();
        let character = {};
        character = player;
        character.name = name;
        if (name === " " || name === false || name.length < 2 || (name[0] === name[1])) {
            setWarnings("Imie nie może składać się ze spacji. Powinno też mieć powyżej 2 znaków.");
            setName('')
        } else {
            setCharName(character);
        }
    }
    useEffect(() => {
        if (msg) {
            toggleIsNameOk(true);
            setName('')
        }
    }, [msg])


    return (
        <div className="charCreator">
            { player.name ?
                <>
                    <p className="test">Imię Twojej postaci to: {player.name}. <span className="changeNameSpan" onClick={() => toggleIsNameOk(!isNameOk)} >Zmień imię.</span></p>
                </>
                :
                <>
                    <p className="test">Chcesz nadać imię swojej postaci?</p>
                    <form onSubmit={submitNameChange}>
                        <input type="text" className="changeNameInput" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="submit" value="Zaktualizuj" className="submitCharName" onClick={submitNameChange} />
                    </form>
                    <p className="test">{warnings}</p>
                </>
            }

            { isNameOk ?
                null
                : <>
                    <form onSubmit={submitNameChange}>
                        <input type="text" className="changeNameInput" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="submit" value="Zaktualizuj" className="submitCharName" onClick={submitNameChange} />
                    </form>
                    <p className="test">{warnings}</p>
                </>
            }
        </div>
    );
}

const MapStateToProps = (state) => ({
    msg: state.player.msg,
    player: state.player.player
})

const MapDispatchToProps = dispatch => {
    return {
        setCharName: (character) => dispatch(setCharName(character))
    }
}

export default connect(MapStateToProps, MapDispatchToProps)(NameCreator);