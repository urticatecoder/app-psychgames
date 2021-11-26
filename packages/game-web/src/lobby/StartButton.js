import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const BUTTON_MESSAGE = "Begin Experiment";
const BUTTON_ID = "timerButton";

const PRIMARY_COLOR = "primary";
const SECONDARY_COLOR = "secondary";
const GAME_ONE_INTRO_ROUTE = "/game-one-intro";

const styles = {
  startButton: {
    marginTop: "60px",
    width: "200px",
    height: "50px",
  },
};

/**
 * Component used as the button that starts the research experiment. It is enabled once the timer in the lobby reaches zero.
 * @param {*} props is used to tell the start button when it should enable itself to allow users into the game.
 * 
 * @author Eric Doppelt
 */
function StartButton(props) {
  const { classes } = props;

  return (
    <div>
      <Button
        id={BUTTON_ID}
        className={classes.startButton}
        variant={"contained"}
        disabled={!props.startStatus}
        color={props.startStatus ? PRIMARY_COLOR : SECONDARY_COLOR}
        onClick={() => props.history.push(GAME_ONE_INTRO_ROUTE)}
      >
        {BUTTON_MESSAGE}
      </Button>
    </div>
  );
}

export default withStyles(styles)(withRouter(StartButton));
