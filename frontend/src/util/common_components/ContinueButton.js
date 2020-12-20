import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Variants } from "../common_constants/stylings/StylingsBundler";

const BUTTON_COLOR = "primary";
const BUTTON_OPACITY = .85
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
      variant={Variants.CONTAINED}
      color={BUTTON_COLOR}
      onClick={() => props.history.push(props.route)}
      disabled={props.disabled}
      style={{height: props.height, width: props.width, opacity: BUTTON_OPACITY}}
    >
      {props.message}
    </Button>
  );
}

export default (withRouter(ContinueButton));
