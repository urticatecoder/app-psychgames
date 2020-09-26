import React from 'react';
import {Typography} from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function Logic(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/Logic.txt' 
                title='What Happens in the Game?'/>
            <ContinueButton route='one-end-rules'/>
        </div>
    )
}

export default (Logic);