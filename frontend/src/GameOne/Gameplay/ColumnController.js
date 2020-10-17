import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import PlayerColumn from '../Gameplay/PlayerColumn';
import {Grid} from '@material-ui/core'

function ColumnController(props) {
    return (
        <div style={{backgroundColor: '#f00000'}}>
            <Grid
                container
                direction="row"
                justify='center'
                spacing = {10}
                >

                <Grid item>
                    <PlayerColumn height={10} player={1}/>
                </Grid>

                <Grid item>
                    <PlayerColumn height={20} player={2}/>
                </Grid>

                <Grid item>
                    <PlayerColumn height={30} player={3}/>
                </Grid>

                <Grid item>
                    <PlayerColumn height={0} player={4}/>
                </Grid>

                <Grid item>
                    <PlayerColumn height={20} player={5}/>
                </Grid>

                <Grid item>
                    <PlayerColumn height={10} player={6}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default (ColumnController);