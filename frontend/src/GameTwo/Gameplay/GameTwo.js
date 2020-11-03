import React, {useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import VerticalPlayerGroup from './VerticalPlayerGroup';

const GROUP_ONE = 1
const GROUP_TWO = 2
function GameTwo(props) {
    
    const FULL_DIV = 'fullDiv';

    return (
        <div className={FULL_DIV}>
            <VerticalPlayerGroup type={GROUP_ONE} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[1, 2, 3]}/>
            <VerticalPlayerGroup type={GROUP_TWO} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[4, 5, 6]}/>
        </div>
    )
}

export default (GameTwo);