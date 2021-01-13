import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Timer from "react-compound-timer";
import { Variants } from "../common_constants/stylings/StylingsBundler";
import { withRouter } from "react-router-dom";

const WAIT_TIME = 70 * 1000;
const LAST_TIME_UNIT = "s";
const TIME_DIRECTION = "backward";
const TIME_OVER = 0;
const TIMER_UPDATE = 10;

const GAME_ONE_ROUTE = '/game-one';
const COUNTDOWN = "Countdown!";

const styles = {
  timerInstruction: {
    top: "2vh",
    position: "absolute",
    left: "2vw",
    backgroundColor: "#d16dbf",
    height: "190px",
    width: "15vw",
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

  return (
    <div className={classes.timerInstruction}>
      <Timer
        initialTime={WAIT_TIME}
        lastUnit={LAST_TIME_UNIT}
        direction={TIME_DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: TIME_OVER,
            callback: () => moveToGame(props),
          },
        ]}
      >

        {() => (
          <div className={classes.timerMargin}>

            <React.Fragment>
            <Typography style={{fontSize: '25px'}} variant={Variants.LARGE_TEXT}>
                {props.message}
            </Typography>
              <Typography style={{fontSize: '80px'}} variant={Variants.LARGEST_TEXT}>
                <Timer.Seconds />
              </Typography>
            <Typography style={{fontSize: '25px'}} variant={Variants.LARGE_TEXT}>
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
    console.log(props);
    props.history.push(GAME_ONE_ROUTE);
}

export default withRouter(withStyles(styles)(IntroTimer));
