import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Timer from "react-compound-timer";

const TURN_TIME = 30 * 1000;
const LAST_TIME_UNIT = "h";
const TIME_DIRECTION = "backward";
const TIME_OVER = 0;
const TIMER_UPDATE = 10;

const SUBMIT_DECISIONS = true;

const RESET_TIMER = false;
const TIMER_MESSAGE_P1 = "The round";
const TIMER_MESSAGE_P2 = "ends in:"
const STOP_NOTING_TIME = false;

const LARGE_WIDTH_THRESHOLD = 1550;
const MEDIUM_WIDTH_THRESHOLD = 1150;

const styles = {
  timerInstruction: {
    marginTop: "50px",
    position: "absolute",
    top: "30vh",
    marginTop: '55px',
    left: "5vw",
    backgroundColor: "#0066ff",
    height: "200px",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  timerMargin: {
    marginTop: "20px",
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
  let margin = getMarginLeft(props.windowWidth);
  let width = getWidth(props.windowWidth);
  console.log("round length: ", props.roundLength);

  return (
    <div style={{marginLeft: margin, width: width}} className={classes.timerInstruction}>
      <Timer
        initialTime={props.roundLength}
        lastUnit={LAST_TIME_UNIT}
        direction={TIME_DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: TIME_OVER,
            callback: () => handleTimeOver(props.setSubmitDecisions, props.setTimeLeft, props.disableButton),
          },
        ]}
      >

        {({ reset, start, pause, getTime }) => (

          <div className={classes.timerMargin}>
            {checkUpdateSeconds(props.noteTime, props.setNoteTime, props.setTimeLeft, props.setSubmitDecisions, getTime())}

            <React.Fragment>
              {checkForReset(
                reset,
                props.resetTimer,
                props.setResetTimer
              )}
              {checkForPause(props.pauseTimer, pause, start)}
              <Typography style={{fontSize: '25px'}} variant={"h1"}>
              {TIMER_MESSAGE_P1} <br/> {TIMER_MESSAGE_P2}
              </Typography>
              <Typography variant={"h1"}>
                <Timer.Seconds />
              </Typography>
            </React.Fragment>
          </div>
        )}
      </Timer>
    </div>
  );
}


function getWidth(windowWidth) {
  if (windowWidth >= LARGE_WIDTH_THRESHOLD) return '200px';
  else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return '180px';
  else return '160px';
}

function getMarginLeft(windowWidth) {
  if (windowWidth >= LARGE_WIDTH_THRESHOLD) return '5vw';
  else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return '2.5vw';
  else return '0px';
}

function checkUpdateSeconds(noteTime, setNoteTime, setTimeLeft, setSubmitDecisions, time) {
  if (noteTime) {
    setNoteTime(STOP_NOTING_TIME);
    setTimeLeft(time);
    setSubmitDecisions(SUBMIT_DECISIONS);
  }
}

function handleTimeOver(setSubmitDecisions, setTimeLeft) {
  setTimeLeft(TIME_OVER);
  disableButton();
  // setSubmitDecisions(SUBMIT_DECISIONS);
}

function checkForReset(reset, resetTimer, setResetTimer) {
  if (resetTimer) {
    reset();
    setResetTimer(RESET_TIMER);
  }
}

function checkForPause(pauseTimer, pause, start) {
  if (pauseTimer) {
    pause();
  } else {
    start();
  }
}

export default withStyles(styles)(GameTimer);
