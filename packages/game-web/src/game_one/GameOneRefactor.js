import React, { useEffect, useState } from "react";
import "../util/stylings/FullScreenDiv.css";
import PlayerColumn from "./components/PlayerColumn";
import { Grid, withStyles } from "@material-ui/core";
import ConfirmButton from "./components/ConfirmButton";
import { withRouter } from "react-router-dom";
import GroupBox from "./components/GroupBox";
import GameTimer from "../util/components/GameTimer";
import getAlerts from './components/getAlerts';
import BonusShower from './components/BonusShower';
import WaitingDiv from "../util/components/WaitingDiv";

import Routes from '../util/constants/routes';

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
const AVATARS = [0, 1, 2, 3, 4, 5];
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
    const [endHeights, setEndHeights] = useState(createPlayerArray(INITIAL_HEIGHT));
    const [currentHeight, setCurrentHeight] = useState(createPlayerArray(INITIAL_HEIGHT));
  
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

    if (!props.currentState) {
        props.history.push(Routes.LOGIN);
        return (<div></div>);
    }

    // const roundLength = props.currentState.roundEndTime - props.currentState.roundStartTime;
    const roundEndTime = Date.parse(props.currentState.roundEndTime);
    // console.log("round end time: ", roundEndTime);
    const time = new Date();
    // console.log("current time: ", time.getTime());
    const roundLength = roundEndTime - time.getTime();
  
    useEffect(() => {
        console.log("game one state: ", props.currentState);

        const ids = [];
        for (var i = 0; i < props.playerData.length; i++) {
            ids.push(props.playerData[i].idObj);
        }

        if (props.currentState.bonusGroups.length == 1) {
            var heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[0].length; i++) {
                const scaledPosition = props.currentState.bonusGroups[0][i].position * 40 + 30;
                heightsFromState.push(scaledPosition);
            }
            console.log("heights from state: ", heightsFromState);
            setEndHeights(heightsFromState);
            setCurrentHeight(heightsFromState);
        } else {
            // go to initial heights
            var heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[0].length; i++) {
                const scaledPosition = props.currentState.bonusGroups[0][i].position * 40 + 30;
                heightsFromState.push(scaledPosition);
            }
            console.log("heights from state: ", heightsFromState);
            setEndHeights(heightsFromState);
            setCurrentHeight(heightsFromState);

            // handle bonuses
            const tripleBonusArray = [];
            const doubleBonusArray = [];
            const singleBonusArray = [];
            const length = props.currentState.bonusGroups.length;
            for (var bonusIndex = 1; bonusIndex < length - 1; bonusIndex++) {
                if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "single") {
                    var singleGroup = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        singleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                    }
                    singleBonusArray.push(singleGroup);
                } else if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "double") {
                    var doubleGroup = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        doubleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                    }
                    doubleBonusArray.push(doubleGroup);
                } else if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "triple") {
                    var tripleGroup = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        tripleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                    }
                    tripleBonusArray.push(tripleGroup);
                }
                // TODO: change from length to turnbonus type
                // if (props.currentState.bonusGroups[bonusIndex].length == 3) {
                //     const triple = [];
                //     for (var j = 0; j < 3; j++) {
                //         triple.push(props.currentState.bonusGroups[bonusIndex][j].idObj);
                //     }
                //     tripleBonusArray.push(triple);
                // } else if (props.currentState.bonusGroups[bonusIndex].length == 2) {
                //     const double = [];
                //     for (var j = 0; j < 2; j++) {
                //         double.push(props.currentState.bonusGroups[bonusIndex][j].idObj);
                //     }
                //     doubleBonusArray.push(double);
                // }
            }
            console.log("triple bonus array: ", tripleBonusArray);
            console.log("current heights: ", currentHeight);
            const tripleIncrease = 20;
            setShowWaitingDiv(HIDE_DIV);
            let posAfterTriple = handleTripleBonuses(
                setCurrentHeight,
                tripleBonusArray,
                tripleIncrease,
                ids,
                setStartHeights,
                setEndHeights,
                currentHeight,
                setTriples,
                setBonusType,
                setOpenBonusShower
            );

            console.log("pos after triple: ", posAfterTriple);

            let tripleBonusPause = tripleBonusArray.length * PAUSE_BETWEEN_ANIMATIONS;
            clearBonusArray(setTriples, tripleBonusPause);

            console.log("double bonus array: ", doubleBonusArray);

            const doubleIncrease = 10;
            let posAfterDouble = handleDoubleBonuses(
                setCurrentHeight,
                doubleBonusArray,
                doubleIncrease,
                ids,
                setStartHeights,
                setEndHeights,
                posAfterTriple,
                setDoubles,
                tripleBonusArray.length,
                setBonusType, 
                setOpenBonusShower
            );
            
            console.log("posAfterDouble: ", posAfterDouble);
            
            let allBonusPause = (tripleBonusArray.length + doubleBonusArray.length) * PAUSE_BETWEEN_ANIMATIONS;
            clearBonusArray(setDoubles, allBonusPause);
            setTimeout(() => setOpenBonusShower(CLOSED), allBonusPause);

            // go to final heights
            heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[length - 1].length; i++) {
                const scaledPosition = props.currentState.bonusGroups[0][i].position * 40 + 30;
                heightsFromState.push(scaledPosition);
            }
            console.log("final heights from state: ", heightsFromState);

            let scaledNewHeights = heightsFromState;
            updateHeightsDelayed(
                setCurrentHeight,
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
            const time = new Date();
            const receiveTime = time.getTime();
            const waitTime = receiveTime - props.currentState.roundStartTime;
            handleDisablePlayers(allMovementPause, setDisabledPlayers, waitTime);
            handleGameTimer(allMovementPause, setResetTimer, setPauseTimer, waitTime);
            pauseSubmitButton(allMovementPause, setDisableButton, waitTime);
        }
    }, [props.currentState]);
  
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
            <GameTimer // just display end minus current time, needs to end at correct time
                roundLength={roundLength}
                setSubmitDecisions={setSubmitDecisions}
                resetTimer={resetTimer}
                setResetTimer={setResetTimer}
                pauseTimer={pauseTimer}
                noteTime={noteTime}
                setNoteTime={setNoteTime}
                setTimeLeft={setTimeLeft}
                windowWidth={props.windowWidth}
                disabled={disableButton}
                disableButton={() => setDisableButton(DISABLE_BUTTON)}
            />
    
            <ConfirmButton
                id={props.id}
                currentState={props.currentState}
                submit={submitDecisions}
                setSubmit={setSubmitDecisions}
                clearSubmission={() => setSubmitDecisions(DONT_SUBMIT_DECISIONS)}
                selected={selected}
                clearSelected={() => clearSelected(setSelected)}
                disabled={disableButton}
                disableButton={() => setDisableButton(DISABLE_BUTTON)}
                timeLeft = {timeLeft}
                setNoteTime = {setNoteTime}
                windowWidth={props.windowWidth}
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
                            props.id,
                            props.playerData,
                            props.currentState.bonusGroups,
                            player,
                            selected,
                            setSelected,
                            setSelectedSelf,
                            setTooManySelects,
                            startHeights,
                            endHeights,
                            player,
                            doubles,
                            triples,
                            disabledPlayers,
                            props.windowWidth,
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

function handleDisablePlayers(animationPause, setDisabledPlayers, waitTime) {
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

function handleGameTimer(animationPause, setResetTimer, setPauseTimer, waitTime) {
    console.log("wait time: ", waitTime);
    setResetTimer(RESET_TIMER);
    setPauseTimer(PAUSE_TIMER);
    setTimeout(() => {
        setPauseTimer(DO_NOT_PAUSE_TIMER);
    }, 0);
}

function pauseSubmitButton(animationPause, setDisableButton, waitTime) {
    setDisableButton(DISABLE_BUTTON);
    setTimeout(() => {
        setDisableButton(DO_NOT_DISABLE_BUTTON);
    }, animationPause);
}

function getColumn(id, playerData, bonusGroups, playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, myID, doubles, triples, disabledPlayers, windowWidth) {
    // myID is player index in array
    // get idObj from playerData array
    // console.log("player data: ", playerData);
    const idObj = playerData[myID].id;
    const avatarIndex = playerData[myID].avatar;
    var isSelf = false;
    if (idObj == id) {
        isSelf = true;
    }

    return (
    <Grid item>
        <PlayerColumn
            onSelect={() =>
            selectPlayer(
                playerData,
                bonusGroups,
                playerNumber,
                selected,
                setSelected,
                setSelectedSelf,
                setTooManySelections,
                id
            )}
            selected={selected[playerNumber]}
            double={doubles[playerNumber]}
            triple={triples[playerNumber]}
            from={fromHeights[playerNumber]}
            to={toHeights[playerNumber]}
            player={playerNumber}
            avatar={avatarIndex}
            disabled={disabledPlayers[playerNumber]}
            windowWidth={windowWidth}
            isSelf={isSelf}
        />
    </Grid>
);
}

function handleTripleBonuses(setCurrentHeights, tripleArray, tripleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setTriples, setBonusType, setOpenBonusShower) {
    let oldHeights = originalHeights.slice(0);
    let newHeights = originalHeights.slice(0);
    for (let i = 0; i < tripleArray.length; i++) {
        let loginCodes = tripleArray[i];
        newHeights = oldHeights.slice(0);
        let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
        let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
        let thirdIndex = getPlayerIndex(loginCodes[THIRD_CODE], allLoginCodes);
        // let scaledBonus = scaleBonus(tripleIncrease);
        let scaledBonus = 0;
        newHeights[firstIndex] += scaledBonus;
        newHeights[secondIndex] += scaledBonus;
        newHeights[thirdIndex] += scaledBonus;
        updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, i * PAUSE_BETWEEN_ANIMATIONS, TRIPLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
        markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, i * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
    if (newHeights == null) return originalHeights.splice(0);
    else return newHeights;
}

function markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, delay) {
    updateBonusArray([firstIndex, secondIndex, thirdIndex], setTriples, delay);
}

function handleDoubleBonuses(setCurrentHeights, doubleArray, doubleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setDoubles, animationOffset, setBonusType, setOpenBonusShower) {
    let oldHeights = originalHeights.slice(0);
    let newHeights;
    for (let i = 0; i < doubleArray.length; i++) {
        let loginCodes = doubleArray[i];
        newHeights = oldHeights.slice(0);
        let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
        let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
        let bonusGroupIndices = [];
        for (let j = 0; j < loginCodes.length; j++) {
            bonusGroupIndices.push(getPlayerIndex(loginCodes[j], allLoginCodes));
        }
        // let scaledBonus = scaleBonus(doubleIncrease);
        let scaledBonus = 0;
        newHeights[firstIndex] += scaledBonus;
        newHeights[secondIndex] += scaledBonus;
        updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS, DOUBLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
        markDoubleDelayed(firstIndex, secondIndex, setDoubles, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
    if (newHeights == null) return originalHeights;
    else return newHeights;
}

function markDoubleDelayed(firstIndex, secondIndex, setDoubles, delay) {
    updateBonusArray([firstIndex, secondIndex], setDoubles, delay);
}

function updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, delay, bonusType, setBonusType, setOpenBonusShower, openBonus) {
    setTimeout(() => {
        updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights);
        setBonusType(bonusType);
        setOpenBonusShower(openBonus);
        if (bonusType == SINGLE_BONUS) {
            setCurrentHeights(newHeights);
        }
    }, delay);
}

function updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights) {
    setOldHeights(oldHeights);
    setNewHeights(newHeights);
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

function createPlayerArray(height) {
    let heights = new Array(NUM_PLAYERS);
    heights.fill(height);
    return heights;
}

function selectPlayer(playerData, bonusGroups, player, selected, setSelected, setSelectedSelf, setTooManySelections, myID) {    
    console.log("select player index: ", player);
    console.log("select player id: ", playerData[player].id);
    if (playerData[player].id == myID) {
        console.log("selected self");
        setSelectedSelf(SELECTED_SELF);
        return;
    }

    if (selected[player]) {
        let updatedSelection = selected.slice(0);
        updatedSelection[player] = !updatedSelection[player];
        setSelected(updatedSelection);
        return;
    }

    if (countSelectedPlayers(selected) < MAX_PLAYERS_SELECTED) {
        let updatedSelection = selected.slice(0);
        updatedSelection[player] = !updatedSelection[player];
        setSelected(updatedSelection);
    } else {
        console.log("too many selections");
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

function getPlayerIndex(loginCode, allLoginCodes) {
    for (let i = 0; i < allLoginCodes.length; i++) {
        if (allLoginCodes[i] === loginCode) return i;
    }
}

function moveToSummary(props) {
    props.history.push(GAME_TWO_INTRO_ROUTE);
}

export default withRouter(withStyles(styles)(GameOne));