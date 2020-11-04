import React, {useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ResourceBar from './ResourceBar';
import VerticalPlayerGroup from './VerticalPlayerGroup';
import ResourceButton from './ResourceButton';
import StartTimer from '../../Lobby/StartTimer';
import Alert from '@material-ui/lab/Alert';
import {Snackbar} from '@material-ui/core'

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
const INCREASING = true;
const DECREASING = false;

const ENOUGH_TOKENS = false;
const NOT_ENOUGH_TOKENS = true;
const NOT_ENOUGH_TOKENS_MESSAGE = "You do not have any tokens to invest."

const NEGATIVE_TOKENS = true;
const NOT_NEGATIVE_TOKENS = false;
const NEGATIVE_TOKENS_MESSAGE = "You cannot remove tokens before adding them."

const OPEN_MESSAGE = true
const ERROR_MESSAGE_LENGTH = 2000
const CLOSED_MESSAGE = false
const ERROR_VERTICALITY = "top"
const ERROR_HORIZONTAL = "left"
const ALERT_LEVEL = "error"

const NUMBER_RESOURCES = 3
const NO_TOKENS_SPENT = 0;
function GameTwo(props) {

    const FULL_DIV = 'fullDiv';
    const [totalTokens, setTotalTokens] = useState(10)
    const [fromResources, setFromResources] = useState(scaleHeights(INITIAL_RESOURCE_DISTRIBUTION, totalTokens))
    const [toResources, setToResources] = useState(fromResources)
    const [notEnoughTokens, setNotEnoughTokens] = useState(ENOUGH_TOKENS)
    const [negativeTokens, setNegativeTokens] = useState(NOT_NEGATIVE_TOKENS)
    const [tokensSpent, setTokensSpent] = useState(NO_TOKENS_SPENT)

    return (
        <div className={FULL_DIV}>
            <VerticalPlayerGroup type={GROUP_ONE} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[1, 2, 3]}/>
            <VerticalPlayerGroup type={GROUP_TWO} allLoginCodes={[1, 2, 3, 4, 5, 6]} players={[4, 5, 6]}/>
            {getResourceButton(KEEP, KEEP_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent)}
            {getResourceButton(INVEST, INVEST_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent)}
            {getResourceButton(COMPETE, COMPETE_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent)}
            {getResourceBar(KEEP, KEEP_INDEX, fromResources, toResources)} 
            {getResourceBar(INVEST, INVEST_INDEX, fromResources, toResources)}
            {getResourceBar(COMPETE, COMPETE_INDEX, fromResources, toResources)}
            {getAlerts(notEnoughTokens, setNotEnoughTokens, negativeTokens, setNegativeTokens)}
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

function getResourceButton(resource, resourceIndex, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent) {
    return <ResourceButton resource={resource} 
            addToken={() => updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, INCREASING, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent)} 
            removeToken={() => updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, DECREASING, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent)}/>
}

function getResourceBar(resource, resourceIndex, fromResources, toResources) {
    return <ResourceBar resource={resource} from={fromResources[resourceIndex]} to={toResources[resourceIndex]}/>
}

function updateResource(resourceIndex, setFromResources, setToResources, originalResources, totalTokens, isIncreasing, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent) {

     let addTokenOffset;

     if (isIncreasing) {
         if (tokensSpent == totalTokens) {
             setNotEnoughTokens(NOT_ENOUGH_TOKENS);
             return;
         }
         addTokenOffset = 1;
     } else {
        if (originalResources[resourceIndex] == 0) {
            setNegativeTokens(NEGATIVE_TOKENS);
            return;
        }
        addTokenOffset = -1;
     }

     let fromResources = originalResources.slice(0);
     let toResources = fromResources.slice(0);
     toResources[resourceIndex] += addTokenOffset * scaleHeight(RESOURCE_INCREMENTER, totalTokens);
     setTokensSpent(addTokenOffset + tokensSpent)
     setFromResources(fromResources);
     setToResources(toResources);
}

function getAlerts(notEnoughTokens, setNotEnoughTokens, negativeTokens, setNegativeTokens) {
    if (notEnoughTokens) {
        return getAlertComponent(NOT_ENOUGH_TOKENS_MESSAGE, setNotEnoughTokens)
    }
    else if (negativeTokens) {
        return getAlertComponent(NEGATIVE_TOKENS_MESSAGE, setNegativeTokens)
    }
}

function getAlertComponent(text, setClosed) {
    return (
        <Snackbar open={OPEN_MESSAGE} autoHideDuration={ERROR_MESSAGE_LENGTH} onClose={() => setClosed(CLOSED_MESSAGE)} anchorOrigin={{vertical: ERROR_VERTICALITY, horizontal: ERROR_HORIZONTAL}}>
            <Alert severity={ALERT_LEVEL}>
                {text}
            </Alert>
        </Snackbar>
    )
}

export default (GameTwo);