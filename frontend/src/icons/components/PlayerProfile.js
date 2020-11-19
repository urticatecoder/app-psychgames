import React from 'react';
import PlayerImages from './PlayerImages';
import { Typography } from '@material-ui/core';

const LABEL = 'label'

/**
 * Component used to visualize avatars with a label indicating the avatar's name beneath it.
 * This is used in the PlayerGroup, VerticalPlayerGroup, and MainAvatar files.
 * @param {*} props tells the player to visualize based on its index.
 * 
 * @author Eric Doppelt
 */
function PlayerProfile(props) {
    return(
        <div>
        {PlayerImages[props.player]}
        <Typography id={LABEL + PlayerImages[LABEL + props.player]}>{PlayerImages[LABEL + props.player]}</Typography>
        </div>
    )
}

export default (PlayerProfile);