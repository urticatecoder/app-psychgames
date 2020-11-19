import React, {useState} from 'react';
import Confetti from 'react-dom-confetti';
import {withStyles } from '@material-ui/core';

const styles = {
    confetti: {
        top: '0%',
        left: '50%',
    }
}

const WAIT_FOR_CONFETTI = 1500

const CONFIG = {
    angle: 0,
    spread: 360,
    startVelocity: 20,
    elementCount: 800,
    dragFriction: 0.05,
    duration: 10000,
    stagger: 10,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  function DelayedConfetti(props) {
    const {classes} = props;
    const [confetti, setConfetti] = useState(false);

    setTimeout(() => {
        setConfetti(true)
      }, WAIT_FOR_CONFETTI);

      return(
        <Confetti className={classes.confetti} active={ confetti } config={ CONFIG }/>
      )
  }

  export default withStyles(styles)(DelayedConfetti);