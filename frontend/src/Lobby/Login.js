
import React, {useState} from 'react';
import {Typography, TextField, Box, Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import '../CommonStylings/FullScreenDiv.css'
import LoginButton from './LoginButton'

const WELCOME_MESSAGE = 'Welcome to Rise to the Top!';
const INSTRUCTIONS_MESSAGE = 'Please enter your Prolific code.';
const DEFAULT_LOGIN = '';
const LOGIN_LABEL = 'Login Code';
const FULL_DIV = 'fullDiv';
const HEADER_VARIANT = 'h3';
const INSTRUCTIONS_VARIANT = 'h4';

const TEXT_ID = 'loginText';
const TEXTFIELD_ID = 'loginTextField';

const NO_CODE = false;

const styles = {
    welcomeText: {
        marginTop: '150px',
    },
    welcomeInstruction: {
        marginTop: '10px',
    },
    loginInput: {
        fontSize: 50,
    },
    loginField: {
        width: '400px',
        marginTop: '1%',
    },
    submitButton: {
        marginTop: '210px',
        width: '200px',
        height: '50px',
    },
}

function Login(props) {

    const {classes} = props;
    const [loginCode, setLoginCode] = useState(DEFAULT_LOGIN);
    const [invalidCode, setInvalidCode] = useState(NO_CODE);

    return(
        <div className={FULL_DIV}>
            <Typography className={classes.welcomeText} id={TEXT_ID} variant={HEADER_VARIANT}>{WELCOME_MESSAGE}</Typography>
            <Typography className={classes.welcomeInstruction} variant={INSTRUCTIONS_VARIANT}>
                <Box fontStyle="italic" >{INSTRUCTIONS_MESSAGE}</Box>
            </Typography>
            <TextField
                className = {classes.loginField}
                id = {TEXTFIELD_ID}
                InputProps={{
                    classes: {
                      input: classes.loginInput,
                    },
                  }}
                value={loginCode}
                label={LOGIN_LABEL}
                error={invalidCode}
                onChange={(e) => setLoginCode(e.target.value)}
                >
            </TextField>
            <LoginButton code={loginCode} invalidCode={invalidCode} setInvalidCode={setInvalidCode}/>
        </div>
    )
}

export default withStyles(styles)(Login);