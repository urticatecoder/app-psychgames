import React from 'react';
import PlayerShapes from './PlayerShapes';
import { Typography } from '@material-ui/core';

const PLAYER_TITLE = 'Player ';

function PlayerProfile(props) {
    const {classes} = props;

    return(
        <div>
        {PlayerShapes[props.player]}
        <Typography>{PLAYER_TITLE + props.player}</Typography>
        </div>
    )
}

export default (PlayerProfile);