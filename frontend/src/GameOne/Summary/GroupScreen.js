import React, {useState} from 'react';
import PlayerGroup from './PlayerGroup';
import { Typography, Grid, Button, withStyles } from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css';
import Confetti from 'react-dom-confetti';
 
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
    },
    confetti: {
        top: '0%',
        left: '50%',
    }
});

const config = {
    angle: 0,
    spread: 360,
    startVelocity: 20,
    elementCount: 150,
    dragFriction: 0.05,
    duration: 5000,
    stagger: 10,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };


function GroupScreen(props) {
    const {classes} = props;
    const [confetti, setConfetti] = useState(false);
    return(
        <div className={FULL_DIV}>
            <Confetti className={classes.confetti} active={ confetti } config={ config }/>
            {getGroup(classes.winners, classes.playerGroup, WINNING_HEADER, [1,2,3])}
            {getGroup(classes.losers, classes.playerGroup, LOSING_HEADER, [1, 2, 3])}

            {/* For Testing Only */}
            <br/>
            <br/>
            <Button onClick={() => setConfetti(!confetti)}>Press Twice for Confetti</Button>
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