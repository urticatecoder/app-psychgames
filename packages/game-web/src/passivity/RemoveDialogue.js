
import React, { useState, useEffect } from 'react';
import {Button, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import socket from "../socketClient";
import { withRouter } from 'react-router-dom';

const MESSAGE = 'You have been removed from the game.';
const SUBMESSAGE = ''//'Insert message about what to do.'
const BUTTON_VARIANT = 'contained';
const OK = 'Ok';
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

    
    const [open, setOpen] = useState(CLOSE_DIALOGUE);
    const [responded, setResponded] = useState(RESPONDED);

    // useEffect(() => {
    //     socket.on(CHECK_PASSIVITY_WEBSOCKET, () => {
    //         setOpen(OPEN_DIALOGUE);
    //         setResponded(DIDNT_RESPOND);

    //         setTimeout(() => {
    //             if (!responded) {
    //                 emitSocket(INACTIVE_PLAYER_WEBSOCKET, props.loginCode, setOpen);
    //             }
    //           }, TIME_TO_RESPOND);
    //     });
    // }, [setOpen]);

    return(
        <Dialog
            open={props.removeDialogueOpen}
        >
            <DialogTitle>{MESSAGE}</DialogTitle>
            <DialogContent>
                <DialogContentText>{SUBMESSAGE}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={() => exitGame(INACTIVE_PLAYER_WEBSOCKET, props.experimentID, props.loginCode, setOpen, setResponded, props)} variant={BUTTON_VARIANT} color={NO_COLOR}>
                    {NO}
                </Button> */}
                <Button onClick={() => props.setRemoveDialogueOpen(false)} variant={BUTTON_VARIANT} color={YES_COLOR}>
                    {OK}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function exitGame(webSocket, experimentID, loginCode, setOpen, setResponded, props) {
    emitSocket(webSocket, experimentID, loginCode, setOpen, setResponded);
    props.history.push('/');
}

function emitSocket(webSocket, experimentID, loginCode, setOpen, setResponded) {
    if (loginCode != null) {
        socket.emit(webSocket, experimentID, loginCode);
        setOpen(CLOSE_DIALOGUE);
        setResponded(RESPONDED);
    }
}

export default withRouter(withStyles(styles)(PassiveAlert));
