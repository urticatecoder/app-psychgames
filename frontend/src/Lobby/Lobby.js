
import React, { useState, useEffect } from 'react';
import {Typography} from '@material-ui/core';
import Timer from './Timer';
import StartButton from './StartButton';

function Lobby(props) {
    const DEFAULT_START_STATUS = false;
    const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);

    return(
        <div>
            <Typography align='center' variant="h1">Lobby</Typography>
            <Timer setStartStatus={setStartStatus}/>
            <Typography align='center' variant="h1">{startStatus}</Typography> 
            <StartButton startStatus = {startStatus}/>
        </div>
    )
}

export default Lobby;