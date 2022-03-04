import React from "react";
import { Button, withStyles } from "@material-ui/core";
import socket from "../../socketClient";

const CONFIRM_CHOICES_TEXT = "Confirm!";
const NUM_PLAYERS = 6;
const SEND_DECISIONS_WEBSOCKET = "confirm choice for game 1";

const PRIMARY_COLOR = "primary";
const DISABLED = true;
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
    backgroundColor: '#002984'
  },
};

/**
 * Component that allows the submission of choices in Game One.
 * Handles the web socket call and sends choices passed in as props from Game One.
 * @param {*} props tell the choices to send in the web socket call.
 * 
 * @author Eric Doppelt
 */

function ConfirmButton(props) {
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
      disabled = {props.disabled}
      onClick={() => handleSubmission(props.disableButton, props.showWaitingDiv, props.setNoteTime)}
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function handleSubmission(disableButton, showWaitingDiv, setNoteTime) {
  disableButton();
  showWaitingDiv();
  setNoteTime(NOTE_TIME);
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
    socket.emit(SEND_DECISIONS_WEBSOCKET, props.experimentID, props.loginCode, getSelectedIDs(props.selected, props.allLoginCodes), props.timeLeft);
    props.clearSelected();
    props.clearSubmission();
  }
}

function getSelectedIDs(selected, allIDs) {
  let selectedIDs = [];
  for (let i = 0; i < NUM_PLAYERS; i++) {
    if (selected[i]) selectedIDs.push(allIDs[i]);
  }
  return selectedIDs;
}

export default withStyles(styles)(ConfirmButton);
