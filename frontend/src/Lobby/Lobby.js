
import React from 'react';
import {Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Button} from '@material-ui/core';

function Lobby(props) {
    return(
        <div>
            <Typography align='center' variant="h1">Lobby</Typography>
            <Link to={"/game-one"}>
                <Button
                variant='primary'
                >
                Play Game One
                </Button>
        </Link>

        </div>
    )
}

export default Lobby;