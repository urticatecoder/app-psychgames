
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PlayerProfile from '../Icons/Components/PlayerProfile';
import { Typography } from '@material-ui/core';
import '../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../CommonComponents/ContinueButton';
import Flame from '../Icons/Images/Shapes/flame.png'

const PLAYER_DESCRIPTION = "You have been assigned the following player:"
const DEFAULT_PLAYER = 0
const PLAYER_VARIANT = 'h2';
const FULL_DIV = 'fullDiv'
const IMAGE_HEIGHT = 250
const IMAGE_WIDTH = 250

const styles = ({
    playerDescription: {
        marginTop: '200px',
    },
    playerProfile: {
        marginTop: '70px',
    },
    continueButton: {
        marginTop: '70px',
    }
});

function MainAvatar(props) {

    const {classes} = props;

    return(
        <div className={FULL_DIV}>
            <Typography className={classes.playerDescription} variant={PLAYER_VARIANT}>{PLAYER_DESCRIPTION}</Typography>
            <div className={classes.playerProfile}>
            <img
                src={Flame}
                width={IMAGE_HEIGHT}
                height={IMAGE_WIDTH}
            />
            </div>
            <div className={classes.continueButton}>
                <ContinueButton className={classes.continueButton} route={'game-one'}/>
            </div>
        </div>
    )
}

export default withStyles(styles)(MainAvatar);