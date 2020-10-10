import React from 'react';

import Wizard from '../Images/wizard.png'
import Alien from '../Images/alien.png'
import Knight from '../Images/knight.png'
import Robot from '../Images/robot.png'
import Astronaut from '../Images/astronaut.png'
import Scientist from '../Images/scientist.png'

const IMAGE_HEIGHT = 100
const IMAGE_WIDTH = 100

function getPlayer(image) {
    return(
        <img
        src={image}
        width={IMAGE_HEIGHT}
        height={IMAGE_WIDTH}
        />
    )
}

const PLAYER_ONE = getPlayer(Wizard)
const PLAYER_TWO = getPlayer(Alien)
const PLAYER_THREE = getPlayer(Knight)
const PLAYER_FOUR = getPlayer(Robot)
const PLAYER_FIVE = getPlayer(Astronaut)
const PLAYER_SIX = getPlayer(Scientist)

const PlayerInfo = {
    1: PLAYER_ONE,
    2: PLAYER_TWO,
    3: PLAYER_THREE,
    4: PLAYER_FOUR,
    5: PLAYER_FIVE,
    6: PLAYER_SIX,
}

export default PlayerInfo;