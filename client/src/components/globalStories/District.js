import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import _ from 'lodash';

import styles from '../../css/stories.module.css';

const District = ({ district, storiesArray }) => {

    const storiesLinks = storiesArray.map((story, index) => {
        return (
            <div key={story.id} className={styles.storyLinkWrap} >
                <p className={styles.author}>{story.author.name}</p>
                <Link className={styles.title} to={`/story/id${story.id}`}><p>{story.title}</p></Link>
                <p className={styles.date}>{story.nextTurn}</p>
            </div>
        )
    })

    return (
        <section className={styles.district}>
            <h4>{district}</h4>
            <div className={styles.storyLinkWrap}>
                <p className={styles.author}>Autor:</p>
                <p className={styles.date}>Tytuł:</p>
                <p className={styles.date}>Data następnej tury:</p>
            </div>
            {storiesLinks}
        </section>
    );
}

export default District;