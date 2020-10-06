
import React, { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';


const BUTTON_MESSAGE = 'Enter Code';
const UNACCEPTABLE_CODE = '';
const BUTTON_ID = 'loginButton';

const styles = ({
    loginButton: {
        marginTop: '60px',
        width: '200px',
        height: '50px',
    },
});

function LoginButton(props) {

    const {classes} = props;
    var disableButton = (props.code == UNACCEPTABLE_CODE);

    return(
        <div>
            <Button
                className = {classes.loginButton}
                id={BUTTON_ID}
                variant="contained"
                disabled = {disableButton}
                color= "primary"
                onClick={() => handleLogin(props)}
                >
                {BUTTON_MESSAGE}
            </Button>
        </div>
    )
}

function handleLogin(props) {
    axios.get('/login-code', {
        params: {
            loginCode: 'CS408'
        }
    }).then(function (res) {
        let isValid = res.data.isValid;
        console.log(isValid);
    });
    props.history.push("/lobby");
}

export default withStyles(styles)(withRouter(LoginButton));
