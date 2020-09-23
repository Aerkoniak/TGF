import React from 'react';

import NameCreator from '../NameCreator/NameCreator';


const CharakterPage = () => {
    return (
        <section className="charakterPage mainPage">
            <h4 className="test">Karta Postaci</h4>
            <NameCreator />

            <section className="notepad">
                <h4 className="note">Notatnik roboczy:</h4>
                <p className="test"> <strong>Nowość</strong> Ustawienie <strong>imienia</strong> równoznaczne jest tymczasowo z uzyskaniem statusu Mieszkańca, czyli umożliwia odpisywanie w sesjach. </p>
                <p className="test">Czyli miejsce gdzie gracz od ręki będzie miał dostęp do swojej puli PFów i wszystkich innych punktów które wprowadzę/imy.</p>
                <p className="test">Wewnątrz tej zakładki będzie znajdował się też "sklep", czyli spis umiejek i mechanizm pozwalający na levelowanie już wykupionych.</p>
                <p className="test">MG będą mieli dostęp do pełnej wersji naszej KP.</p>
                <p className="test">Inni gracze będą mieli - do rozwagi - dostęp ograniczony, np. będą widzieć jedynie umiejętności, które mamy na poziomie ponadprzeciętnym, albo te których dotyczy nasza reputacja.</p>
                <p className="test">Na etapie planowania i tworzenia każda rzecz jest do zaimplementowania, im dalej w las tym trudniej, chociaż to nie będzie vallheru, planuje to robić uniwersalne, a nie męczące dla programisty :?.</p>
            </section>

        </section>
    );
}

// const MapStateToProps = (state) => ({
//     player: state.player.player
// })

export default CharakterPage;