import React from 'react';
import PlayerImages from './PlayerImages';

const SELECTED = '#32a852'
const NOT_SELECTED = '#0093f542'
function PlayerButton(props) {

    let background = props.selected? SELECTED : NOT_SELECTED
    return(
        <div style={{backgroundColor: background, borderRadius: 30}} onClick={() => props.onSelect()}>
            {PlayerImages[props.player]}
        </div>
    )
}

export default (PlayerButton);

