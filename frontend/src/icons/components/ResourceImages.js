import React from 'react';

import Keep from '../images/resources/keep.png'
import Invest from '../images/resources/invest.png'
import Compete from '../images/resources/compete.png'
import ColorKeep from '../images/resources/colorKeep.png'
import ColorInvest from '../images/resources/colorInvest.png'
import ColorCompete from '../images/resources/colorCompete.png'
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
    colorKeepImage: ColorKeep,
    keepImage: Keep,
    keepID: ResourceNames.KEEP,
    keepLabel: KEEP_LABEL,
    colorInvestImage: ColorInvest,
    investImage: Invest,
    investID: ResourceNames.INVEST,
    investLabel: INVEST_LABEL,
    colorCompeteImage: ColorCompete,
    competeImage: Compete,
    competeID: ResourceNames.COMPETE,
    competeLabel: COMPETE_LABEL,
}

export default ResourceImages;