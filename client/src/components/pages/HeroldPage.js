import React from 'react';
import { connect } from 'react-redux';

const HeroldPage = ({ player }) => {
    return (
        <section className="heroldPage mainPage">
            <h4 className="note">Herold</h4>
            <p className="test">Witaj {player.login}</p>
            <p className="test">Rozgość się. </p>
            <p className="test">Póki co nie ma tu wielu możliwości, lecz każdego dnia krok po kroczku coś nowego jest dodawane.</p>
            <p className="test">Ostatnio zmienił się trochę układ strony, a także dodałem możliwość nadania imienia swojej postaci w dziale <strong>KP</strong>.</p>
            <p className="test"><strong>Changelog:</strong></p>
            <p className="test"><strong>21.09: </strong> naprawione błędne wyświetlanie się wiadomości, które pomimo "entera" wyświetlały się w 1 linii. Dodane zostały <strong>powiadomienia</strong> dla wersji komputerowej i mobilnej, choć nie odznaczają one linku w trybie natychmiastowym. Potrzebna jest jakaś aktywność, np przejście na inną zakładkę. </p>
            <p className="test"><strong>18.09: </strong>naprawiony został błąd, który "pozornie" nadawał imię, pozwalając odpisać w sesji, a nie zapisywał go w bazie danych. Błąd występował jeśli próbowało się nadać imię w tej samej sesji w której nastąpiła rejestracja konta.</p>
            <p className="test"><strong>17.09: </strong>zrobiona została podstrona obsługująca sesje, a także działające pole odpisu, bez żadnej waloryzacji póki co jednak.</p>
            <p className="test"><strong>17.09: </strong>w dziale KP został wrzucony wstęp do Kreatora Postaci, który umożliwia nadawanie, a także późniejsze zmienianie imienia swojej postaci. Nadanie imienia postaci jest niezbędne by móc odpisać w sesjach.</p>

            <section className="notepad">
                <h4 className="note">Notatnik roboczy:</h4>
                <h4 className="note">czyli spis rzeczy, które będę robił</h4>
                <p className="test"> - BB CODE! - wysoki priorytet</p>
                <p className="test"> - dodanie opcji autologowania opartego o cookies - średni priorytet</p>
                <p className="test"> - usprawnienie działania powiadomień - niski priorytet</p>
            </section>

        </section>
    );
}

const MapStateToProps = (state) => ({
    player: state.player.player
})

export default connect(MapStateToProps)(HeroldPage);