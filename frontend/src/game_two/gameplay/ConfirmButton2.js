import React from "react";
import { Button, withStyles } from "@material-ui/core";
import socket from "../../socketClient";
import { Variants } from "../../common/common_constants/stylings/StylingsBundler";

const CONFIRM_CHOICES_TEXT = "Confirm Decision!";

const KEEP_INDEX = 0;
const INVEST_INDEX = 1;
const COMPETE_INDEX = 2;

//FIXME: duplicated with game one
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

function ConfirmButton2(props) {
  const { classes } = props;

  if (props.submit) {
    sendDecisions(props.resources, props.clearSelected, props.loginCode);
    props.clearSubmission();
  }

  return (
    <Button
      className={classes.confirmButton}
      variant={Variants.CONTAINED}
      color="primary"
      onClick={() =>
        sendDecisions(props.resources, props.clearSelected, props.loginCode)
      }
    >
      {CONFIRM_CHOICES_TEXT}
    </Button>
  );
}

function sendDecisions(resources, clearSelected, loginCode) {
  socket.emit(
    "confirm choice for game 2",
    loginCode,
    resources[COMPETE_INDEX],
    resources[KEEP_INDEX],
    resources[INVEST_INDEX]
  );
  clearSelected();
}

export default withStyles(styles)(ConfirmButton2);
