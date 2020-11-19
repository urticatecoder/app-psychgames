import React from 'react';

import Keep from '../images/Resources/keep.png'
import Invest from '../images/Resources/invest.png'
import Compete from '../images/Resources/compete.png'
import { ResourceNames } from '../../util/common_constants/game_two/GameTwoBundler';

const IMAGE_HEIGHT = '70vh'
const IMAGE_WIDTH = '70vw'

const KEEP_ID = 'keep';
const INVEST_ID = 'invest';
const COMPETE_ID = 'compete';

const KEEP_LABEL = 'Keep';
const INVEST_LABEL = 'Invest';
const COMPETE_LABEL = 'Compete';

/**
 * Constant that encodes all the information needed to visualize resource options in Game Two (compete, keep, invest).
 * Includes labels and images for each option.
 * Each resource option is indexed by its name.
 * 
 * @author Eric Doppelt
 */

function getResource(image, id) {
    return(
        <img
        src={image}
        id={id}
        alt={id}
        width={IMAGE_HEIGHT}
        height={IMAGE_WIDTH}
        />
    )
}

const KEEP = getResource(Keep, KEEP_ID)
const INVEST = getResource(Invest, INVEST_ID)
const COMPETE = getResource(Compete, COMPETE_ID)

const ResourceInfo = {
    keep: KEEP,
    keepID: ResourceNames.KEEP,
    keepLabel: KEEP_LABEL,
    invest: INVEST,
    investID: ResourceNames.INVEST,
    investLabel: INVEST_LABEL,
    compete: COMPETE,
    competeID: ResourceNames.COMPETE,
    competeLabel: COMPETE_LABEL,
}

export default ResourceInfo;