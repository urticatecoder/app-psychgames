import React, {useEffect, useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid, withStyles} from '@material-ui/core'
import socket from "../../socketClient";
import Alert from '@material-ui/lab/Alert';
import {Snackbar} from '@material-ui/core'
import ConfirmButton from './ConfirmButton';
import { withRouter } from "react-router-dom";
import GroupBox from './GroupBox'
import GameTimer from './GameTimer'

const SUMMARY_ROUTE = '/summary'



const MAX_HEIGHT = 100;

// EACH PLAYER IS 15% OF THE VERTICAL SIZE OF THE SCREEN
const BOTTOM_OF_SCREEN = 100;
const INITIAL_HEIGHT = 0;

const NUM_PLAYERS = 6
const VERTICAL_CONSTANT = 5;
const VERTICAL_SCALAR = .40;
const MAX_PLAYERS_SELECTED = 2;
const PLAYERS = [0, 1, 2, 3, 4, 5]

const NOT_SELECTED = false
const SELECTED = true

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

function ColumnController(props) {

    const [fromHeights, setFromHeights] = useState(createPlayerArray(BOTTOM_OF_SCREEN))
    const [toHeights, setToHeights] = useState(createPlayerArray(scaleHeight(INITIAL_HEIGHT)))
    const [selected, setSelected] = useState(createPlayerArray(NOT_SELECTED))
    const [selectedSelf, setSelectedSelf] = useState(DID_NOT_SELECT_SELF)
    const [tooManySelections, setTooManySelections] = useState(NOT_TOO_MANY_SELECTIONS)
    const [resetTimer, setResetTimer] = useState(DO_NOT_RESET_TIMER)
    const [submitDecisions, setSubmitDecisions] = useState(DO_NOT_SUBMIT_DECISIONS)

    useEffect(() => {
        socket.on("location for game 1", (locations) => {
            console.log(locations)
            setFromHeights(toHeights)
            setToHeights(scaleHeights(locations))
            setResetTimer(RESET_TIMER)
        });

        socket.on("end game 1", (winners, losers) => {
            props.setWinners(winners)
            props.setLosers(losers)
            moveToSummary(props)
        });

        return () => {
            console.log("remove listeners");
            socket.off("location for game 1");
            socket.off("end game 1");
        }
    }, []);

    const {classes} = props

    return (
        <div>
            {getAlerts(selectedSelf, setSelectedSelf, tooManySelections, setTooManySelections)}

            <GameTimer setSubmitDecisions={setSubmitDecisions} resetTimer={resetTimer} setResetTimer={setResetTimer}/>
            <GroupBox groupNumber='One'/>
            <Grid
                container
                direction="row"
                justify='center'
                spacing = {10}
                style={{height: '80vh'}}
                >
                {PLAYERS.map((player) => {
                    return getColumn(player, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, props.allLoginCodes, props.loginCode)
                })}
            </Grid>
            <GroupBox groupNumber='Two'/>
            <ConfirmButton submit={submitDecisions} clearSubmission = {() => setSubmitDecisions(DO_NOT_SUBMIT_DECISIONS)} selected={selected} clearSelected={() => clearSelected(setSelected)} loginCode={props.loginCode} allLoginCodes={props.allLoginCodes}/>

        </div>
    )
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

function getColumn(playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, fromHeights, toHeights, playerIDs, myID) {
    return(
        <Grid item>
            <PlayerColumn onSelect = {() => selectPlayer(playerNumber, selected, setSelected, setSelectedSelf, setTooManySelections, playerIDs, myID)} selected={selected[playerNumber]} from={fromHeights[playerNumber]} to={toHeights[playerNumber]} player={playerNumber} />
        </Grid>
    )
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
    if (playerIDs[player] == myID) {
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

export default (withRouter(ColumnController));
