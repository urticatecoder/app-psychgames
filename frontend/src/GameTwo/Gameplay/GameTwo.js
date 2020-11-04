import React, {useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ResourceBar from './ResourceBar';
import VerticalPlayerGroup from './VerticalPlayerGroup';
import ResourceButton from '../../Icons/Components/ResourceButton';
import StartTimer from '../../Lobby/StartTimer';

const GROUP_ONE = 1;
const GROUP_TWO = 2;

const KEEP = 'keep';
const INVEST = 'invest';
const COMPETE = 'compete';

const KEEP_INDEX = 0;
const INVEST_INDEX = 1;
const COMPETE_INDEX = 2;

const INITIAL_RESOURCE_DISTRIBUTION = [0, 0, 0];
const RESOURCE_INCREMENTER = 1;

const VERTICAL_SCALAR = 44.2;

function GameTwo(props) {

    const FULL_DIV = 'fullDiv';
    const [totalTokens, setTotalTokens] = useState([10])
    const [fromResources, setFromResources] = useState(scaleHeights(INITIAL_RESOURCE_DISTRIBUTION, totalTokens))
    const [toResources, setToResources] = useState(scaleHeights([totalTokens, totalTokens, totalTokens], totalTokens))
    return (
        <div className={FULL_DIV}>
            <VerticalPlayerGroup type={GROUP_ONE} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[1, 2, 3]}/>
            <VerticalPlayerGroup type={GROUP_TWO} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[4, 5, 6]}/>
            {getResourceButton(KEEP, () => incrementResource(KEEP_INDEX, setFromResources, setToResources, toResources, totalTokens))}
            {getResourceButton(INVEST, () => incrementResource(INVEST_INDEX, setFromResources, setToResources, toResources, totalTokens))}
            {getResourceButton(COMPETE, () => incrementResource(COMPETE_INDEX, setFromResources, setToResources, toResources, totalTokens))}
            {getResourceBar(KEEP, KEEP_INDEX, fromResources, toResources)} 
            {getResourceBar(INVEST, INVEST_INDEX, fromResources, toResources)}
            {getResourceBar(COMPETE, COMPETE_INDEX, fromResources, toResources)}
        </div>
    )
}

function scaleHeights(resourceArray, totalTokens) {
    return resourceArray.map(resource => scaleHeight(resource, totalTokens));
}

function scaleHeight(resourceTokens, totalTokens) {
    let resourceProportion = resourceTokens / totalTokens;
    return resourceProportion * VERTICAL_SCALAR;
}

function getResourceButton(resource, onSelect) {
    return <ResourceButton resource={resource} onSelect={onSelect}/>
}

function getResourceBar(resource, resourceIndex, fromResources, toResources) {
    return <ResourceBar resource={resource} from={fromResources[resourceIndex]} to={toResources[resourceIndex]}/>
}

function incrementResource(resourceIndex, setFromResources, setToResources, originalResources, totalTokens) {
     let fromResources = originalResources.slice(0);
     let toResources = fromResources.slice(0);
     toResources[resourceIndex] += scaleHeight(RESOURCE_INCREMENTER, totalTokens);
     setFromResources(fromResources);
     setToResources(toResources);
}

export default (GameTwo);