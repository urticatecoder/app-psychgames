import React from 'react';
import {Button, withStyles} from '@material-ui/core'
import socket from "../../socketClient";

const CONFIRM_CHOICES_TEXT = "Confirm Decision!"
const NUM_PLAYERS = 6

const styles = ({
    confirmButton: {
      marginTop: '5vh',
      height: 75,
      width: '60vw',
      fontSize: '17px'
    },
  });

function ConfirmButton(props) {

    const {classes} = props

    if (props.submit) {
        sendDecisions(props.selected, props.clearSelected, props.loginCode, props.allLoginCodes)
        props.clearSubmission()
    }
    
    return(
        <Button
            className={classes.confirmButton}
            variant='contained'
            color='primary'
            onClick={() => sendDecisions(props.selected, props.clearSelected, props.loginCode, props.allLoginCodes)}
            >
            {CONFIRM_CHOICES_TEXT}
        </Button>
    )
}

function sendDecisions(selected, clearSelected, loginCode, allLoginCodes) {
    console.log(loginCode)
    console.log(getSelectedIDs(selected, allLoginCodes))
    socket.emit('confirm choice for game 1', loginCode, getSelectedIDs(selected, allLoginCodes))
    clearSelected()
}

// MAKE THIS PUBLIC -- EXISTS IN COLUMN CONTROLLER
function getSelectedIDs(selected, allIDs) {
    let selectedIDs = []
    for (let i = 0; i < NUM_PLAYERS; i++) {
        if (selected[i]) selectedIDs.push(allIDs[i])
    }
    return selectedIDs;
}

export default withStyles(styles)(ConfirmButton);