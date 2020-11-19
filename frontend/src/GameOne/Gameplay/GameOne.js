import '../../CommonStylings/FullScreenDiv.css'
import ColumnController from './ColumnController'
import React from 'react';

const FULL_DIV = 'fullDiv';

function GameOne(props) {
    console.log(props.setWinners)
    console.log(props.setLosers)
    return (
        <div className={FULL_DIV}>
            <ColumnController setWinners={props.setWinners} setLosers={props.setLosers} loginCode = {props.loginCode} allLoginCodes={props.allLoginCodes}/>
        </div>
    )
}

export default (GameOne);