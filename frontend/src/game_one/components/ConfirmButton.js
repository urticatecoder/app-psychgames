import React from "react";
import { Button, withStyles } from "@material-ui/core";
import socket from "../../socketClient";
import { Variants } from "../../util/common_constants/stylings/StylingsBundler";

const CONFIRM_CHOICES_TEXT = "Confirm Decision!";
const NUM_PLAYERS = 6;
const PRIMARY_COLOR = "primary";
const SEND_DECISIONS_WEBSOCKET = "confirm choice for game 1";

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
 * Component that allows the submission of choices in Game One.
 * Handles the web socket call and sends choices passed in as props from Game One.
 * @param {*} props tell the choices to send in the web socket call.
 * 
 * @author Eric Doppelt
 */

function ConfirmButton(props) {
  const { classes } = props;
  
  if (props.submit) {
    sendDecisions(props);
  }

  return (
    <Button
      className={classes.confirmButton}
      variant={Variants.CONTAINED}
      color={PRIMARY_COLOR}
      disabled = {props.disabled}
      onClick={() =>
        props.setNoteTime(NOTE_TIME)
      }
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function sendDecisions(props) {
  console.log('SENDING DECISIONS');
  console.log(props.timeLeft);
  socket.emit(SEND_DECISIONS_WEBSOCKET, props.loginCode, getSelectedIDs(props.selected, props.allLoginCodes, props.timeLeft));
  props.clearSelected();
  props.clearSubmission();
}

function getSelectedIDs(selected, allIDs) {
  let selectedIDs = [];
  for (let i = 0; i < NUM_PLAYERS; i++) {
    if (selected[i]) selectedIDs.push(allIDs[i]);
  }
  return selectedIDs;
}

export default withStyles(styles)(ConfirmButton);
