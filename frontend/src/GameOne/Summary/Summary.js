import React, {useState} from 'react';
import PlayerGroup from '../../Icons/Components/PlayerGroup';
import { Typography, Grid, Button, withStyles } from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css';
import DelayedConfetti from './DelayedConfetti';
import ContinueButton from '../../CommonComponents/ContinueButton';
 
const FULL_DIV = 'fullDiv';
const WINNING_HEADER = 'Winning Players'
const LOSING_HEADER = 'Losing Players'
const HEADER_VARIANT='h4';
const WINNER_ID = 'winnerText'
const LOSER_ID = 'loserText'
const WINNERS = [0, 1, 2]
const LOSERS = [3, 4, 5]
const NUM_PLAYERS = 6

const ALWAYS_ENABLED = false;

const styles = ({
    winners: {
        marginTop: '15vh',
        marginLeft: '10%',
        marginRight: '10%',
    },
    losers: {
        marginTop: '15vh',
        marginLeft: '10%',
        marginRight: '10%',
    },
    playerGroup: {
        marginTop: '30px',
    },
});



function GroupScreen(props) {
    const {classes} = props;
   
    console.log(props)
    let winnerIndices = getAvatarIndices(props.winners, props.allLoginCodes)
    let loserIndices = getAvatarIndices(props.losers, props.allLoginCodes)

    // FOR TESTING
    if (winnerIndices.length == 0) winnerIndices = WINNERS
    if (loserIndices.length == 0) loserIndices = LOSERS

    return(
        <div className={FULL_DIV}>
            <DelayedConfetti/>
            {getGroup(classes.winners, classes.playerGroup, WINNING_HEADER, winnerIndices, WINNER_ID)}
            {getGroup(classes.losers, classes.playerGroup, LOSING_HEADER, loserIndices, LOSER_ID)}
            <br/>
            <br/>
            <br/>
            <ContinueButton className={classes.continueButton} route='game-two-tutorial' disabled={ALWAYS_ENABLED}/>
        </div>
    )
}

function getGroup(divClassName, groupClassName, headerText, playersShown, textID) {
    return(
        <div className={divClassName}>
            <Typography id={textID} variant={HEADER_VARIANT}>{headerText}</Typography>
            <div className={groupClassName}>
                <PlayerGroup players={playersShown}/>
            </div>
        </div>
    )
}

// FIXME: duplicated code
function getAvatarIndices(loginCodes, allLoginCodes) {
    let indices = []
    
    for (let i = 0; i < loginCodes.length; i++) {
        for (let j = 0; j < allLoginCodes.length; j++) {
            if (allLoginCodes[j] == loginCodes[i]) {
                indices.push(j);
                break;
            }
        }
    }
    return indices;
}

export default withStyles(styles)(GroupScreen);