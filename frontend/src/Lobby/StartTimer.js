// CLASS THAT CREATES A TIMER FOR THE LOBBY

import React from 'react';
import Timer from 'react-compound-timer'
import { Typography, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const INITIAL_TEST_TIME = 1 * 5000;
const INITIAL_START_TIME = 6 * 50000;
const LAST_TIME_UNIT = 'h';
const DIRECTION = 'backward';

const WELCOME_MESSAGE = 'The game will begin in:';
const INSTRUCTIONS_MESSAGE = 'Please wait while other players join in.';
const WELCOME_VARIANT = 'h3';
const INSTRUCTIONS_VARIANT = 'h4';
const MINUTES = 'Minutes';
const SECONDS = 'Seconds';
const START_GAME = true;

const STOP_TIMER = 0;

const styles = ({
  welcomeInstruction: {
      marginTop: '15%',
  },
  timerInstruction: {
    marginTop: '5%',
  },
  
});

function StartTimer(props) {
  const {classes} = props;

  return (
    <div className={classes.startTimer}>
      
 
      <Typography className={classes.welcomeInstruction} variant={INSTRUCTIONS_VARIANT}>
        <Box fontStyle="italic" >{INSTRUCTIONS_MESSAGE}</Box>
      </Typography>
      <Typography className={classes.timerInstruction} variant={WELCOME_VARIANT}>{WELCOME_MESSAGE}</Typography>
      

      <Timer
        initialTime={INITIAL_TEST_TIME}
        lastUnit={LAST_TIME_UNIT}
        direction={DIRECTION}
        timeToUpdate={10}
        checkpoints={[
          {
              time: STOP_TIMER,
              callback: () => props.setStartStatus(START_GAME),
          },
      ]}
      >
      {() => (
        <React.Fragment>
          
          <Typography variant={WELCOME_VARIANT}>            
            <br/>
            <Timer.Minutes/> {MINUTES}
            <br/>
            <Timer.Seconds/> {SECONDS}
            <br/>
          </Typography>
        </React.Fragment>
      )}
      </Timer>
    </div>
  );
}

export default withStyles(styles)(StartTimer);