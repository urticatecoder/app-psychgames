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
    sendDecisions(props.resources, props.clearSelected, props.loginCode);
    props.clearSubmission();
  }

  return (
    <Button
      className={classes.confirmButton}
      variant={Variants.CONTAINED}
      color={PRIMARY_COLOR}
      onClick={() =>
        sendDecisions(props.resources, props.clearSelected, props.loginCode)
      }
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function sendDecisions(resources, clearSelected, loginCode) {
  socket.emit(SEND_DECISION_WEBSOCKET, loginCode, resources[COMPETE_INDEX], resources[KEEP_INDEX], resources[INVEST_INDEX]);
  clearSelected();
}

export default withStyles(styles)(ConfirmButtonTwo);
