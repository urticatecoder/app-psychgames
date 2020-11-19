import React, {useEffect, useState} from 'react';
import '../../common_stylings/FullScreenDiv.css'
import PlayerColumn from './PlayerColumn';
import {Grid, withStyles} from '@material-ui/core'
import socket from "../../socketClient";
import Alert from '@material-ui/lab/Alert';
import {Snackbar} from '@material-ui/core'
import ConfirmButton from './ConfirmButton';
import { withRouter } from "react-router-dom";
import GroupBox from './GroupBox'
import GameTimer from '../../common_components/GameTimer'

const SUMMARY_ROUTE = '/summary'



const MAX_HEIGHT = 100;

// EACH PLAYER IS 15% OF THE VERTICAL SIZE OF THE SCREEN
const BOTTOM_OF_SCREEN = 100;
const INITIAL_HEIGHT = 0;

const NUM_PLAYERS = 6
const VERTICAL_CONSTANT = 1;
const VERTICAL_SCALAR = .58;
const NEGATIVE_ONE = -1;

const MAX_PLAYERS_SELECTED = 2;
const PLAYERS = [0, 1, 2, 3, 4, 5]

const NOT_SELECTED = false

const NOT_SELECTED_INT = 0
const SELECTED_INT = 1

const DO_NOT_SUBMIT_DECISIONS = false

const SELECTED_SELF = true
const DID_NOT_SELECT_SELF = false

const TOO_MANY_SELECTIONS = true
const NOT_TOO_MANY_SELECTIONS = false

const SELF_SELECTION_MESSAGE = "You cannot choose yourself!"
const TOO_MANY_SELETIONS_MESSAGE = "You cannot choose more than 2 players!"
const ALERT_LEVEL = "error"

const OPEN_MESSAGE = true
const CLOSED_MESSAGE = false
const ERROR_MESSAGE_LENGTH = 2000
const ERROR_VERTICALITY = "top"
const ERROR_HORIZONTAL = "left"

const RESET_TIMER = true
const DO_NOT_RESET_TIMER = false

const FIRST_CODE = 0;
const SECOND_CODE = 1;
const THIRD_CODE = 2;

const PAUSE_BETWEEN_ANIMATIONS = 2000;
const IN_BONUS = true;

const NORMAL_ANIMATION_OFFSET = 1

const styles = ({
    gameplay: {
      position: 'absolute',
      top: '8vh',
      left: '19vw',
      height: '90vh',
      width: '85vw',
      borderRadius: '20px',
      alignItems: 'center',
      verticalAlign: 'middle',
    },
  });

function ColumnController(props) {

    const [fromHeights, setFromHeights] = useState(createPlayerArray(BOTTOM_OF_SCREEN))
    const [toHeights, setToHeights] = useState(createPlayerArray(scaleHeight(INITIAL_HEIGHT)))
    const [currentHeights, setCurrentHeights] = useState(createPlayerArray(scaleHeight(INITIAL_HEIGHT)))
    const [selected, setSelected] = useState(createPlayerArray(NOT_SELECTED))
    const [doubles, setDoubles] = useState(createPlayerArray(NOT_SELECTED))
    const [triples, setTriples] = useState(createPlayerArray(NOT_SELECTED))
    const [selectedSelf, setSelectedSelf] = useState(DID_NOT_SELECT_SELF)
    const [tooManySelections, setTooManySelections] = useState(NOT_TOO_MANY_SELECTIONS)
    const [resetTimer, setResetTimer] = useState(DO_NOT_RESET_TIMER)
    const [submitDecisions, setSubmitDecisions] = useState(DO_NOT_SUBMIT_DECISIONS)

    useEffect(() => {
        socket.on("location for game 1", (locations, tripleBonuses, tripleIncrease, doubleBonuses, doubleIncrease) => {
            handleTripleBonuses(tripleBonuses, tripleIncrease, props.allLoginCodes, setFromHeights, setToHeights, currentHeights, setCurrentHeights, setTriples);
            clearBonusArray(setTriples, (tripleBonuses.length * PAUSE_BETWEEN_ANIMATIONS));

            handleDoubleBonuses(doubleBonuses, doubleIncrease, props.allLoginCodes, setFromHeights, setToHeights, currentHeights, setCurrentHeights, setDoubles, tripleBonuses.length);
            clearBonusArray(setDoubles, (tripleBonuses.length + doubleBonuses.length) * PAUSE_BETWEEN_ANIMATIONS);

            updateHeightsDelayed(currentHeights, scaleHeights(locations), setFromHeights, setToHeights, setCurrentHeights, (tripleBonuses.length + doubleBonuses.length) * PAUSE_BETWEEN_ANIMATIONS)
            setResetTimer(RESET_TIMER)
        });

        socket.on("end game 1", (winners, losers, doubleBonuses, tripleBonuses) => {
            props.setWinners(winners)
            props.setLosers(losers)
            setTimeout(() => moveToSummary(props), (doubleBonuses + tripleBonuses + NORMAL_ANIMATION_OFFSET) * PAUSE_BETWEEN_ANIMATIONS)
        });

        return () => {
            socket.off("location for game 1");
            socket.off("end game 1");
        }
    }, [currentHeights, props]);

    const {classes} = props

    return (
        <div>
            {getAlerts(selectedSelf, setSelectedSelf, tooManySelections, setTooManySelections)}

            <GameTimer setSubmitDecisions={setSubmitDecisions} resetTimer={resetTimer} setResetTimer={setResetTimer}/>
            <ConfirmButton submit={submitDecisions} clearSubmission = {() => setSubmitDecisions(DO_NOT_SUBMIT_DECISIONS)} selected={selected} clearSelected={() => clearSelected(setSelected)} loginCode={props.loginCode} allLoginCodes={props.allLoginCodes}/>

            <div className={classes.gameplay}>
                <GroupBox groupNumber='One' width='60vw'/>
                <Grid
                    container
                    direction="row"
                    justify='center'
                    spacing = {10}
                    style={{height: '80vh'}}
                    >
                    {PLAYERS.map((player) => {
                        return getColumn(player, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, props.allLoginCodes, props.loginCode, doubles, triples)
                    })}
                </Grid>
                <GroupBox groupNumber='Two' width='60vw'/>
            </div>

        </div>
    )
}

// FIXME: REMOVE DUPLICATION
function handleTripleBonuses(tripleArray, tripleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setCurrentHeight, setTriples) {
    let oldHeights = originalHeights.slice(0);
    for (let i = 0; i < tripleArray.length; i++) {
        let loginCodes = tripleArray[i];
        let newHeights = oldHeights.slice(0);
        let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
        let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
        let thirdIndex = getPlayerIndex(loginCodes[THIRD_CODE], allLoginCodes);
        let scaledBonus = scaleBonus(tripleIncrease);
        newHeights[firstIndex] += scaledBonus;
        newHeights[secondIndex] += scaledBonus;
        newHeights[thirdIndex] += scaledBonus;
        updateHeightsDelayed(oldHeights, newHeights, setOldHeights, setNewHeights, setCurrentHeight, (i) * PAUSE_BETWEEN_ANIMATIONS)
        markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, (i) * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
}

function markTripleDelayed(firstIndex, secondIndex, thirdIndex, setTriples, delay) {
    updateBonusArray([firstIndex, secondIndex, thirdIndex], setTriples, delay);
}

function markDoubleDelayed(firstIndex, secondIndex, setDoubles, delay) {
    updateBonusArray([firstIndex, secondIndex], setDoubles, delay);
}

function clearBonusArray(setBonus, delay) {
    setTimeout(() => setBonus(createPlayerArray(NOT_SELECTED)), delay)
}

function updateBonusArray(indexArray, setBonus, delay) {
    let bonusArray = createPlayerArray(NOT_SELECTED);
    indexArray.forEach((index) => {
        bonusArray[index] = IN_BONUS;
    })
    setTimeout(() => setBonus(bonusArray), delay);
}

function handleDoubleBonuses(doubleArray, doubleIncrease, allLoginCodes, setOldHeights, setNewHeights, originalHeights, setCurrentHeight, setDoubles, animationOffset) {
    let oldHeights = originalHeights.slice(0);
    for (let i = 0; i < doubleArray.length; i++) {
        let loginCodes = doubleArray[i];
        let newHeights = oldHeights.slice(0);
        let firstIndex = getPlayerIndex(loginCodes[FIRST_CODE], allLoginCodes);
        let secondIndex = getPlayerIndex(loginCodes[SECOND_CODE], allLoginCodes);
        let scaledBonus = scaleBonus(doubleIncrease);
        newHeights[firstIndex] += scaledBonus;
        newHeights[secondIndex] += scaledBonus;
        updateHeightsDelayed(oldHeights, newHeights, setOldHeights, setNewHeights, setCurrentHeight, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
        markDoubleDelayed(firstIndex, secondIndex, setDoubles, (i + animationOffset) * PAUSE_BETWEEN_ANIMATIONS);
        oldHeights = newHeights;
    }
}

function updateHeightsDelayed(oldHeights, newHeights, setOldHeights, setNewHeights, setCurrentHeight, delay) {
    setCurrentHeight(newHeights);
    setTimeout(() => updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights), delay);
}

function updateHeights(oldHeights, newHeights, setOldHeights, setNewHeights) {
        setOldHeights(oldHeights);
        setNewHeights(newHeights);
}

function getPlayerIndex(loginCode, allLoginCodes) {
    for (let i = 0; i < allLoginCodes.length; i++) {
        if (allLoginCodes[i] === loginCode) return i;
    }
}

function clearSelected(setSelected) {
    setSelected(createPlayerArray(NOT_SELECTED));
}

function getAlerts(selectedSelf, setSelectedSelf, tooManySelections, setTooManySelections) {
    if (selectedSelf) {
        return getAlertComponent(SELF_SELECTION_MESSAGE, setSelectedSelf)
    }
    else if (tooManySelections) {
        return getAlertComponent(TOO_MANY_SELETIONS_MESSAGE, setTooManySelections)
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

function getColumn(playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, playerIDs, myID, doubles, triples) {
    return(
        <Grid item>
            <PlayerColumn onSelect = {() => selectPlayer(playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, playerIDs, myID)} selected={selected[playerNumber]} double={doubles[playerNumber]} triple={triples[playerNumber]} from={fromHeights[playerNumber]} to={toHeights[playerNumber]} player={playerNumber} />
        </Grid>
    )
}

function scaleBonus(bonus) {
    return NEGATIVE_ONE * VERTICAL_SCALAR * bonus;
}

function scaleHeight(height) {
    let invertedHeight = invertHeight(height);
    return invertedHeight * VERTICAL_SCALAR + VERTICAL_CONSTANT;
}

function scaleHeights(heightArray) {
    return heightArray.map(height => scaleHeight(height))
}

function createPlayerArray(height) {
    let heights = new Array(NUM_PLAYERS);
    heights.fill(height);
    return heights;
}

function selectPlayer(player, selected, setSelected, setSelectedSelf, setTooManySelections, playerIDs, myID) {
    if (playerIDs[player] === myID) {
        setSelectedSelf(SELECTED_SELF)
        return;
    }

    let playerIsSelected = NOT_SELECTED_INT;
    if (selected[player]) playerIsSelected = SELECTED_INT

    if (countSelectedPlayers(selected) < MAX_PLAYERS_SELECTED + playerIsSelected) {
        let updatedSelection = selected.slice(0)
        updatedSelection[player] = !updatedSelection[player]
        setSelected(updatedSelection)
    } else {
        setTooManySelections(TOO_MANY_SELECTIONS)
    }
}

function countSelectedPlayers(selected) {
    return getSelectedPlayers(selected).length
}

function getSelectedPlayers(selected) {
    let selectedPlayers = []
    for (let i = 0; i < NUM_PLAYERS; i++) {
        if (selected[i]) selectedPlayers.push(selected[i])
    }
    return selectedPlayers
}

function invertHeight(height) {
    return MAX_HEIGHT - height;
}

function moveToSummary(props) {
    props.history.push(SUMMARY_ROUTE)
}


export default (withRouter(withStyles(styles)(ColumnController)));
