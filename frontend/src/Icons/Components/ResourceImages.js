import React from 'react';

import Keep from '../Images/Resources/Keep.png'
import Invest from '../Images/Resources/Invest.png'
import Compete from '../Images/Resources/Compete.png'

const IMAGE_HEIGHT = '70vh'
const IMAGE_WIDTH = '70vw'

const KEEP_ID = 'keep';
const INVEST_ID = 'invest';
const COMPETE_ID = 'compete';

const KEEP_LABEL = 'Keep';
const INVEST_LABEL = 'Invest';
const COMPETE_LABEL = 'Compete';

function getResource(image, id) {
    return(
        <img
        src={image}
        id={id}
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
    keepID: KEEP_ID,
    keepLabel: KEEP_LABEL,
    invest: INVEST,
    investID: INVEST_ID,
    investLabel: INVEST_LABEL,
    compete: COMPETE,
    competeID: COMPETE_ID,
    competeLabel: COMPETE_LABEL,
    
}

export default ResourceInfo;