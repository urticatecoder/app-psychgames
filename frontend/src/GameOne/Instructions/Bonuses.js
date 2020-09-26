import React from 'react';
import {Typography} from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function Introduction(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/Bonuses.txt' 
                title='Cooperation Bonuses'/>
            <ContinueButton route='one-play-rules'/>
        </div>
    )
}

export default (Introduction);