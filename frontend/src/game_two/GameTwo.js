import React, { useEffect, useState } from "react";
import "../util/common_stylings/FullScreenDiv.css";
import ResourceBar from "./components/ResourceBar";
import VerticalPlayerGroup from "./components/VerticalPlayerGroup";
import ResourceButton from "./components/ResourceButton";
import { Typography, withStyles } from "@material-ui/core";
import GameTimer from "../util/common_components/GameTimer";
import ConfirmButtonTwo from "./components/ConfirmButtonTwo";
import socket from "../socketClient";
import { withRouter } from "react-router-dom";
import TokenCounter from "./tokens/TokenCounter";
import PayoutOdds from "./components/PayoutOdds";
import "./results/DelayedBar";
import DelayedBar from "./results/DelayedBar";
import GroupBox from "../game_one/components/GroupBox";
import { ResourceNames } from "../util/common_constants/game_two/GameTwoBundler";
import { Variants } from '../util/common_constants/stylings/StylingsBundler';
import getAlerts from './components/getAlerts';

const GROUP_ONE = 1;
const GROUP_TWO = 2;

const GROUP_ONE_TEXT = "One";
const GROUP_TWO_TEXT = "Two";

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

const NEGATIVE_TOKENS = true;
const NOT_NEGATIVE_TOKENS = false;

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
const FULL_DIV = "fullDiv";

const END_TURN_WEBSOCKET = "end current turn for game 2";
const END_GAME_WEBSOCKET = "end game 2";

const COMPENSATION_ROUTE = "/compensation";

const END_TURN_TEXT = "Results from Previous Turn:";
const GROUP_BOX_WIDTH = "40vw";

const DISABLE_BUTTON = true;
const DO_NOT_DISABLE_BUTTON = false;

const INITIAL_TIME_LEFT = -1;
const DONT_NOTE_TIME = false;

const styles = {
  groupOne: {
    position: "absolute",
    top: "85vh",
    left: "5vw",
  },
  groupTwo: {
    position: "absolute",
    top: "85vh",
    left: "55vw",
  },
  resultsText: {
    marginTop: "5vh",
  },
};

/**
 * All-encompassing class used to run the second game of the psych experiment.
 * Leverages components in the subpackage game_two.components to create a game following the rules outlined in the GameTwoTutorial.png file.
 * @param {*} props is used to prove the login code of the player and all login codes for all players.
 * 
 * @author Eric Doppelt
 */
function GameTwo(props) {

  const totalTokens = INITIAL_TOKENS;
  const [fromResources, setFromResources] = useState(INITIAL_RESOURCE_DISTRIBUTION);
  const [toResources, setToResources] = useState(fromResources);
  const [currentResources, setCurrentResources] = useState(INITIAL_RESOURCE_DISTRIBUTION);

  const [notEnoughTokens, setNotEnoughTokens] = useState(ENOUGH_TOKENS);
  const [negativeTokens, setNegativeTokens] = useState(NOT_NEGATIVE_TOKENS);
  const [tokensSpent, setTokensSpent] = useState(NO_TOKENS_SPENT);
  const [resetTimer, setResetTimer] = useState(DO_NOT_RESET_TIMER);
  const [submitDecisions, setSubmitDecisions] = useState(DO_NOT_SUBMIT_DECISIONS);
  const [payoffCompete, setCompetePayoff] = useState(INITIAL_COMPETE_PAYOFF);
  const [payoffInvest, setInvestPayoff] = useState(INITIAL_INVEST_PAYOFF);
  const [showResults, setShowResults] = useState(DO_NOT_SHOW_RESULTS);
  const [groupOneResults, setGroupOneResults] = useState(INITIAL_RESOURCE_DISTRIBUTION);
  const [groupTwoResults, setGroupTwoResults] = useState(INITIAL_RESOURCE_DISTRIBUTION);

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);
  const [noteTime, setNoteTime] = useState(DONT_NOTE_TIME);
  
  const [disableButton, setDisableButton] = useState(DO_NOT_DISABLE_BUTTON);


  useEffect(() => {
    
    socket.on(END_TURN_WEBSOCKET, (competePayoff, investPayoff, winnerResults, loserResults) => {
      let convertedWinnerResults = convertBackendData(winnerResults);
      let convertedLoserResults = convertBackendData(loserResults);
      setCompetePayoff(competePayoff);
      setInvestPayoff(investPayoff);
      setResetTimer(RESET_TIMER);
      setCurrentResources(INITIAL_RESOURCE_DISTRIBUTION);
      setShowResults(SHOW_RESULTS);
      setGroupOneResults(convertedWinnerResults);
      setGroupTwoResults(convertedLoserResults);
      setTimeout(() => {
        setDisableButton(DO_NOT_DISABLE_BUTTON);
        setShowResults(DO_NOT_SHOW_RESULTS);
      }, TIME_TO_SHOW_RESULTS);
    });

    socket.on(END_GAME_WEBSOCKET, () => {
      setTimeout(() => {
        props.history.push(COMPENSATION_ROUTE);
      }, TIME_TO_SHOW_RESULTS);
    });

    return () => {
      socket.off(END_TURN_WEBSOCKET);
      socket.off(END_GAME_WEBSOCKET);
    };
  }, [payoffCompete, payoffInvest, resetTimer, currentResources, showResults, groupOneResults, groupTwoResults, props.history]);

  const { classes } = props;

  let resourceResultsView = getResourceResults(classes, groupOneResults, groupTwoResults, props.windowWidth);
  
  let resourceChoiceView = getResourceChoices(
    props,
    setFromResources,
    setToResources,
    fromResources,
    toResources,
    totalTokens,
    setNotEnoughTokens,
    setNegativeTokens,
    tokensSpent,
    setTokensSpent,
    setCurrentResources,
    currentResources,
    payoffInvest,
    payoffCompete,
    resetTimer,
    setResetTimer,
    setSubmitDecisions,
    submitDecisions,
    noteTime,
    setNoteTime,
    timeLeft,
    setTimeLeft,
    disableButton, 
    setDisableButton
  );

  let resourceView = showResults ? resourceResultsView : resourceChoiceView;

  return (
    <div className={FULL_DIV}>
      {resourceView}
      {getAlerts(notEnoughTokens, setNotEnoughTokens, negativeTokens, setNegativeTokens)}
    </div>
  );
}

function getResourceResults(classes, groupOneResults, groupTwoResults, windowWidth) {
  return (
    <div>
      <div className={classes.resultsText}>
        <Typography variant={Variants.NORMAL_TEXT}>
          {END_TURN_TEXT}
        </Typography>
      </div>
      {getDelayedBar(ResourceNames.KEEP, GROUP_ONE, RESULTS_DELAY_KEEP, groupOneResults[KEEP_INDEX], windowWidth)}
      {getDelayedBar(ResourceNames.INVEST, GROUP_ONE, RESULTS_DELAY_INVEST, groupOneResults[INVEST_INDEX], windowWidth)}
      {getDelayedBar(ResourceNames.COMPETE, GROUP_ONE, RESULTS_DELAY_COMPETE, groupOneResults[COMPETE_INDEX], windowWidth)}

      {getDelayedBar(ResourceNames.KEEP, GROUP_TWO, RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_KEEP, groupTwoResults[KEEP_INDEX], windowWidth)}
      {getDelayedBar(ResourceNames.INVEST, GROUP_TWO, RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_INVEST, groupTwoResults[INVEST_INDEX], windowWidth)}
      {getDelayedBar(ResourceNames.COMPETE, GROUP_TWO, RESULTS_DELAY_GROUP_TWO + RESULTS_DELAY_COMPETE, groupTwoResults[COMPETE_INDEX], windowWidth)}

      <div className={classes.groupOne}>
        <GroupBox groupNumber={GROUP_ONE_TEXT} width={GROUP_BOX_WIDTH} />
      </div>
      <div className={classes.groupTwo}>
        <GroupBox groupNumber={GROUP_TWO_TEXT} width={GROUP_BOX_WIDTH} />
      </div>
    </div>
  );
}

function getDelayedBar(resource, group, delay, tokens, windowWidth) {
  return(
    <DelayedBar
        resource={resource}
        group={group}
        delay={delay}
        tokens={tokens}
        windowWidth={windowWidth}
      />
  )
}

function getResourceChoices(props, setFromResources, setToResources, fromResources, toResources, totalTokens, setNotEnoughTokens, setNegativeTokens, 
  tokensSpent, setTokensSpent, setCurrentResources, currentResources, payoffInvest, payoffCompete, resetTimer, setResetTimer, setSubmitDecisions, submitDecisions,
  noteTime, setNoteTime, timeLeft, setTimeLeft, disableButton, setDisableButton) {
  return (
    <div>
      <TokenCounter tokens={totalTokens - tokensSpent} windowHeight={props.windowHeight} windowWidth={props.windowWidth}/>
      <PayoutOdds investOdds={payoffInvest} competeOdds={payoffCompete} windowHeight={props.windowHeight} windowWidth={props.windowWidth}/>
      <GameTimer
        setSubmitDecisions={setSubmitDecisions}
        resetTimer={resetTimer}
        setResetTimer={setResetTimer}
        noteTime={noteTime}
        setNoteTime={setNoteTime}
        setTimeLeft={setTimeLeft}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
      />
      <ConfirmButtonTwo
        submit={submitDecisions}
        clearSubmission={() => setSubmitDecisions(DO_NOT_SUBMIT_DECISIONS)}
        resources={currentResources}
        clearSelected={() =>clearResources(setFromResources, setToResources, toResources, setTokensSpent)}
        loginCode={props.loginCode}
        disabled={disableButton}
        disableButton={() => setDisableButton(DISABLE_BUTTON)}
        timeLeft = {timeLeft}
        setNoteTime = {setNoteTime}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
      />
      <VerticalPlayerGroup
        type={GROUP_ONE}
        allLoginCodes={props.allLoginCodes}
        players={props.winners}
        selectedIndex={props.selectedIndex}
        windowHeight={props.windowHeight}
        windowWidth={props.windowWidth}
      />
      <VerticalPlayerGroup
        type={GROUP_TWO}
        allLoginCodes={props.allLoginCodes}
        players={props.losers}
        selectedIndex={props.selectedIndex}
        windowHeight={props.windowHeight}
        windowWidth={props.windowWidth}
      />
      {getResourceButton(ResourceNames.KEEP, KEEP_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens,
        setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, props.windowWidth)}
      {getResourceButton(ResourceNames.INVEST, INVEST_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens,
        setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, props.windowWidth)}
      {getResourceButton(ResourceNames.COMPETE, COMPETE_INDEX, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens,
        setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, props.windowWidth)}

      {getResourceBar(ResourceNames.KEEP, KEEP_INDEX, fromResources, toResources)}
      {getResourceBar(ResourceNames.INVEST, INVEST_INDEX, fromResources, toResources)}
      {getResourceBar(ResourceNames.COMPETE, COMPETE_INDEX, fromResources, toResources)}
    </div>
  );
}

function clearResources(setFromResources, setToResources, toResources, setTokensSpent) {
  setFromResources(toResources);
  setToResources(INITIAL_RESOURCE_DISTRIBUTION);
  setTokensSpent(NO_TOKENS_SPENT);
}

function scaleHeight(resourceTokens, totalTokens) {
  let resourceProportion = resourceTokens / totalTokens;
  return resourceProportion * VERTICAL_SCALAR;
}

function getResourceButton(resource, resourceIndex, setFromResources, setToResources, toResources, totalTokens, setNotEnoughTokens,
  setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources, windowWidth) {
  return (
    <ResourceButton
      resource={resource}
      addToken={() =>
        updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, INCREASING, setNotEnoughTokens,
          setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)
      }
      removeToken={() =>
        updateResource(resourceIndex, setFromResources, setToResources, toResources, totalTokens, DECREASING, setNotEnoughTokens,
          setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources)
      }
      windowWidth={windowWidth}
    />
  );
}

function getResourceBar(resource, resourceIndex, fromResources, toResources) {
  return (
    <ResourceBar
      resource={resource}
      from={fromResources[resourceIndex]}
      to={toResources[resourceIndex]}
    />
  );
}

function updateResource(resourceIndex, setFromResources, setToResources, originalResources, totalTokens, isIncreasing, setNotEnoughTokens,
  setNegativeTokens, tokensSpent, setTokensSpent, setCurrentResources, currentResources) {
  let addTokenOffset;
  
  if (isIncreasing) {
    if (tokensSpent >= totalTokens) {
      setNotEnoughTokens(NOT_ENOUGH_TOKENS);
      return;
    }
    addTokenOffset = 1;
  } else {
    if (currentResources[resourceIndex] === 0) {
      setNegativeTokens(NEGATIVE_TOKENS);
      return;
    }
    addTokenOffset = -1;
  }

  let fromResources = originalResources.slice(0);
  let toResources = fromResources.slice(0);
  toResources[resourceIndex] +=
    addTokenOffset * scaleHeight(RESOURCE_INCREMENTER, totalTokens);

  let newCurrentResources = currentResources.slice(0);
  newCurrentResources[resourceIndex] += addTokenOffset;

  setCurrentResources(newCurrentResources);
  setTokensSpent(addTokenOffset + tokensSpent);
  setFromResources(fromResources);
  setToResources(toResources);
}

function convertBackendData(array) {
  return array.reverse();
}

export default withRouter(withStyles(styles)(GameTwo));
