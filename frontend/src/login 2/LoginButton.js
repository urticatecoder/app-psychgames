import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const BUTTON_MESSAGE = "Enter Code";
const BUTTON_ID = "loginButton";
const EMPTY_STRING = "";
const INVALID_CODE = true;
const TEST_SUBSTRING_START_INDEX = 0;
const TEST_SUBSTRING_END_INDEX = 5;
const TEST_PREFIX = "test:";

const PRIMARY_COLOR = "primary";

const LOGIN_CODE_ROUTE = "/login-code";
const PROLIFIC_ROUTE = "/prolific";
const LOBBY_ROUTE = "/lobby";

const styles = {
  loginButton: {
    marginTop: "60px",
    width: "200px",
    height: "50px",
  },
};

/**
 * Component used to allow users to login to the site using the code given to them by Prolific.
 * Communicates with the backend by sending the login code and moving to the lobby if it is approved, or marking it as invalid if it is rejected.
 * Contains a  "back door" to the prolific page for testing, where entering a code beginning with "test:" will go straight to the closing screen of the site.
 * @param {} props tells the button what the login code is and gives a method to set the code as invalid, if need be.
 * 
 * @author Eric Doppelt
 */
function LoginButton(props) {
  const { classes } = props;

  return (
    <div>
      <Button
        className={classes.loginButton}
        id={BUTTON_ID}
        variant={Variants.CONTAINED}
        disabled={props.code === EMPTY_STRING}
        color={PRIMARY_COLOR}
        value={props.loginCode}
        onClick={() => handleLogin(props)}
      >
        {BUTTON_MESSAGE}
      </Button>
    </div>
  );
}

function handleLogin(props) {
  let testPrefix = props.code.substring(
    TEST_SUBSTRING_START_INDEX,
    TEST_SUBSTRING_END_INDEX
  );
  let loginCodePostfix = props.code.substring(TEST_SUBSTRING_END_INDEX);
  if (testPrefix === TEST_PREFIX) {
    props.setLoginCode(loginCodePostfix);
    axios.get(LOGIN_CODE_ROUTE, {
      params: {
        loginCode: props.code,
      },
    });
    props.history.push(PROLIFIC_ROUTE);
    return;
  }

  axios
    .get(LOGIN_CODE_ROUTE, {
      params: {
        loginCode: props.code,
      },
    })
    .then(function (res) {
      let isValid = res.data.isValid;
      if (isValid) props.history.push(LOBBY_ROUTE);
      else props.setInvalidCode(INVALID_CODE);
    });
}

export default withStyles(styles)(withRouter(LoginButton));
