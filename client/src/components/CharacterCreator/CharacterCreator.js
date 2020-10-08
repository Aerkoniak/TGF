import React from 'react';

import NameCreator from '../NameCreator/NameCreator';
import ProfileCreator from '../ProfileCreator/ProfileCreator';

const CharacterCreator = () => {
    return (
        <section className="characterCreator">
            <h3 className="noCharacter">Kreator tworzenia postaci:</h3>
            <div className="wrapCreator">
                <div className="submitCreator">
                    <NameCreator />
                    <ProfileCreator />
                </div>


                {/* <div className="infoCreator">Część informacyjna</div> */}
            </div>


            {/* <NameCreator /> */}
            {/* <ProfileCreator /> */}
        </section>
    );
}

export default CharacterCreator;