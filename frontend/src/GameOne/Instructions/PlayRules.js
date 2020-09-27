import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsScreen from '../../CommonComponents/InstructionsScreen';

function PlayRules(props) {
    const FULL_DIV = 'fullDiv';

    return(
        <div className = {FULL_DIV}>
            <InstructionsScreen 
                file='Instructions/PlayRules.txt' 
                title='How do I play?'/>
            <ContinueButton route='one-play-rules'/>
        </div>
    )
}

export default (PlayRules);

