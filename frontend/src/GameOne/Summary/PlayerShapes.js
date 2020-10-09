import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';
import React from 'react';

const PATH_TO_AVATARS = "../../../"
const WIZARD = "wizard.png"
const PLAYER_ONE = (
    <img
        src={PATH_TO_AVATARS + WIZARD}
        width={100}
        height={100}
    />
        
    // <Rectangle
    // width={100}
    // height={100}
    // fill={{color:'#2409ba'}}
    // stroke={{color:'#E65243'}}
    // strokeWidth={3}
    // />
);

const PLAYER_TWO = (
    <Circle
    r={50}
    fill={{color:'#2409ba'}}
    stroke={{color:'#E65243'}}
    strokeWidth={3}
    />
)

const PLAYER_THREE = (
    <Triangle
    width={100}
    height={100}
    fill={{color:'#2409ba'}}
    stroke={{color:'#E65243'}}
    strokeWidth={3}
    />
)

const PlayerInfo = {
    1: PLAYER_ONE,
    2: PLAYER_TWO,
    3: PLAYER_THREE,
    4: '',
    5: '',
    6: '',
}

export default PlayerInfo;