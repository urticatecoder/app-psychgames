import React from 'react';

import Wizard from '../Images/wizard.png'
import Alien from '../Images/alien.png'
import Knight from '../Images/knight.png'
import Robot from '../Images/robot.png'
import Astronaut from '../Images/astronaut.png'
import Scientist from '../Images/scientist.png'

const IMAGE_HEIGHT = '100'
const IMAGE_WIDTH = '100'

const WIZARD_ID = 'wizard';
const KNIGHT_ID = 'knight';
const SCIENTIST_ID = 'scientist';
const ROBOT_ID = 'robot';
const ASTRONAUT_ID = 'astronaut';
const ALIEN_ID = 'alien';

const WIZARD_LABEL = 'Wizard';
const KNIGHT_LABEL = 'Knight';
const SCIENTIST_LABEL = 'Scientist';
const ROBOT_LABEL = 'Robot';
const ASTRONAUT_LABEL = 'Astronaut';
const ALIEN_LABEL = 'Alien';

function getPlayer(image, id) {
    return(
        <img
        src={image}
        id={id}
        width={IMAGE_HEIGHT}
        height={IMAGE_WIDTH}
        />
    )
}

const PLAYER_ONE = getPlayer(Wizard, WIZARD_ID)
const PLAYER_TWO = getPlayer(Alien, ALIEN_ID)
const PLAYER_THREE = getPlayer(Knight, KNIGHT_ID)
const PLAYER_FOUR = getPlayer(Robot, ROBOT_ID)
const PLAYER_FIVE = getPlayer(Astronaut, ASTRONAUT_ID)
const PLAYER_ZERO = getPlayer(Scientist, SCIENTIST_ID)

const PlayerInfo = {
    0: PLAYER_ZERO,
    name0: SCIENTIST_ID,
    label0: SCIENTIST_LABEL,
    1: PLAYER_ONE,
    name1: WIZARD_ID,
    label1: WIZARD_LABEL,
    2: PLAYER_TWO,
    name2: ALIEN_ID,
    label2: ALIEN_LABEL,
    3: PLAYER_THREE,
    name3: KNIGHT_ID,
    label3: KNIGHT_LABEL,
    4: PLAYER_FOUR,
    name4: ROBOT_ID,
    label4: ROBOT_LABEL,
    5: PLAYER_FIVE,
    name5: ASTRONAUT_ID,
    label5: ASTRONAUT_LABEL,
}

export default PlayerInfo;