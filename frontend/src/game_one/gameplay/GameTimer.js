import React, { useState } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Timer from "react-compound-timer";
import { Variants } from "../../common/common_constants/stylings/StylingsBundler";

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

const TURN_TIME = 30 * 1000;
const LAST_TIME_UNIT = "h";
const DIRECTION = "backward";
const STOP_TIMER = 0;
const TIMER_UPDATE = 10;

const SUBMIT_DECISIONS = true;

const DO_NOT_RESET_TIMER = false;
const TIMER_MESSAGE = "The round ends in:";

function GameTimer(props) {
  const { classes } = props;

  return (
    <div className={classes.timerInstruction}>
      <Timer
        initialTime={TURN_TIME}
        lastUnit={LAST_TIME_UNIT}
        direction={DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: STOP_TIMER,
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
    setResetTimer(DO_NOT_RESET_TIMER);
    start();
  }
}

export default withStyles(styles)(GameTimer);
