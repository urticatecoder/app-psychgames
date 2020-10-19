import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid} from '@material-ui/core'

// EACH PLAYER IS 15% OF THE VERTICAL SIZE OF THE SCREEN
const BOTTOM_OF_SCREEN = 100;
const INITIAL_HEIGHT = 50;

const NUM_PLAYERS = 6
const VERTICAL_CONSTANT = 10;
const VERTICAL_SCALAR = .60;

var fromHeights = createPlayerArray(BOTTOM_OF_SCREEN)
var toHeights = createPlayerArray(scaleHeight(INITIAL_HEIGHT))

function ColumnController(props) {
    // updateHeight(3, 80)
    // updateHeight(2, 90)
    // updateHeight(0, 100)
    // updateHeight(1, 0)

    return (
        <div /* style={{backgroundColor: '#f00000'}} */>
            <Grid
                container
                direction="row"
                justify='center'
                spacing = {10}
                style={{height: '80vh'}}
                >

                {getColumn(0)}
                {getColumn(1)}
                {getColumn(2)}
                {getColumn(3)}
                {getColumn(4)}
                {getColumn(5)}
                
            </Grid>
        </div>
    )
}

function getColumn(playerNumber) {
    
    return(
        <Grid item>
            <PlayerColumn from={fromHeights[playerNumber]} to={toHeights[playerNumber]} player={playerNumber}/>
        </Grid>
    )
}

function updateHeight(player, height) {
    fromHeights[player] = toHeights[player];
    let scaledHeight = scaleHeight(height);
    toHeights[player] = scaledHeight;
}

function scaleHeight(height) {
    return height * VERTICAL_SCALAR + VERTICAL_CONSTANT;
}

function createPlayerArray(height) {
    let heights = new Array(NUM_PLAYERS);
    heights.fill(height);
    return heights;
}

export default (ColumnController);