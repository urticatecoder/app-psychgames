
import React, { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';


const HEADER_MESSAGE = 'Play Game One';

const styles = ({
    startButton: {
        marginTop: '5%',
        width: '200px',
        height: '50px',
    },
});

function StartButton(props) {

    const {classes} = props;

    return(
        
        <div>
            <Button
                className = {classes.startButton}
                variant="contained" 
                disabled = {!props.startStatus}
                color= {props.startStatus ? "primary" : "secondary"}
                onClick={() => props.history.push("/game-one")}
                >
                {HEADER_MESSAGE}
            </Button>
        </div>
    )
}

export default withStyles(styles)(withRouter(StartButton));