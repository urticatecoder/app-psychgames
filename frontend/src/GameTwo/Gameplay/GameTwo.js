import React, {useEffect, useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ResourceBar from './ResourceBar';
import VerticalPlayerGroup from './VerticalPlayerGroup';
import ResourceButton from './ResourceButton';
import Alert from '@material-ui/lab/Alert';
import {Snackbar, Typography, withStyles} from '@material-ui/core'
import GameTimer from '../../CommonComponents/GameTimer';
import ConfirmButton2 from './ConfirmButton2'
import socket from "../../socketClient";
import { withRouter } from "react-router-dom";
import TokenCounter from '../Tokens/TokenCounter';
import PayoutOdds from './PayoutOdds';
import '../Results/DelayedBar';
import DelayedBar from '../Results/DelayedBar';
import GroupBox from '../../GameOne/Gameplay/GroupBox';

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
const NOT_ENOUGH_TOKENS_MESSAGE = "You do not have any tokens to invest.";

const NEGATIVE_TOKENS = true;
const NOT_NEGATIVE_TOKENS = false;
const NEGATIVE_TOKENS_MESSAGE = "You cannot remove tokens before adding them.";

const OPEN_MESSAGE = true;
const ERROR_MESSAGE_LENGTH = 2000;
const CLOSED_MESSAGE = false;
const ERROR_VERTICALITY = "top";
const ERROR_HORIZONTAL = "left";
const ALERT_LEVEL = "error";

const NO_TOKENS_SPENT = 0;
const DO_NOT_SUBMIT_DECISIONS = false;
const RESET_TIMER = true;
const DO_NOT_RESET_TIMER = false;

const INITIAL_COMPETE_PAYOFF = 1;
const INITIAL_INVEST_PAYOFF = 1;

const DO_NOT_SHOW_RESULTS = false;
const SHOW_RESULTS = true;

const TIME_TO_SHOW_RESULTS = 7000;

const RESULTS_DELAY_KEEP = 1000;
const RESULTS_DELAY_INVEST = 2000;
const RESULTS_DELAY_COMPETE = 3000;
const RESULTS_DELAY_GROUP_TWO = 3000;

const INITIAL_TOKENS = 10;

const styles = ({
    groupOne: {
      position: 'absolute',
      top: '85vh',
      left: '5vw',
    },
    groupTwo: {
        position: 'absolute',
      top: '85vh',
      left: '55vw',
    },
    resultsText: {
        marginTop: '5vh'
    }
  });


//FIXME: Make each screen a separate component
function GameTwo(props) {
    
    const FULL_DIV = 'fullDiv';
    const totalTokens = INITIAL_TOKENS
    const [fromResources, setFromResources] = useState(INITIAL_RESOURCE_DISTRIBUTION)
    const [toResources, setToResources] = useState(fromResources)
    const [currentResources, setCurrentResources] = useState(INITIAL_RESOURCE_DISTRIBUTION)

    const [notEnoughTokens, setNotEnoughTokens] = useState(ENOUGH_TOKENS)
    const [negativeTokens, setNegativeTokens] = useState(NOT_NEGATIVE_TOKENS)
    const [tokensSpent, setTokensSpent] = useState(NO_TOKENS_SPENT)
    const [resetTimer, setResetTimer] = useState(DO_NOT_RESET_TIMER)
    const [submitDecisions, setSubmitDecisions] = useState(DO_NOT_SUBMIT_DECISIONS)
    const [payoffCompete, setCompetePayoff] = useState(INITIAL_COMPETE_PAYOFF)
    const [payoffInvest, setInvestPayoff] = useState(INITIAL_INVEST_PAYOFF)
    const [showResults, setShowResults] = useState(DO_NOT_SHOW_RESULTS)
    const [groupOneResults, setGroupOneResults] = useState(INITIAL_RESOURCE_DISTRIBUTION)
    const [groupTwoResults, setGroupTwoResults] = useState(INITIAL_RESOURCE_DISTRIBUTION)

    useEffect(() => {
        socket.on("end current turn for game 2", (competePayoff, investPayoff, winnerResults, loserResults) => {
            setCompetePayoff(competePayoff)
            setInvestPayoff(investPayoff)
            setResetTimer(RESET_TIMER)
            setCurrentResources(INITIAL_RESOURCE_DISTRIBUTION)
            setShowResults(SHOW_RESULTS);
            setGroupOneResults(winnerResults)
            setGroupTwoResults(loserResults)
            setTimeout(() => {
                setShowResults(DO_NOT_SHOW_RESULTS);
            }, TIME_TO_SHOW_RESULTS);
        });

        socket.on("end game 2",() => {
           props.history.push('/prolific')
        });

        return () => {
            socket.off("end current turn for game 2");
            socket.off("end game 2");
        }
    }, [payoffCompete, payoffInvest, resetTimer, currentResources, showResults, groupOneResults, groupTwoResults, props.history]);

    const {classes} = props
    let resourceResultsView = getResourceResults(classes, groupOneResults, groupTwoResults)
    let resourceChoiceView = getResourceChoices(props, setFromResources, setToResources, fromResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, payoffInvest, payoffCompete, resetTimer, setResetTimer, setSubmitDecisions, submitDecisions);
    let resourceView = (showResults) ? resourceResultsView : resourceChoiceView

    return (
        <div className={FULL_DIV}>
            {resourceView}
            {getAlerts(notEnoughTokens, setNotEnoughTokens, negativeTokens, setNegativeTokens)}
        </div>
    )
}

function getResourceResults(classes, groupOneResults, groupTwoResults) {
    return(
        <div>
            <div className={classes.resultsText}>
                <Typography variant='h3'>Results from Previous Turn:</Typography>
            </div>
            <DelayedBar resource={KEEP} group={1} delay={RESULTS_DELAY_KEEP} tokens={groupOneResults[KEEP_INDEX]}/>
            <DelayedBar resource={INVEST} group={1} delay={RESULTS_DELAY_INVEST} tokens={groupOneResults[INVEST_INDEX]}/>
            <DelayedBar resource={COMPETE} group={1} delay={RESULTS_DELAY_COMPETE} tokens={groupOneResults[COMPETE_INDEX]}/>
            <DelayedBar resource={KEEP} group={2} delay={RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_KEEP} tokens={groupTwoResults[KEEP_INDEX]}/>
            <DelayedBar resource={INVEST} group={2} delay={RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_INVEST} tokens={groupTwoResults[INVEST_INDEX]}/>
            <DelayedBar resource={COMPETE} group={2} delay={RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_COMPETE} tokens={groupTwoResults[COMPETE_INDEX]}/>
            <div className={classes.groupOne}>
                <GroupBox groupNumber='One' width={'40vw'}/>
            </div>
            <div className={classes.groupTwo}>
                <GroupBox groupNumber='Two' width={'40vw'}/>
            </div>
        </div>
    )
}
 
function getResourceChoices(props, setFromResources, setToResources, fromResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, payoffInvest, payoffCompete, resetTimer, setResetTimer, setSubmitDecisions, submitDecisions) {
    return(
        <div>
            <TokenCounter tokens={totalTokens - tokensSpent}/>
            <PayoutOdds investOdds={payoffInvest} competeOdds={payoffCompete}/> 
            <GameTimer setSubmitDecisions={setSubmitDecisions} resetTimer={resetTimer} setResetTimer={setResetTimer}/>
            <ConfirmButton2 submit={submitDecisions} clearSubmission = {() => setSubmitDecisions(DO_NOT_SUBMIT_DECISIONS)} resources={currentResources} clearSelected={() => clearResources(setFromResources, setToResources, toResources, setTokensSpent, totalTokens)} loginCode={props.loginCode}/>
            <VerticalPlayerGroup type={GROUP_ONE} allLoginCodes={props.allLoginCodes} players={props.losers}/>
            <VerticalPlayerGroup type={GROUP_TWO} allLoginCodes={props.allLoginCodes} players={props.winners}/>
            {getResourceButton(KEEP, KEEP_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)}
            {getResourceButton(INVEST, INVEST_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)}
            {getResourceButton(COMPETE, COMPETE_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)}
            {getResourceBar(KEEP, KEEP_INDEX, fromResources, toResources)} 
            {getResourceBar(INVEST, INVEST_INDEX, fromResources, toResources)}
            {getResourceBar(COMPETE, COMPETE_INDEX, fromResources, toResources)}
        </div>
    )
}

function clearResources(setFromResources, setToResources, toResources, setTokensSpent, totalTokens) {
    setFromResources(toResources)
    setToResources(INITIAL_RESOURCE_DISTRIBUTION)
    setTokensSpent(NO_TOKENS_SPENT)
}


function scaleHeight(resourceTokens, totalTokens) {
    let resourceProportion = resourceTokens / totalTokens;
    return resourceProportion * VERTICAL_SCALAR;
}

function getResourceButton(resource, resourceIndex, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources) {
    return <ResourceButton resource={resource} 
            addToken={() => updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, INCREASING, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)} 
            removeToken={() => updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, DECREASING, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)}/>
}

function getResourceBar(resource, resourceIndex, fromResources, toResources) {
    return <ResourceBar resource={resource} from={fromResources[resourceIndex]} to={toResources[resourceIndex]}/>
}

function updateResource(resourceIndex, setFromResources, setToResources, originalResources, totalTokens, isIncreasing, setNotEnoughTokens, setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources) {

     let addTokenOffset;

     if (isIncreasing) {
         if (tokensSpent >= totalTokens) {
             setNotEnoughTokens(NOT_ENOUGH_TOKENS);
             return;
         }
         addTokenOffset = 1;
     } else {
        if (originalResources[resourceIndex] === 0) {
            setNegativeTokens(NEGATIVE_TOKENS);
            return;
        }
        addTokenOffset = -1;
     }

     let fromResources = originalResources.slice(0);
     let toResources = fromResources.slice(0);
     toResources[resourceIndex] += addTokenOffset * scaleHeight(RESOURCE_INCREMENTER, totalTokens);

     let newCurrentResources = currentResources.slice(0);
     newCurrentResources[resourceIndex] += addTokenOffset

     setCurrentResources(newCurrentResources)
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

export default withRouter(withStyles(styles)(GameTwo));