import React from 'react';
import PlayerImages from './PlayerImages';
import { Typography } from '@material-ui/core';

const LABEL = 'label'
function PlayerProfile(props) {

    return(
        <div>
        {PlayerImages[props.player]}
        <Typography id={LABEL + PlayerImages[LABEL + props.player]}>{PlayerImages[LABEL + props.player]}</Typography>
        </div>
    )
}

export default (PlayerProfile);