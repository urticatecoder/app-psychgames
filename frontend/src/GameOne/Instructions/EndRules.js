import React from 'react';
import {Typography} from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function EndRules(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/EndRules.txt' 
                title='When does the Game End?'/>
            <ContinueButton route='one-moving'/>
        </div>
    )
}

export default (EndRules);