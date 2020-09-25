
import React, { useState, useEffect } from 'react';
import {Typography} from '@material-ui/core';
import StartTimer from './StartTimer';
import StartButton from './StartButton';
import '../CommonStylings/FullScreenDiv.css'

function Lobby(props) {
    const DEFAULT_START_STATUS = false;
    const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <Typography className='instructions' align='center' variant="h1">Lobby</Typography>
            <StartTimer className='startTimer' setStartStatus={setStartStatus}/>
            <StartButton className='startButton' startStatus = {startStatus}/>
        </div>
    )
}

export default (Lobby);