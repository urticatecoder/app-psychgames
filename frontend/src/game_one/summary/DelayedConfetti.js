import React, {useState} from 'react';
import Confetti from 'react-dom-confetti';
import {withStyles } from '@material-ui/core';

const styles = {
    confetti: {
        top: '0%',
        left: '50%',
    },
    wrapperDiv: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflowY: 'hidden',
      top: '0vh',
    }
}

const WAIT_FOR_CONFETTI = 1500
const NO_CONFETTI = false;
const YES_CONFETTI = true;
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

  /**
   * Component used to display confetti in the Summary screen following Game One.
   * @param {*} props is used only to style the component using withStyles
   * 
   * @author Eric Doppelt
   */
  function DelayedConfetti(props) {
    const {classes} = props;
    const [confetti, setConfetti] = useState(NO_CONFETTI);

    setTimeout(() => {
        setConfetti(YES_CONFETTI)
      }, WAIT_FOR_CONFETTI);

      return(
        <div className={classes.wrapperDiv}>
          <Confetti className={classes.confetti} active={ confetti } config={ CONFIG }/>
        </div>
      )
  }

  export default withStyles(styles)(DelayedConfetti);