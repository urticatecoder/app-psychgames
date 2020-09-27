import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function Welcome(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/Welcome.txt' 
                title='Game One'/>
            <ContinueButton route='one-introduction'/>
        </div>
    )
}

export default (Welcome);