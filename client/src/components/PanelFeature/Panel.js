import React, { useState, useEffect } from 'react';

import styles from '../../css/panel.module.css';

import SetRankUtility from '../SetRankUtility/SetRankUtility';

const Panel = () => {
    return (
        <section className={styles.main}>
            <h3>Panelik!</h3>

            <SetRankUtility />
        </section>
    );
}

export default Panel;