// CLASS THAT CREATES A TIMER FOR THE LOBBY

import React, { useState, useEffect } from 'react';
import Timer from 'react-compound-timer'
import { Typography } from '@material-ui/core';


const INITIAL_TEST_TIME = 1 * 5000;
const INITIAL_START_TIME = 6 * 50000;
const LAST_TIME_UNIT = 'h';
const DIRECTION = 'backward';

const TEXT_SIZE = 'h3';
const WELCOME_MESSAGE = 'The game will begin in:'
const MINUTES = 'Minutes';
const SECONDS = 'Seconds';
const START_GAME = true;

const STOP_TIMER = 0;

function StartTimer(props) {

  return (
    <div className="Timer">
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
          <Typography variant={TEXT_SIZE}>
            {WELCOME_MESSAGE}
            <br/>
            <br/>
            <Timer.Minutes /> {MINUTES}
            <br/>
            <Timer.Seconds /> {SECONDS}
          </Typography>
        </React.Fragment>
      )}
      </Timer>
    </div>
  );
}

export default StartTimer;