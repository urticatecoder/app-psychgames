
import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Button from '@mui/material/Button';
import HTTP_Routes from '../util/constants/httpRoutes';

import socket from "../socketClient";

const INVALID_CODE = true;

const styles = {
    loginButton: {
        marginTop: '60px',
        width: '200px',
        height: '50px',
    },
}

/**
 * Login button that sends the user's ID to the backend.
 * Moves to the lobby if the code is successful.
 *
 * @author Eric Doppelt
 */
function LoginButton(props) {
    return(
        <div>
            <Button
                variant="contained"
                disabled = {props.code == ''}
                color= "primary"
                onClick={() => handleLogin(props)}
                sx={{...styles.loginButton}}
                >
                Enter Code
            </Button>
        </div>
    )
}

function handleLogin(props) {
    const startGameRequest = {
        "prolificId": props.code
    };
    socket.emit("start-game", startGameRequest);
    // axios.get(HTTP_Routes.LOGIN_CODE, {
    //     params: {
    //         loginCode: props.code
    //     }
    // }).then(function (res) {
    //     let isValid = res.data.isValid;
    //     if (isValid) {
    //         props.history.push("/lobby");
    //     }
    //     else props.setInvalidCode(INVALID_CODE);
    // });  
}

export default withRouter(LoginButton);
