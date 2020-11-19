import React from "react";
import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Variants } from "../common/common_constants/stylings/StylingsBundler";

const BUTTON_MESSAGE = "Enter Code";
const BUTTON_ID = "loginButton";
const EMPTY_STRING = "";
const INVALID_CODE = true;
const TEST_SUBSTRING_START_INDEX = 0;
const TEST_SUBSTRING_END_INDEX = 5;
const TEST_PREFIX = "test:";

const styles = {
  loginButton: {
    marginTop: "60px",
    width: "200px",
    height: "50px",
  },
};

function LoginButton(props) {
  const { classes } = props;

  return (
    <div>
      <Button
        className={classes.loginButton}
        id={BUTTON_ID}
        variant={Variants.CONTAINED}
        disabled={props.code === EMPTY_STRING}
        color="primary"
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
    axios.get("/login-code", {
      params: {
        loginCode: props.code,
      },
    });
    props.history.push("/prolific");
    return;
  }

  axios
    .get("/login-code", {
      params: {
        loginCode: props.code,
      },
    })
    .then(function (res) {
      let isValid = res.data.isValid;
      if (isValid) props.history.push("/lobby");
      else props.setInvalidCode(INVALID_CODE);
    });
}

export default withStyles(styles)(withRouter(LoginButton));
