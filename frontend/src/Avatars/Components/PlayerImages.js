import React from 'react';

import Flame from '../Images/Shapes/flame.png'
import Arrow from '../Images/Shapes/arrow.png'
import Cross from '../Images/Shapes/cross.png'
import Headset from '../Images/Shapes/headset.png'
import Leaves from '../Images/Shapes/leaves.png'
import Triangle from '../Images/Shapes/triangle.png'

const IMAGE_HEIGHT = '85vh'
const IMAGE_WIDTH = '85vw'

const FLAME_ID = 'flame';
const ARROW_ID = 'arrow';
const CROSS_ID = 'cross';
const HEADSET_ID = 'headset';
const LEAVES_ID = 'leaves';
const TRIANGLE_ID = 'triangle';

const FLAME_LABEL = 'Wizard';
const ARROW_LABEL = 'Arrow';
const CROSS_LABEL = 'Cross';
const HEADSET_LABEL = 'Headset';
const LEAVEL_LABEL = 'Label';
const TRIANGLE_LABEL = 'Triangle';

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
const PLAYER_ZERO = getPlayer(Flame, CROSS_ID)
const PLAYER_ONE = getPlayer(Triangle, FLAME_ID)
const PLAYER_TWO = getPlayer(Cross, TRIANGLE_ID)
const PLAYER_THREE = getPlayer(Arrow, ARROW_ID)
const PLAYER_FOUR = getPlayer(Headset, HEADSET_ID)
const PLAYER_FIVE = getPlayer(Leaves, LEAVES_ID)

const PlayerInfo = {
    0: PLAYER_ZERO,
    name0: CROSS_ID,
    label0: CROSS_LABEL,
    1: PLAYER_ONE,
    name1: FLAME_ID,
    label1: FLAME_LABEL,
    2: PLAYER_TWO,
    name2: TRIANGLE_ID,
    label2: TRIANGLE_LABEL,
    3: PLAYER_THREE,
    name3: ARROW_ID,
    label3: ARROW_LABEL,
    4: PLAYER_FOUR,
    name4: HEADSET_ID,
    label4: HEADSET_LABEL,
    5: PLAYER_FIVE,
    name5: LEAVES_ID,
    label5: LEAVEL_LABEL,
}

export default PlayerInfo;