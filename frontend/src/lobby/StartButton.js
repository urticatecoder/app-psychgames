import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Variants } from "../common/common_constants/stylings/StylingsBundler";

const BUTTON_MESSAGE = "Begin Experiment";
const BUTTON_ID = "timerButton";
const styles = {
  startButton: {
    marginTop: "60px",
    width: "200px",
    height: "50px",
  },
};

function StartButton(props) {
  const { classes } = props;

  return (
    <div>
      <Button
        id={BUTTON_ID}
        className={classes.startButton}
        variant={Variants.CONTAINED}
        disabled={!props.startStatus}
        color={props.startStatus ? "primary" : "secondary"}
        onClick={() => props.history.push("/game-one-tutorial")}
      >
        {BUTTON_MESSAGE}
      </Button>
    </div>
  );
}

export default withStyles(styles)(withRouter(StartButton));
