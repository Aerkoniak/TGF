import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import _ from 'lodash';

import styles from '../../css/stories.module.css';

const District = ({ player, district, storiesArray }) => {

    // useEffect(() => {
    //     let counter = 0;
    //     district.forEach(story => {
    //         story.forEach(specs => {
    //             specs.forEach(spectator => {
    //                 if (player.id === spectator.id && !spectator.seen) {
    //                     counter++
    //                 }
    //             })
    //         })
    //     })
    //     if (counter) 
    //  }, [district])

    const storiesLinks = storiesArray.map((story, index) => {
        let flag = false;
        story.spectators.forEach(spec => {
            if (player.id === spec.id & !spec.seen) flag = true;
        })
        return (
            <div key={story.id} className={styles.storyLinkWrap} >
                <p className={styles.author}>{story.author.name}</p>
                <Link className={flag ? styles.titleNew : styles.title} to={`/story/id${story.id}`}><p>{story.title}</p></Link>
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

const MapStateToProps = state => ({
    player: state.player.player
})

export default connect(MapStateToProps)(District);