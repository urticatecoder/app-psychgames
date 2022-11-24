import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Timer from "react-compound-timer";
import { withRouter } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const LAST_TIME_UNIT = "s";
const TIME_DIRECTION = "backward";
const TIME_OVER = 0;
const TIMER_UPDATE = 10;

const COUNTDOWN = "Countdown!";

const styles = {
  timerInstruction: {
    top: "2vh",
    position: "absolute",
    left: "2vw",
    backgroundColor: "#d16dbf",
    height: "150px",
    width: "160px",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  timerMargin: {
    marginTop: "2vh",
  },
};

/**
 * Timer used in Game One and Game Two that counts down from 30 seconds.
 * When the timer ends, a function given as a prop to submit decisions is triggered.
 * A prop is also given which, when true, will reset the timer. This occurs if all six players submit their choices before 30 seconds are up.
 *
 * @author Eric Doppelt
 */
function IntroTimer(props) {
  const { classes } = props;

  const gameOneIntroEndTime = Date.parse(props.currentState.tutorialEndTime);
  const time = new Date();
  const timeToEnd = gameOneIntroEndTime - time.getTime();
  // const timeToEnd = 200000;

  return (
    <div className={classes.timerInstruction}>
      <Timer
        initialTime={timeToEnd}
        lastUnit={LAST_TIME_UNIT}
        direction={TIME_DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: TIME_OVER,
            // callback: () => moveToGame(props),
          },
        ]}
      >

        {() => (
          <div className={classes.timerMargin}>

            <React.Fragment>
            <Typography style={{fontSize: '22px'}} variant={"h2"}>
                {props.message}
            </Typography>
              <Typography style={{fontSize: '55px'}} variant={"h1"}>
                <Timer.Seconds />
              </Typography>
            <Typography style={{fontSize: '22px'}} variant={"h2"}>
                {COUNTDOWN}
            </Typography>
            </React.Fragment>
          </div>
        )}
      </Timer>
    </div>
  );
}

function moveToGame(props) {
    props.history.push(props.nextRoute);
}

export default withRouter(withStyles(styles)(IntroTimer));
