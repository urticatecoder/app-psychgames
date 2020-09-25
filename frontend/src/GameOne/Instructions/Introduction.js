import React from 'react';
import {Typography} from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function Introduction(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <Typography>{"Game One"}</Typography>
            <InstructionsScreen 
                file='Instructions/Introduction.txt' 
                title='Game One'/>
            <ContinueButton route='one-introduction'/>
        </div>
    )
}

export default (Introduction);