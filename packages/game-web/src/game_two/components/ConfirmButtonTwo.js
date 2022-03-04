import React from "react";
import { Button, withStyles } from "@material-ui/core";
import socket from "../../socketClient";

const CONFIRM_CHOICES_TEXT = "Confirm!";

const COMPETE_INDEX = 0;
const KEEP_INDEX = 1;
const INVEST_INDEX = 2;

const PRIMARY_COLOR = "primary";
const SEND_DECISION_WEBSOCKET = "confirm choice for game 2";
const NOTE_TIME = true;

const LARGE_WIDTH_THRESHOLD = 1550;
const MEDIUM_WIDTH_THRESHOLD = 1150;

const styles = {
  confirmButton: {
    position: "absolute",
    top: "30vh",
    marginTop: '280px',
    left: "5vw",
    height: "40px",
    borderRadius: "8px",
    alignItems: "center",
    fontSize: "15px",
    backgroundColor: "#002984"
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
  let margin = getMarginLeft(props.windowWidth);
  let width = getWidth(props.windowWidth);

  if (props.submit) {
    sendDecisions(props);
  }

  return (
    <Button
      className={classes.confirmButton}
      style={{marginLeft: margin, width: width}}
      variant={"contained"}
      color={PRIMARY_COLOR}
      disabled={props.disabled}
      onClick={() => handleSubmission(props.disableButton, props.setNoteTime, props.showWaitingDiv)}
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function handleSubmission(disableButton, setNoteTime, showWaitingDiv) {
  disableButton();
  setNoteTime(NOTE_TIME);
  showWaitingDiv()
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

function sendDecisions(props) {
  if (props.loginCode != null) {
    socket.emit(SEND_DECISION_WEBSOCKET, props.experimentID, props.loginCode, props.resources[COMPETE_INDEX], props.resources[KEEP_INDEX], props.resources[INVEST_INDEX], props.timeLeft);
    props.clearSelected();
    props.clearSubmission();
  }
}

export default withStyles(styles)(ConfirmButtonTwo);
