
import React, {useState} from 'react';
import {Typography, TextField, Box, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import '../util/common_stylings/FullScreenDiv.css'
import LoginButton from './LoginButton'
import '../util/common_components/Loader.js'
import Loader from '../util/common_components/Loader.js';

const WELCOME_MESSAGE = 'Welcome to Rise to the Top!';
const INSTRUCTIONS_MESSAGE = 'Please enter your Prolific ID.';
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
        marginTop: '25vh',
    },
    welcomeInstruction: {
        marginTop: '1vh',
    },
    loginInput: {
        fontSize: 50,
    },
    loginField: {
        width: '400px',
        marginTop: '1vh',
    },
    submitButton: {
        marginTop: '5vh',
        width: '200px',
        height: '50px',
    },
}

function Login(props) {

    const {classes} = props;
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
                value={props.loginCode}
                label={LOGIN_LABEL}
                error={invalidCode}
                onChange={(e) => props.setLoginCode(e.target.value)}
                >
            </TextField>
            <LoginButton code={props.code} invalidCode={invalidCode} setInvalidCode={setInvalidCode} setShowWarnings={props.setShowWarnings}/>
        </div>
    )
}

export default withStyles(styles)(Login);
