import React from 'react';
import PlayerImages from './PlayerImages';

const SELECTED = '#32a852'
const NOT_SELECTED = '#0093f542'
const DOUBLE_BONUS = '#fca103'
const TRIPLE_BONUS = '#c603fc'

function PlayerButton(props) {

    let background = getBackgroundColor(props.double, props.triple, props.selected);
    
    return(
        <div style={{backgroundColor: background, borderRadius: 30}} onClick={() => props.onSelect()}>
            {PlayerImages[props.player]}
        </div>
    )
}

function getBackgroundColor(isDouble, isTriple, isSelected) {
    if (isDouble) return DOUBLE_BONUS;
    else if (isTriple) return TRIPLE_BONUS;
    else if (isSelected) return SELECTED;
    else return NOT_SELECTED;
}

export default (PlayerButton);

