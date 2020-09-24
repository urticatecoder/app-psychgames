
import React, { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';

function StartButton(props) {

    return(
        <div>
            <Button
            variant="contained" 
            disabled = {!props.startStatus}
            color= {props.startStatus ? "primary" : "secondary"}
            onClick={() => props.history.push("/game-one")}
            >
            Play Game One
            </Button>
        </div>
    )
}

export default StartButton;