import React from 'react';

import Keep from '../images/resources/keep.png'
import Invest from '../images/resources/invest.png'
import Compete from '../images/resources/compete.png'
import { ResourceNames } from '../../util/common_constants/game_two/GameTwoBundler';

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

const ResourceImages = {
    keepImage: Keep,
    keepID: ResourceNames.KEEP,
    keepLabel: KEEP_LABEL,
    investImage: Invest,
    investID: ResourceNames.INVEST,
    investLabel: INVEST_LABEL,
    competeImage: Compete,
    competeID: ResourceNames.COMPETE,
    competeLabel: COMPETE_LABEL,
}

export default ResourceImages;