
import React from 'react';
import { withRouter } from "react-router-dom";
import Button from '@mui/material/Button';
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
        "playerMetadata": {
            "prolificId": props.code
        }
    };
    console.log("login button pressed with code: ", props.code);
    socket.emit("start-game", startGameRequest, (response) => {
        console.log("start game response: ", response);
        props.setId(response.id);
        // props.cookies.set("id", response.id, { path: "/" });
    });
}

export default withRouter(LoginButton);
