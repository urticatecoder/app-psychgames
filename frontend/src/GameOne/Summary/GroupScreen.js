import React from 'react';
import PlayerGroup from './PlayerGroup';
import { Typography, Grid, withStyles } from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css';

const TEMP_PLAYERS = [1, 2, 3];
const FULL_DIV = 'fullDiv';
const WINNING_HEADER = 'Winning Players:'
const LOSING_HEADER = 'Losing Players:'
const HEADER_VARIANT='h4';
const styles = ({
    winners: {
        marginTop: '100px',
        marginLeft: '10%',
        marginRight: '10%',
    },
    losers: {
        marginTop: '50px',
        marginLeft: '10%',
        marginRight: '10%',
    },
    playerGroup: {
        marginTop: '30px',
    }
});

function GroupScreen(props) {
    const {classes} = props;


    return(
        <div className={FULL_DIV}>
            {getGroup(classes.winners, classes.playerGroup, WINNING_HEADER, [1,2,3])}
            {getGroup(classes.losers, classes.playerGroup, LOSING_HEADER, [1, 2, 3])}            
        </div>
    )
}

function getGroup(divClassName, groupClassName, headerText, playersShown) {
    return(
        <div className={divClassName}>
            <Typography variant={HEADER_VARIANT}>{headerText}</Typography>
            <div className={groupClassName}>
                <PlayerGroup players={playersShown}/>
            </div>
        </div>
    )
}

export default withStyles(styles)(GroupScreen);