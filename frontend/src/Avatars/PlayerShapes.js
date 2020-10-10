import {Rectangle, Circle, Ellipse, Line, Polyline, CornerBox, Triangle} from 'react-shapes';
import React from 'react';

import Wizard from './Images/wizard.png'
import Alien from './Images/alien.png'
import Knight from './Images/knight.png'
import Robot from './Images/robot.png'
import Astronaut from './Images/astronaut.png'
import Scientist from './Images/scientist.png'


const PLAYER_ONE = (
    <img
        src={Wizard}
        width={100}
        height={100}
    />
);

const PLAYER_TWO = (
    <img
    src={Alien}
    width={100}
    height={100}
/>
)

const PLAYER_THREE = (
    <img
    src={Knight}
    width={100}
    height={100}
/>
)

const PLAYER_FOUR = (
    <img
    src={Robot}
    width={100}
    height={100}
/>
)

const PLAYER_FIVE = (
    <img
    src={Astronaut}
    width={100}
    height={100}
/>
)

const PLAYER_SIX = (
    <img
    src={Scientist}
    width={100}
    height={100}
/>
)

const PlayerInfo = {
    1: PLAYER_ONE,
    2: PLAYER_TWO,
    3: PLAYER_THREE,
    4: PLAYER_FOUR,
    5: PLAYER_FIVE,
    6: PLAYER_SIX,
}

export default PlayerInfo;