
import React, { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';


const BUTTON_MESSAGE = 'Enter Code';
const BUTTON_ID = 'loginButton';
const EMPTY_STRING = '';
const INVALID_CODE = true;

const styles = ({
    loginButton: {
        marginTop: '60px',
        width: '200px',
        height: '50px',
    },
});


function LoginButton(props) {

    const {classes} = props;
    
    return(
        <div>
            <Button
                className = {classes.loginButton}
                id={BUTTON_ID}
                variant="contained"
                disabled = {props.code == EMPTY_STRING}
                color= "primary"
                onClick={() => handleLogin(props)}
                >
                {BUTTON_MESSAGE}
            </Button>
        </div>
    )
}

function handleLogin(props) {
    console.log('called')
    console.log(props.code)
    axios.get('/login-code', {
        params: {
            loginCode: props.code
        }
    }).then(function (res) {
        console.log(res)
        let isValid = res.data.isValid;
        console.log(isValid)
        if (isValid) props.history.push("/lobby");
        else props.setInvalidCode(INVALID_CODE);
    });
    
}

export default withStyles(styles)(withRouter(LoginButton));
