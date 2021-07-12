import React, { useEffect, useState } from "react";
import "../util/common_stylings/FullScreenDiv.css";
import PlayerColumn from "./components/PlayerColumn";
import { Grid, withStyles } from "@material-ui/core";
import socket from "../socketClient";
import ConfirmButton from "./components/ConfirmButton";
import { withRouter } from "react-router-dom";
import GroupBox from "./components/GroupBox";
import GameTimer from "../util/common_components/GameTimer";
import getAlerts from './components/getAlerts';
import BonusShower from './components/BonusShower';
import WaitingDiv from "../util/common_components/WaitingDiv";

const FULL_DIV = "fullDiv";
const GAME_TWO_INTRO_ROUTE = "/game-two-intro";
const MAX_HEIGHT = 100;
const BOTTOM_OF_SCREEN = 100;
const INITIAL_HEIGHT = 50;
const NUM_PLAYERS = 6;
const VERTICAL_CONSTANT = 1;
const VERTICAL_SCALAR = 0.58;
const NEGATIVE_ONE = -1;
const MAX_PLAYERS_SELECTED = 2;
const PLAYERS = [0, 1, 2, 3, 4, 5];
const NOT_SELECTED = false;
const NOT_SELECTED_INT = 0;
const SELECTED_INT = 1;
const DONT_SUBMIT_DECISIONS = false;
const SELECTED_SELF = true;
const DID_NOT_SELECT_SELF = false;
const TOO_MANY_SELECTIONS = true;
const NOT_TOO_MANY_SELECTS = false;

const RESET_TIMER = true;
const DO_NOT_RESET_TIMER = false;
const PAUSE_TIMER = true;
const DO_NOT_PAUSE_TIMER = false;

const FIRST_CODE = 0;
const SECOND_CODE = 1;
const THIRD_CODE = 2;
const PAUSE_BETWEEN_ANIMATIONS = 2000;
const IN_BONUS = true;
const NORMAL_ANIMATION_OFFSET = 1;

const GROUP_ONE = "One";
const GROUP_TWO = "Two";
const GRID_DIRECTION = "row";
const GRID_JUSTIFICATION = "center";
const GROUP_BOX_WIDTH = "60vw";
const ANIMATED_COLUMNS_HEIGHT = "80vh";

const END_TURN_WEBSOCKET = "location for game 1";
const END_GAME_WEBSOCKET = "end game 1";

const DISABLE_BUTTON = true;
const DO_NOT_DISABLE_BUTTON = false;

const DISABLE_PLAYERS = createPlayerArray(true);
const ENABLE_PLAYERS = createPlayerArray(false);

const INITIAL_TIME_LEFT = -1;
const DONT_NOTE_TIME = false;

const LARGE_SPACING_WIDTH = 1350;
const LARGE_SPACING = 10;

const MEDIUM_SPACING_WIDTH = 1275;
const MEDIUM_SPACING = 9;

const SMALL_SPACING_WIDTH = 1150;
const SMALL_SPACING = 7;

const SMALLER_SPACING_WIDTH = 950;
const SMALLER_SPACING = 6;

const SMALLEST_SPACING = 5;

const SINGLE_BONUS = 'single';
const DOUBLE_BONUS = 'double';
const TRIPLE_BONUS = 'triple';

const OPEN = true;
const CLOSED = false;

const SHOW_DIV = true
const HIDE_DIV = false

const styles = {
  animatedColumns: {
    position: "absolute",
    top: "8vh",
    left: "19vw",
    height: "90vh",
    width: "85vw",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  groupTwoBox: {
    position: "absolute",
    top: "77vh",
    left: '13vw'
  }
};

/**
 * All-encompassing class used to run the first game of the psych experiment.
 * Leverages components in the subpackage game_one.components to create a game following the rules outlined in the GameOneTutorial.png file.
 * @param {*} props is used to prove the login code of the player and all login codes for all players.
 * 
 * @author Eric Doppelt
 */
function GameOne(props) {
  const [startHeights, setStartHeights] = useState(createPlayerArray(BOTTOM_OF_SCREEN));
  let initialHeights = createPlayerArray(scaleHeight(INITIAL_HEIGHT));
  const [endHeights, setEndHeights] = useState(initialHeights);
  const [currentHeight, setCurrentHeight] = useState(initialHeights);

  let initialSelections = createPlayerArray(NOT_SELECTED);
  const [selected, setSelected] = useState(initialSelections);
  const [doubles, setDoubles] = useState(initialSelections);
  const [triples, setTriples] = useState(initialSelections);

  const [disabledPlayers, setDisabledPlayers] = useState(createPlayerArray())
  const [selectedSelf, setSelectedSelf] = useState(DID_NOT_SELECT_SELF);
  const [tooManySelects, setTooManySelects] = useState(NOT_TOO_MANY_SELECTS);

  const [resetTimer, setResetTimer] = useState(DO_NOT_RESET_TIMER);
  const [pauseTimer, setPauseTimer] =  useState()
  const [submitDecisions, setSubmitDecisions] = useState(DONT_SUBMIT_DECISIONS);
  const [disableButton, setDisableButton] = useState(DO_NOT_DISABLE_BUTTON);
  const [showWaitingDiv, setShowWaitingDiv] = useState(HIDE_DIV);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);
  const [noteTime, setNoteTime] = useState(DONT_NOTE_TIME);

  const [bonusType, setBonusType] = useState(DOUBLE_BONUS);
  const [openBonusShower, setOpenBonusShower] = useState(CLOSED);


  useEffect(() => {
    socket.on(END_TURN_WEBSOCKET, (heights, tripleBonuses, tripleIncrease, doubleBonuses, doubleIncrease) => {
      reIndexHeights(heights, props.backendIndex, props.frontendIndex);
      setShowWaitingDiv(HIDE_DIV)
      let posAfterTriple = handleTripleBonuses(
          tripleBonuses,
          tripleIncrease,
          props.allLoginCodes,
          setStartHeights,
          setEndHeights,
          currentHeight,
          setTriples,
          setBonusType,
          setOpenBonusShower
        );
      
        let tripleBonusPause = tripleBonuses.length * PAUSE_BETWEEN_ANIMATIONS;
        clearBonusArray(setTriples, tripleBonusPause);

        let posAfterDouble = handleDoubleBonuses(
          doubleBonuses,
          doubleIncrease,
          props.allLoginCodes,
          setStartHeights,
          setEndHeights,
          posAfterTriple,
          setDoubles,
          tripleBonuses.length,
          setBonusType, 
          setOpenBonusShower
        );

        let allBonusPause = (tripleBonuses.length + doubleBonuses.length) * PAUSE_BETWEEN_ANIMATIONS;
        clearBonusArray(setDoubles, allBonusPause);
        setTimeout(() => setOpenBonusShower(CLOSED), allBonusPause);
        
        let scaledNewHeights = scaleHeights(heights)
        updateHeightsDelayed(
          posAfterDouble,
          scaledNewHeights,
          setStartHeights,
          setEndHeights,
          allBonusPause,
          SINGLE_BONUS,
          setBonusType,
          setOpenBonusShower,
          CLOSED);
        
        let allMovementPause = allBonusPause + PAUSE_BETWEEN_ANIMATIONS;

        handleDisablePlayers(allMovementPause, setDisabledPlayers);
        handleGameTimer(allMovementPause, setResetTimer, setPauseTimer);
        pauseSubmitButton(allMovementPause, setDisableButton);
        setCurrentHeight(scaledNewHeights);
      }
    );

    socket.on(END_GAME_WEBSOCKET, (winners, losers, doubleBonuses, tripleBonuses) => {
      props.setWinners(winners);
      props.setLosers(losers);
      let finalPause = (doubleBonuses + tripleBonuses + NORMAL_ANIMATION_OFFSET) * PAUSE_BETWEEN_ANIMATIONS
      setTimeout(
        () => moveToSummary(props), finalPause);
    });

    return () => {
      socket.off(END_TURN_WEBSOCKET);
      socket.off(END_GAME_WEBSOCKET);
    };
  }, [currentHeight, props]);

  const { classes } = props;

  return (
    <div className={FULL_DIV}>
      {getAlerts(
        selectedSelf,
        setSelectedSelf,
        tooManySelects,
        setTooManySelects
      )}
      
      <WaitingDiv show={showWaitingDiv} windowWidth={props.windowWidth}/>
      <BonusShower bonus={bonusType} open={openBonusShower} windowWidth={props.windowWidth}/>
      <GameTimer
        setSubmitDecisions={setSubmitDecisions}
        resetTimer={resetTimer}
        setResetTimer={setResetTimer}
        pauseTimer={pauseTimer}
        noteTime={noteTime}
        setNoteTime={setNoteTime}
        setTimeLeft={setTimeLeft}
        windowWidth={props.windowWidth}
      />

      <ConfirmButton
        submit={submitDecisions}
        clearSubmission={() => setSubmitDecisions(DONT_SUBMIT_DECISIONS)}
        selected={selected}
        clearSelected={() => clearSelected(setSelected)}
        loginCode={props.loginCode}
        allLoginCodes={props.allLoginCodes}
        disabled={disableButton}
        disableButton={() => setDisableButton(DISABLE_BUTTON)}
        timeLeft = {timeLeft}
        setNoteTime = {setNoteTime}
        windowWidth={props.windowWidth}
        experimentID = {props.experimentID}
        showWaitingDiv = {() => setShowWaitingDiv(SHOW_DIV)}
      />

      <div className={classes.animatedColumns}>
        <GroupBox groupNumber={GROUP_ONE} width={GROUP_BOX_WIDTH} />
        <Grid
          container
          direction={GRID_DIRECTION}
          justify={GRID_JUSTIFICATION}
          spacing={getSpacing(props.windowWidth)}
          style={{ height: {ANIMATED_COLUMNS_HEIGHT} }}
        >
          {PLAYERS.map((player) => {
            return getColumn(
              player,
              selected,
              setSelected,
              setSelectedSelf,
              setTooManySelects,
              startHeights,
              endHeights,
              props.allLoginCodes,
              props.loginCode,
              doubles,
              triples,
              disabledPlayers,
              props.selectedIndex,
              props.windowWidth,
              props.frontendIndex
            );
          })}
        </Grid>
        <div className={classes.groupTwoBox}>
          <GroupBox groupNumber={GROUP_TWO} width={GROUP_BOX_WIDTH} />
        </div>
      </div>
    </div>
  );
}

function handleDisablePlayers(animationPause, setDisabledPlayers) {
  setDisabledPlayers(DISABLE_PLAYERS);
  setTimeout(() => {
    setDisabledPlayers(ENABLE_PLAYERS);
  }, animationPause);
}

function getSpacing(windowWidth) {
  if (windowWidth >= LARGE_SPACING_WIDTH) return LARGE_SPACING;
  else if (windowWidth >= MEDIUM_SPACING_WIDTH) return MEDIUM_SPACING;
  else if (windowWidth >= SMALL_SPACING_WIDTH) return SMALL_SPACING;
  else if (windowWidth >= SMALLER_SPACING_WIDTH) return SMALLER_SPACING;
  return SMALLEST_SPACING;
}

function handleGameTimer(animationPause, setResetTimer, setPauseTimer) {
  setResetTimer(RESET_TIMER);
  setPauseTimer(PAUSE_TIMER);
  setTimeout(() => {
    setPauseTimer(DO_NOT_PAUSE_TIMER);
  }, animationPause);
}

function pauseSubmitButton(animationPause, setDisableButton) {
  setDisableButton(DISABLE_BUTTON);
  setTimeout(() => {
    setDisableButton(DO_NOT_DISABLE_BUTTON);
  }, animationPause);
}

function getColumn(playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, playerIDs, myID, doubles, triples, disabledPlayers, selectedIndex, windowWidth, frontendIndex) {
  return (
    <Grid item>
      <PlayerColumn
        onSelect={() =>
          selectPlayer(
            playerNumber,
            selected,
            setSelected,
            setSelectedSelf,
            setTooManySelections,
            playerIDs,
            myID,
            frontendIndex
          )
        }
        selected={selected[playerNumber]}
        double={doubles[playerNumber]}
        triple={triples[playerNumber]}
        from={fromHeights[playerNumber]}
        to={toHeights[playerNumber]}
        player={playerNumber}
        disabled={disabledPlayers[playerNumber]}
        selectedIndex={selectedIndex}
        windowWidth={windowWidth}
        frontendIndex={frontendIndex}
      />
    </Grid>
  );
}

function handleTripleBonuses(tripleArray, tripleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setTriples, setBonusType, setOpenBonusShower) {
  let oldHeights = originalHeights.slice(0);
  let newHeights = originalHeights.slice(0);
  for (let i = 0; i < tripleArray.length; i++) {
    let loginCodes = tripleArray[i];
    newHeights = oldHeights.slice(0);
    let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
    let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
    let thirdIndex = getPlayerIndex(loginCodes[THIRD_CODE], allLoginCodes);
    let scaledBonus = scaleBonus(tripleIncrease);
    newHeights[firstIndex] += scaledBonus;
    newHeights[secondIndex] += scaledBonus;
    newHeights[thirdIndex] += scaledBonus;
    updateHeightsDelayed(oldHeights, newHeights, setOldHeights, setNewHeights, i * PAUSE_BETWEEN_ANIMATIONS, TRIPLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
    markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, i * PAUSE_BETWEEN_ANIMATIONS);
    oldHeights = newHeights;
  }
  if (newHeights == null) return originalHeights.splice(0);
  else return newHeights;
}

function markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, delay) {
  updateBonusArray([firstIndex, secondIndex, thirdIndex], setTriples, delay);
}

function handleDoubleBonuses(doubleArray, doubleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setDoubles, animationOffset, setBonusType, setOpenBonusShower) {
  let oldHeights = originalHeights.slice(0);
  let newHeights;
  for (let i = 0; i < doubleArray.length; i++) {
    let loginCodes = doubleArray[i];
    newHeights = oldHeights.slice(0);
    let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
    let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
    let scaledBonus = scaleBonus(doubleIncrease);
    newHeights[firstIndex] += scaledBonus;
    newHeights[secondIndex] += scaledBonus;
    updateHeightsDelayed(oldHeights,newHeights, setOldHeights, setNewHeights, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS, DOUBLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
    markDoubleDelayed(firstIndex, secondIndex, setDoubles, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
    oldHeights = newHeights;
  }
  if (newHeights == null) return originalHeights.splice(0);
  else return newHeights;
}

function markDoubleDelayed(firstIndex, secondIndex, setDoubles, delay) {
  updateBonusArray([firstIndex, secondIndex], setDoubles, delay);
}

function updateHeightsDelayed(oldHeights, newHeights, setOldHeights, setNewHeights, delay, bonusType, setBonusType, setOpenBonusShower, openBonus) {
  setTimeout(() => {
    updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights);
    setBonusType(bonusType);
    setOpenBonusShower(openBonus);
  }, delay);
}

function updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights) {
  setOldHeights(oldHeights);
  setNewHeights(newHeights);
  console.log(setNewHeights);
}

// We want to take the backend heights and move the main player's height to his frontend index.
function reIndexHeights(heights, backendIndex, frontendIndex) {
  let myHeight = heights[backendIndex];
  heights.splice(backendIndex, 1);
  heights.splice(frontendIndex, 0, myHeight)
}

function clearBonusArray(setBonus, delay) {
  setTimeout(() => setBonus(createPlayerArray(NOT_SELECTED)), delay);
}

function updateBonusArray(indexArray, setBonus, delay) {
  let bonusArray = createPlayerArray(NOT_SELECTED);
  indexArray.forEach((index) => {
    bonusArray[index] = IN_BONUS;
  });
  setTimeout(() => setBonus(bonusArray), delay);
}

function clearSelected(setSelected) {
  setSelected(createPlayerArray(NOT_SELECTED));
}

function scaleBonus(bonus) {
  return NEGATIVE_ONE * VERTICAL_SCALAR * bonus;
}

function scaleHeight(height) {
  let invertedHeight = invertHeight(height);
  return invertedHeight * VERTICAL_SCALAR + VERTICAL_CONSTANT;
}

function scaleHeights(heightArray) {
  return heightArray.map((height) => scaleHeight(height));
}

function createPlayerArray(height) {
  let heights = new Array(NUM_PLAYERS);
  heights.fill(height);
  return heights;
}

function selectPlayer(player, selected, setSelected, setSelectedSelf, setTooManySelections, playerIDs, myID, frontendIndex) {
  if (playerIDs[player] == myID || player == frontendIndex) {
    setSelectedSelf(SELECTED_SELF);
    return;
  }

  let playerIsSelected = NOT_SELECTED_INT;
  if (selected[player]) playerIsSelected = SELECTED_INT;

  if (
    countSelectedPlayers(selected) <
    MAX_PLAYERS_SELECTED + playerIsSelected
  ) {
    let updatedSelection = selected.slice(0);
    updatedSelection[player] = !updatedSelection[player];
    setSelected(updatedSelection);
  } else {
    setTooManySelections(TOO_MANY_SELECTIONS);
  }
}

function countSelectedPlayers(selected) {
  return getSelectedPlayers(selected).length;
}

function getSelectedPlayers(selected) {
  let selectedPlayers = [];
  for (let i = 0; i < NUM_PLAYERS; i++) {
    if (selected[i]) selectedPlayers.push(selected[i]);
  }
  return selectedPlayers;
}

function invertHeight(height) {
  return MAX_HEIGHT - height;
}

function getPlayerIndex(loginCode, allLoginCodes) {
  for (let i = 0; i < allLoginCodes.length; i++) {
    if (allLoginCodes[i] === loginCode) return i;
  }
}

function moveToSummary(props) {
  props.history.push(GAME_TWO_INTRO_ROUTE);
}

export default withRouter(withStyles(styles)(GameOne));
