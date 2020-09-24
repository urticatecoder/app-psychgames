
import React, { useState, useEffect } from 'react';
import {Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";

function StartButton(props) {

    const HEADER_MESSAGE = 'Play Game One';
    return(
        <div>
            <Button
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

export default withRouter(StartButton);