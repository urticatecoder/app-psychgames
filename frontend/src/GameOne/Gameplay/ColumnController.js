import React, {useEffect, useState} from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid} from '@material-ui/core'
import socket from "../../socketClient";

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

function ColumnController(props) {

    const [fromHeights, setFromHeights] = useState(createPlayerArray(BOTTOM_OF_SCREEN))
    const [toHeights, setToHeights] = useState(createPlayerArray(scaleHeight(INITIAL_HEIGHT)))
    const [selected, setSelected] = useState(createPlayerArray(NOT_SELECTED))


    let playerIDs = props.playerIDs
    let myID = props.myID

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
            <Grid
                container
                direction="row"
                justify='center'
                spacing = {10}
                style={{height: '80vh'}}
                >
                {PLAYERS.map((player) => {
                    return getColumn(player, selected, setSelected, fromHeights, toHeights, props.allLoginCodes, props.loginCode)
                })}
                
            </Grid>
        </div>
    )
}

function getColumn(playerNumber, selected, setSelected, fromHeights, toHeights, playerIDs, myID) {
    return(
        <Grid item>
            <PlayerColumn onSelect = {() => selectPlayer(playerNumber, selected, setSelected, playerIDs, myID)} selected={selected[playerNumber]} from={fromHeights[playerNumber]} to={toHeights[playerNumber]} player={playerNumber}/>
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

function selectPlayer(player, selected, setSelected, playerIDs, myID) {
    console.log(playerIDs)
    console.log(myID)
    console.log(player)
    console.log(selected)

    if (playerIDs[player] == myID) return;
    let playerIsSelected = NOT_SELECTED_INT;
    if (selected[player]) playerIsSelected = SELECTED_INT

    if (countSelectedPlayers(selected) < MAX_PLAYERS_SELECTED + playerIsSelected) {
        let updatedSelection = selected.slice(0)
        updatedSelection[player] = !updatedSelection[player]
        setSelected(updatedSelection)
    }
}

function countSelectedPlayers(selected) {
    console.log(getSelectedPlayers(selected).length)
    return getSelectedPlayers(selected).length
}

function getSelectedPlayers(selected) {
    let selectedPlayers = []
    for (let i = 0; i < NUM_PLAYERS; i++) {
        if (selected[i]) selectedPlayers.push(selected[i])
    }
    return selectedPlayers
}

// function sendDecisions(selected) {
//     let selectedIDs = []
//     getSelectedPlayers(selected).forEach((player => {
//         selectedIDs.push(playerIDs[player])
//     }))
//     socket.emit('confirm choice for game 1', myID, selectedIDs)
// }

export default (ColumnController);