import React from "react";
import { Button, withStyles } from "@material-ui/core";
import socket from "../../socketClient";
import { Variants } from "../../util/common_constants/stylings/StylingsBundler";

const CONFIRM_CHOICES_TEXT = "Confirm Decision!";

const KEEP_INDEX = 0;
const INVEST_INDEX = 1;
const COMPETE_INDEX = 2;

const PRIMARY_COLOR = "primary";
const SEND_DECISION_WEBSOCKET = "confirm choice for game 2";
const NOTE_TIME = true;

const styles = {
  confirmButton: {
    position: "absolute",
    top: "68vh",
    left: "5vw",
    height: "5vh",
    width: "15vw",
    opacity: ".9",
    borderRadius: "8px",
    alignItems: "center",
    fontSize: "15px",
  },
};

/**
 * Component that allows the submission of choices in Game Two.
 * Handles the web socket call and sends investements passed in as props from Game Two.
 * @param {*} props tell the choices to send in the web socket call.
 *
 * @author Eric Doppelt
 */
function ConfirmButtonTwo(props) {
  const { classes } = props;

  if (props.submit) {
    sendDecisions(props);
  }

  return (
    <Button
      className={classes.confirmButton}
      variant={Variants.CONTAINED}
      color={PRIMARY_COLOR}
      onClick={() => props.setNoteTime(NOTE_TIME)}
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function sendDecisions(props) {
  if (props.loginCode != null) {
  console.log('resources');
  console.log('compete');
  console.log(props.resources[COMPETE_INDEX]);
  console.log('keep');
  console.log(props.resources[KEEP_INDEX]);
  console.log('invest');
  console.log(props.resources[INVEST_INDEX]);
  socket.emit(SEND_DECISION_WEBSOCKET, props.loginCode, props.resources[COMPETE_INDEX], props.resources[KEEP_INDEX], props.resources[INVEST_INDEX], props.timeLeft);
  props.clearSelected();
  props.clearSubmission();
  }
}

export default withStyles(styles)(ConfirmButtonTwo);
