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
import GameOneHelp from "./components/GameOneHelp";

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
    const [singles, setSingles] = useState(initialSelections);
  
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

    const [madeMove, setMadeMove] = useState(true);
    const [animationPause, setAnimationPause] = useState(0);

    if (!props.currentState) {
        props.history.push(Routes.LOGIN);
        return (<div></div>);
    }

    const roundEndTime = Date.parse(props.currentState.roundEndTime);
    // console.log("round end time: ", roundEndTime);
    const time = new Date();
    // console.log("current time: ", time.getTime());
    const roundLength = roundEndTime - time.getTime();
    // console.log("round length: ", roundLength);

    useEffect(() => {
        console.log("selected self changed to: ", selectedSelf);
    }, [selectedSelf]);

    useEffect(() => {
        console.log("made move: ", madeMove);
    }, [madeMove]);
  
    useEffect(() => {
        if (props.currentState.type != "game-one_state") {
            return;
        }
        console.log("game one state: ", props.currentState);

        if (!madeMove) {
            console.log("didn't make move");
            props.setPassiveDialogueOpen(true);
        }

        setMadeMove(false);

        const ids = [];
        for (var i = 0; i < props.playerData.length; i++) {
            ids.push(props.playerData[i].id);
        }

        if (props.rejoined) {
            console.log("rejoined, render without animation");
            // render heights without animation
            var length = props.currentState.bonusGroups.length;
            var heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[length - 1].length; i++) {
                const scaledPosition = -1 * (props.currentState.bonusGroups[length - 1][i].position * 30) + 30;
                heightsFromState.push(scaledPosition);
            }
            console.log("heights from state: ", heightsFromState);
            setEndHeights(heightsFromState);
            setCurrentHeight(heightsFromState);
            props.setRejoined(false);
            setDisableButton(true);
        } else if (props.currentState.bonusGroups.length == 1) {
            var heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[0].length; i++) {
                const scaledPosition = -1 * (props.currentState.bonusGroups[0][i].position * 30) + 30;
                heightsFromState.push(scaledPosition);
            }
            console.log("heights from state: ", heightsFromState);
            setEndHeights(heightsFromState);
            setCurrentHeight(heightsFromState);
        } else {
            // go to initial heights
            var heightsFromState = [];
            for (var i = 0; i < props.currentState.bonusGroups[0].length; i++) {
                const scaledPosition = -1 * (props.currentState.bonusGroups[0][i].position * 30) + 30;
                heightsFromState.push(scaledPosition);
            }
            // console.log("heights from state: ", heightsFromState);
            setEndHeights(heightsFromState);
            setCurrentHeight(heightsFromState);

            // handle bonuses
            const tripleBonusArray = [];
            const doubleBonusArray = [];
            const singleBonusArray = [];
            const tripleHeightArray = [];
            const doubleHeightArray = [];
            const singleHeightArray = [];
            const length = props.currentState.bonusGroups.length;
            // console.log("length: ", length);
            for (var bonusIndex = 1; bonusIndex < length - 1; bonusIndex++) {
                if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "single") {
                    var singleGroup = [];
                    var singleGroupHeight = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        singleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                        singleGroupHeight.push(-1 * (props.currentState.bonusGroups[bonusIndex][player].position * 30) + 30);
                    }
                    singleBonusArray.push(singleGroup);
                    singleHeightArray.push(singleGroupHeight);
                } else if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "double") {
                    var doubleGroup = [];
                    var doubleGroupHeight = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        doubleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                        doubleGroupHeight.push(-1 * (props.currentState.bonusGroups[bonusIndex][player].position * 30) + 30);
                    }
                    doubleBonusArray.push(doubleGroup);
                    doubleHeightArray.push(doubleGroupHeight);
                } else if (props.currentState.bonusGroups[bonusIndex][0].turnBonus == "triple") {
                    var tripleGroup = [];
                    var tripleGroupHeight = [];
                    for (var player = 0; player < props.currentState.bonusGroups[bonusIndex].length; player++) {
                        tripleGroup.push(props.currentState.bonusGroups[bonusIndex][player].id);
                        tripleGroupHeight.push(-1 * (props.currentState.bonusGroups[bonusIndex][player].position * 30) + 30);
                    }
                    // doubleBonusArray.push(tripleGroup);
                    // doubleHeightArray.push(tripleGroupHeight);
                    tripleBonusArray.push(tripleGroup);
                    tripleHeightArray.push(tripleGroupHeight);
                }
            }
            // console.log("current heights: ", currentHeight);
            const tripleIncrease = 20;
            setShowWaitingDiv(HIDE_DIV);
            let posAfterTriple = handleTripleBonuses(
                setCurrentHeight,
                tripleBonusArray,
                tripleHeightArray,
                tripleIncrease,
                ids,
                setStartHeights,
                setEndHeights,
                heightsFromState,
                setTriples,
                setBonusType,
                setOpenBonusShower
            );

            // console.log("pos after triple: ", posAfterTriple);

            let tripleBonusPause = tripleBonusArray.length * PAUSE_BETWEEN_ANIMATIONS;
            clearBonusArray(setTriples, tripleBonusPause);

            console.log("double bonus array: ", doubleBonusArray);
            // console.log("ids: ", ids);
            const doubleIncrease = 10;
            let posAfterDouble = handleDoubleBonuses(
                setCurrentHeight,
                doubleBonusArray,
                doubleHeightArray,
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

            let tripleDoubleBonusPause = (tripleBonusArray.length + doubleBonusArray.length) * PAUSE_BETWEEN_ANIMATIONS;
            clearBonusArray(setDoubles, tripleDoubleBonusPause);

            // handle single bonuses
            const singleIncrease = 5;
            console.log("single bonus array: ", singleBonusArray);
            let posAfterSingle = handleSingleBonuses(
                setCurrentHeight,
                singleBonusArray,
                singleHeightArray,
                singleIncrease,
                ids,
                setStartHeights,
                setEndHeights,
                posAfterDouble,
                setSingles,
                doubleBonusArray.length + tripleBonusArray.length,
                setBonusType,
                setOpenBonusShower
            );
            
            // console.log("posAfterDouble: ", posAfterDouble);
            
            let allBonusPause = (tripleBonusArray.length + doubleBonusArray.length + singleBonusArray.length) * PAUSE_BETWEEN_ANIMATIONS;
            clearBonusArray(setSingles, allBonusPause);
            setTimeout(() => setOpenBonusShower(CLOSED), allBonusPause);

            // go to final heights
            let finalHeights = [];
            for (var i = 0; i < props.currentState.bonusGroups[length - 1].length; i++) {
                const scaledPosition = -1 * (props.currentState.bonusGroups[length - 1][i].position * 30) + 30;
                finalHeights.push(scaledPosition);
            }
            // console.log("final heights from state: ", finalHeights);

            let scaledNewHeights = finalHeights;
            updateHeightsDelayed(
                setCurrentHeight,
                posAfterSingle,
                scaledNewHeights,
                setStartHeights,
                setEndHeights,
                allBonusPause,
                'none',
                setBonusType,
                setOpenBonusShower,
                CLOSED);

            let allMovementPause = allBonusPause + PAUSE_BETWEEN_ANIMATIONS;
            setAnimationPause(allMovementPause);
            const time = new Date();
            const receiveTime = time.getTime();
            handleDisablePlayers(allMovementPause, setDisabledPlayers);
            handleGameTimer(allMovementPause, setResetTimer, setPauseTimer);
            pauseSubmitButton(allMovementPause, setDisableButton);
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
            <GameOneHelp/>
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
                setPassiveDialogueOpen={props.setPassiveDialogueOpen}
            />

            {/* <GameTimerRefactor
            /> */}
    
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
                madeMove={madeMove}
                setMadeMove={setMadeMove}
                roundStartTime={props.currentState.roundStartTime}
                animationPause={animationPause}
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
                            singles,
                            doubles,
                            triples,
                            disabledPlayers,
                            props.windowWidth,
                            props.windowHeight
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
    // setPauseTimer(PAUSE_TIMER);
    setResetTimer(RESET_TIMER);
    // setTimeout(() => {
    //     setPauseTimer(DO_NOT_PAUSE_TIMER);
    // }, 0);
}

function pauseSubmitButton(animationPause, setDisableButton) {
    setDisableButton(DISABLE_BUTTON);
    setTimeout(() => {
        setDisableButton(DO_NOT_DISABLE_BUTTON);
    }, animationPause);
}

function getColumn(id, playerData, bonusGroups, playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, myID, singles, doubles, triples, disabledPlayers, windowWidth, windowHeight) {
    // myID is player index in array
    // get idObj from playerData array
    // console.log("player data: ", playerData);
    // console.log("get column called")
    const idObj = playerData[myID].id;
    const avatarIndex = playerData[myID].avatar;
    var isSelf = false;
    if (idObj == id) {
        isSelf = true;
    }

    let doAnimate = false;
    // for (let i = 0; i <= 5; i++) {
    //     if (toHeights[i] > fromHeights[i]) {
    //         doAnimate = true;
    //     }
    // }
    if (toHeights[myID] != fromHeights[myID]) {
        doAnimate = true;
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
            single={singles[playerNumber]}
            double={doubles[playerNumber]}
            triple={triples[playerNumber]}
            from={fromHeights[playerNumber]}
            to={toHeights[playerNumber]}
            player={playerNumber}
            avatar={avatarIndex}
            disabled={disabledPlayers[playerNumber]}
            windowHeight={windowHeight}
            windowWidth={windowWidth}
            isSelf={isSelf}
            doAnimate={doAnimate}
        />
    </Grid>
);
}

function handleTripleBonuses(setCurrentHeights, tripleArray, tripleHeightArray, tripleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setTriples, setBonusType, setOpenBonusShower) {
    let oldHeights = originalHeights.slice(0);
    // console.log("old heights: ", oldHeights);
    let newHeights = [];
    for (let i = 0; i < originalHeights.length; i++) {
        newHeights.push(originalHeights[i]);
    }
    for (let i = 0; i < tripleArray.length; i++) {
        let loginCodes = tripleArray[i];
        newHeights = oldHeights.slice(0);
        let bonusGroupIndices = [];
        for (let j = 0; j < loginCodes.length; j++) {
            const playerIndex = getPlayerIndex(loginCodes[j], allLoginCodes);
            bonusGroupIndices.push(playerIndex);
            newHeights[playerIndex] = tripleHeightArray[i][j];
        }
        updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, i * PAUSE_BETWEEN_ANIMATIONS, TRIPLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
        markTripleDelayed(bonusGroupIndices, setTriples, i * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
    if (newHeights == null) return originalHeights.splice(0);
    else return newHeights;
}

function markTripleDelayed(bonusGroupIndices, setTriples, delay) {
    updateBonusArray(bonusGroupIndices, setTriples, delay);
}

function handleDoubleBonuses(setCurrentHeights, doubleArray, doubleHeightArray, doubleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setDoubles, animationOffset, setBonusType, setOpenBonusShower) {
    let oldHeights = originalHeights.slice(0);
    // console.log("old heights: ", oldHeights);
    let newHeights = [];
    for (let i = 0; i < originalHeights.length; i++) {
        newHeights.push(originalHeights[i]);
    }
    for (let i = 0; i < doubleArray.length; i++) {
        let loginCodes = doubleArray[i];
        newHeights = oldHeights.slice(0);
        console.log("old heights slice: ", newHeights);
        let bonusGroupIndices = [];
        // console.log("ids in double bonus group: ", loginCodes)
        for (let j = 0; j < loginCodes.length; j++) {
            const playerIndex = getPlayerIndex(loginCodes[j], allLoginCodes);
            console.log("player index: ", playerIndex);
            bonusGroupIndices.push(playerIndex);
            newHeights[playerIndex] = doubleHeightArray[i][j];
        }
        console.log("handle doubles -> new heights: ", newHeights);
        updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS, DOUBLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
        markDoubleDelayed(bonusGroupIndices, setDoubles, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
    if (newHeights == null) return originalHeights;
    else return newHeights;
}

function markDoubleDelayed(bonusGroupIndices, setDoubles, delay) {
    // console.log("mark double delayed on group: ", bonusGroupIndices)
    updateBonusArray(bonusGroupIndices, setDoubles, delay);
}

function handleSingleBonuses(setCurrentHeights, singleArray, singleHeightArray, singleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setSingles, animationOffset, setBonusType, setOpenBonusShower) {
    let oldHeights = originalHeights.slice(0);
    // console.log("old heights: ", oldHeights);
    let newHeights = originalHeights.slice(0);
    for (let i = 0; i < singleArray.length; i++) {
        let loginCodes = singleArray[i];
        newHeights = oldHeights.slice(0);
        let bonusGroupIndices = [];
        // console.log("ids in single bonus group: ", loginCodes)
        for (let j = 0; j < loginCodes.length; j++) {
            // console.log("id: ", loginCodes[j]);
            // console.log("all login codes: ", allLoginCodes);
            // console.log("index: ", getPlayerIndex(loginCodes[j], allLoginCodes));
            const playerIndex = getPlayerIndex(loginCodes[j], allLoginCodes);
            bonusGroupIndices.push(playerIndex);
            newHeights[playerIndex] = singleHeightArray[i][j];
        }
        updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS, SINGLE_BONUS, setBonusType, setOpenBonusShower, OPEN);
        markSingleDelayed(bonusGroupIndices, setSingles, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
    if (newHeights == null) return originalHeights;
    else return newHeights;
}

function markSingleDelayed(bonusGroupIndices, setSingles, delay) {
    updateBonusArray(bonusGroupIndices, setSingles, delay);
}

function updateHeightsDelayed(setCurrentHeights, oldHeights, newHeights, setOldHeights, setNewHeights, delay, bonusType, setBonusType, setOpenBonusShower, openBonus) {
    setTimeout(() => {
        updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights);
        setBonusType(bonusType);
        console.log("bonus type: ", bonusType);
        setOpenBonusShower(openBonus);
        if (bonusType == "none") {
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
        setTimeout(() => {
            setSelectedSelf(false);
        }, 3000);
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
        setSelectedSelf(false);
        setTooManySelections(TOO_MANY_SELECTIONS);
        setTimeout(() => {
            setTooManySelections(false);
        }, 3000);
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

export default withRouter(withStyles(styles)(GameOne));