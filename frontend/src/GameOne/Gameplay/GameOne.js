import '../../CommonStylings/FullScreenDiv.css'
import ColumnController from './ColumnController'
import React from 'react';

const FULL_DIV = 'fullDiv';

function GameOne(props) {
    return (
        <div className={FULL_DIV}>
            <ColumnController/>
        </div>
    )
}

export default (GameOne);