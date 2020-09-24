// CLASS THAT CREATES A TIMER FOR THE LOBBY

import React, { useState, useEffect } from 'react';
import {Typography} from '@material-ui/core'

const WAIT_TIME = 10;
const SECOND_INCREMENTER = 1;
const INCREMENT_TIME_MS = 1000;
const FINISHED_TIME = 0;
const START_GAME = true;
const DELAY_GAME = false;
const START_TIMER = true;
const PAUSE_TIMER = false;

function Timer(props) {
  const [seconds, setSeconds] = useState(WAIT_TIME);
  const [isActive, setIsActive] = useState(START_TIMER);

  function toggle() {
    setIsActive(!isActive);
  }
  
  useEffect(() => {
    let interval = null;
    if (isActive && seconds !== FINISHED_TIME) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds -= SECOND_INCREMENTER);
      }, INCREMENT_TIME_MS);
    } else if (isActive && seconds === FINISHED_TIME) {
      props.setStartStatus(START_GAME);
      setIsActive(PAUSE_TIMER)
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="Timer">
      <Typography
       className="Time"
       variant='h3'
       >
        {seconds}s
      </Typography>
    </div>
        
  );
}

export default Timer;