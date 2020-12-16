import React, { useState } from "react";
import { Typography, TextField, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import LoginButton from "./LoginButton";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const WELCOME_MESSAGE = "Welcome to Rise to the Top!";
const INSTRUCTIONS_MESSAGE = "Please enter your Prolific code.";
const LOGIN_LABEL = "Login Code";
const FULL_DIV = "fullDiv";

const TEXT_ID = "loginText";
const TEXTFIELD_ID = "loginTextField";
const NO_CODE = false;
const ITALIC_FONT = "italic";

const styles = {
  welcomeText: {
    marginTop: "150px",
  },
  welcomeInstruction: {
    marginTop: "10px",
  },
  loginInput: {
    fontSize: 50,
  },
  loginField: {
    width: "400px",
    marginTop: "1%",
  },
  submitButton: {
    marginTop: "210px",
    width: "200px",
    height: "50px",
  },
};

/**
 * Component used to visualize the entire login screen. The connection to the backend is given in LoginButton.
 * @param {*} props tells the component the user's login code and provides a method to reset it.
 * 
 * @author Eric Doppelt
 */
function Login(props) {
  const { classes } = props;
  const [invalidCode, setInvalidCode] = useState(NO_CODE);

  return (
    <div className={FULL_DIV}>
      <Typography
        className={classes.welcomeText}
        id={TEXT_ID}
        variant={Variants.NORMAL_TEXT}
      >
        {WELCOME_MESSAGE}
      </Typography>
      <Typography
        className={classes.welcomeInstruction}
        variant={Variants.SMALL_TEXT}
      >
        <Box fontStyle={ITALIC_FONT}>{INSTRUCTIONS_MESSAGE}</Box>
      </Typography>
      <TextField
        className={classes.loginField}
        id={TEXTFIELD_ID}
        InputProps={{
          classes: {
            input: classes.loginInput,
          },
        }}
        label={LOGIN_LABEL}
        error={invalidCode}
        onChange={(e) => props.setLoginCode(e.target.value)}
      />
      <LoginButton
        code={props.code}
        invalidCode={invalidCode}
        setLoginCode={props.setLoginCode}
        setInvalidCode={setInvalidCode}
      />
    </div>
  );
}

export default withStyles(styles)(Login);
