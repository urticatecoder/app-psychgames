import React, {useEffect, useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid} from '@material-ui/core'
import socket from "../../socketClient";
import Alert from '@material-ui/lab/Alert';
import {Snackbar, Button} from '@material-ui/core'
import ConfirmButton from './ConfirmButton';

// EACH PLAYER IS 15% OF THE VERTICAL SIZE OF THE SCREEN
const BOTTOM_OF_SCREEN = 100;
const INITIAL_HEIGHT = 50;

const NUM_PLAYERS = 6
const VERTICAL_CONSTANT = 10;
const VERTICAL_SCALAR = .60;
const MAX_PLAYERS_SELECTED = 2;
const PLAYERS = [0, 1, 2, 3, 4, 5]

const NOT_SELECTED = false
const SELECTED = true

const NOT_SELECTED_INT = 0
const SELECTED_INT = 1

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
const ERROR_HORIZONTAL = "center"

function ColumnController(props) {

    const [fromHeights, setFromHeights] = useState(createPlayerArray(BOTTOM_OF_SCREEN))
    const [toHeights, setToHeights] = useState(createPlayerArray(scaleHeight(INITIAL_HEIGHT)))
    const [selected, setSelected] = useState(createPlayerArray(NOT_SELECTED))
    const [selectedSelf, setSelectedSelf] = useState(DID_NOT_SELECT_SELF)
    const [tooManySelections, setTooManySelections] = useState(NOT_TOO_MANY_SELECTIONS)
    
    useEffect(() => {
        socket.on("location for game 1", (locations) => {
            setFromHeights(toHeights)
            setToHeights(scaleHeights(locations))
        });

        return () => {
            console.log("remove listeners");
            socket.off("location for game 1");
        }
    }, []);

    return (
        <div /* style={{backgroundColor: '#f00000'}} */>
            {getAlerts(selectedSelf, setSelectedSelf, tooManySelections, setTooManySelections)}

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

            <ConfirmButton selected={selected} clearSelected={() => clearSelected(setSelected)} loginCode={props.loginCode} allLoginCodes={props.allLoginCodes}/>
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

// function updateHeight(player, height) {
//     fromHeights[player] = toHeights[player];
//     let scaledHeight = scaleHeight(height);
//     toHeights[player] = scaledHeight;
// }

function scaleHeight(height) {
    return height * VERTICAL_SCALAR + VERTICAL_CONSTANT;
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

export default (ColumnController);