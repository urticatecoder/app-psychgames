import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Variants } from "../common_constants/stylings/StylingsBundler";

const BUTTON_MESSAGE = "Continue";
const BUTTON_COLOR = "primary";

const styles = {
  continueButton: {
    width: "200px",
    height: "50px",
  },
};

/**
 * Styled button used through the UI that takes in a route and a boolean indicating whether the button should be disabled or not.
 * Used for routing purposes mainly.
 *
 * @author Eric Doppelt
 */
function ContinueButton(props) {
  const { classes } = props;

  return (
    <Button
      className={classes.continueButton}
      variant={Variants.CONTAINED}
      color={BUTTON_COLOR}
      onClick={() => props.history.push(props.route)}
      disabled={props.disabled}
    >
      {BUTTON_MESSAGE}
    </Button>
  );
}

export default withStyles(styles)(withRouter(ContinueButton));
