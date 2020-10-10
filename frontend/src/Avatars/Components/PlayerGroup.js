import React from 'react';
import PlayerProfile from './PlayerProfile';
import { Typography, Grid } from '@material-ui/core';

const GRID_DIRECTION = 'row';
const GRID_JUSTIFY = 'center';
const GRID_SPACING = 10;

function PlayerGroup(props) {
    const {classes} = props;

    return(
            <Grid
            container
            direction={GRID_DIRECTION}
            justify={GRID_JUSTIFY}
            spacing={GRID_SPACING}>
                {props.players.map((element) => {
                return(
                    <Grid item>
                        <PlayerProfile player={element}/>
                    </Grid>
                )})}
            </Grid>
    )
}

export default (PlayerGroup);