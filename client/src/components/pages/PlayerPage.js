import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import parse from 'html-react-parser';
import ProfileViewer from '../ProfileViewer/ProfileViewer';


const PlayerPage = ({ character, player }) => {

    const checkRang = (player) => {
        switch (player.rank) {
            case 0:
                return (
                    <h2 className="metrics">Administrator</h2>
                )
                break;
            case 2:
                return (
                    <h2 className="metrics">Mistrz Gry</h2>
                )
                break;
            case 3:
                return (
                    <h2 className="metrics">Mieszkaniec</h2>
                )
                break;
            case 4:
                return (
                    <h2 className="metrics">Przybysz</h2>
                )
                break;

            default:
                break;
        }
    }

    return (
        <section className="mainPage playerPage">
            <div className="metricsWrap">
                <div className="avatar">
                    tu będzie avatar
                </div>
                <div className="metricsData">
                    {checkRang(character)}
                    <h2 className="metrics">{character.name}</h2>
                    <p className="metrics">Rasa: {character.race}</p>
                    <p className="metrics">Z zamiłowania: {character.class}</p>
                    <p className="metrics">Wiek: {character.age} lat</p>
                </div>
            </div>
            <div className="profile">
                <h2 className="metrics">Profil</h2>
                {parse(character.profile)}
            </div>
            <ProfileViewer />
        </section>
    );
}

const MapStateToProps = state => ({
    player: state.player.player
})
export default connect(MapStateToProps)(PlayerPage);