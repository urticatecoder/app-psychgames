import React, {useState} from 'react';
import StartTimer from './StartTimer';
import StartButton from './StartButton';
import '../CommonStylings/FullScreenDiv.css'

function Lobby(props) {
    const DEFAULT_START_STATUS = false;
    const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);
    const FULL_DIV = 'fullDiv';

    return (
        <div className={FULL_DIV}>
            <StartTimer code={props.code} className='startTimer' setStartStatus={setStartStatus} setAllLoginCodes={props.setAllLoginCodes}/>
            <StartButton className='startButton' startStatus={startStatus}/>
        </div>
    )
}

export default (Lobby);
