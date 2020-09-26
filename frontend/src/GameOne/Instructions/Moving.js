import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function Moving(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/Moving.txt' 
                title='Moving'/>
            <ContinueButton route='one-bonuses'/>
        </div>
    )
}

export default (Moving);

