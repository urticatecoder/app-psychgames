import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Timer from "react-compound-timer";
import { Variants } from "../common_constants/stylings/StylingsBundler";

const TURN_TIME = 30 * 1000;
const LAST_TIME_UNIT = "h";
const TIME_DIRECTION = "backward";
const TIME_OVER = 0;
const TIMER_UPDATE = 10;

const SUBMIT_DECISIONS = true;

const RESET_TIMER = false;
const TIMER_MESSAGE = "The round ends in:";

const styles = {
  timerInstruction: {
    marginTop: "50px",
    position: "absolute",
    top: "22vh",
    left: "5vw",
    backgroundColor: "#349eeb",
    height: "35vh",
    width: "15vw",
    opacity: ".8",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  timerMargin: {
    marginTop: "11vh",
  },
};

/**
 * Timer used in Game One and Game Two that counts down from 30 seconds.
 * When the timer ends, a function given as a prop to submit decisions is triggered.
 * A prop is also given which, when true, will reset the timer. This occurs if all six players submit their choices before 30 seconds are up.
 *
 * @author Eric Doppelt
 */
function GameTimer(props) {
  const { classes } = props;

  return (
    <div className={classes.timerInstruction}>
      <Timer
        initialTime={TURN_TIME}
        lastUnit={LAST_TIME_UNIT}
        direction={TIME_DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: TIME_OVER,
            callback: () => props.setSubmitDecisions(SUBMIT_DECISIONS),
          },
        ]}
      >
        {({ reset, start }) => (
          <div className={classes.timerMargin}>
            <React.Fragment>
              {checkForReset(
                reset,
                start,
                props.resetTimer,
                props.setResetTimer
              )}
              {TIMER_MESSAGE}
              <Typography variant={Variants.LARGEST_TEXT}>
                <Timer.Seconds />
              </Typography>
            </React.Fragment>
          </div>
        )}
      </Timer>
    </div>
  );
}

function checkForReset(reset, start, resetTimer, setResetTimer) {
  if (resetTimer) {
    reset();
    setResetTimer(RESET_TIMER);
    start();
  }
}

export default withStyles(styles)(GameTimer);
