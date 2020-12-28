
import React, { useState, useEffect } from 'react';
import {Button, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../socketClient";

const MESSAGE = 'Are you still there?';
const SUBMESSAGE= 'Please indicate whether you plan to keep participating in the games. Note that you will not be compensated unless you complete the experiment.'
const BUTTON_VARIANT = 'contained';
const YES = 'Yes';
const YES_COLOR = 'primary';
const NO = 'No';
const NO_COLOR = 'secondary';
const CHECK_PASSIVITY_WEBSOCKET = "check passivity";
const ACTIVE_PLAYER_WEBSOCKET = "active player";
const INACTIVE_PLAYER_WEBSOCKET = "inactive player";

const OPEN_DIALOGUE = true;
const CLOSE_DIALOGUE = false;

const RESPONDED = true;
const DIDNT_RESPOND = false;
const TIME_TO_RESPOND = 15000;

const styles = ({
    loginButton: {
        marginTop: '60px',
        width: '200px',
        height: '50px',
    },
});


function PassiveAlert(props) {

    
    const [open, setOpen] = useState(OPEN_DIALOGUE);
    const [responded, setResponded] = useState(RESPONDED);

    useEffect(() => {
        socket.on(CHECK_PASSIVITY_WEBSOCKET, () => {
            setOpen(OPEN_DIALOGUE);
            setResponded(DIDNT_RESPOND);

            setTimeout(() => {
                if (!responded) {
                    emitSocket(INACTIVE_PLAYER_WEBSOCKET, props.loginCode, setOpen);
                }
              }, TIME_TO_RESPOND);
        });
    }, [setOpen]);

    return(
        <Dialog
            open={open}
        >
            <DialogTitle>{MESSAGE}</DialogTitle>
            <DialogContent>
                <DialogContentText>{SUBMESSAGE}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => emitSocket(INACTIVE_PLAYER_WEBSOCKET, props.loginCode, setOpen, setResponded)} variant={BUTTON_VARIANT} color={NO_COLOR}>
                    {NO}
                </Button>
                <Button onClick={() => emitSocket(ACTIVE_PLAYER_WEBSOCKET, props.loginCode, setOpen, setResponded)} variant={BUTTON_VARIANT} color={YES_COLOR}>
                    {YES}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function emitSocket(webSocket, loginCode, setOpen, setResponded) {
    console.log(webSocket);
    socket.emit(webSocket, loginCode);
    setOpen(CLOSE_DIALOGUE);
    setResponded(RESPONDED);
}

export default withStyles(styles)((PassiveAlert));
