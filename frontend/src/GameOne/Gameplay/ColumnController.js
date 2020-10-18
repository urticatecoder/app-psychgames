import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid} from '@material-ui/core'

const INITIAL_HEIGHT = 40;
const NUM_PLAYERS = 6
var heights = new Array(NUM_PLAYERS)
heights.fill(INITIAL_HEIGHT)

function ColumnController(props) {
    return (
        <div style={{backgroundColor: '#f00000'}}>
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
            <PlayerColumn height={heights[playerNumber]} player={playerNumber}/>
        </Grid>
    )
}

function updateHeight(playerNum, newHeight) {
    heights[playerNum] = newHeight;
}

export default (ColumnController);