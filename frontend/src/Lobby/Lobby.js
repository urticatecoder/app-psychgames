
import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";
import StartTimer from './StartTimer';
import StartButton from './StartButton';
import '../CommonStylings/FullScreenDiv.css'

function Lobby(props) {
    const DEFAULT_START_STATUS = false;
    const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);
    const FULL_DIV = 'fullDiv';

    useEffect(() => {
        const socket = socketIOClient();
        socket.on("connect", () => {
            console.log('Connected to server through sockets.');
        });
    }, []);

    return(
        <div className = {FULL_DIV}>
            <StartTimer className='startTimer' setStartStatus={setStartStatus}/>
            <StartButton className='startButton' startStatus = {startStatus}/>
        </div>
    )
}

export default (Lobby);
