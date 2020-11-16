import React from 'react';
import {withStyles} from '@material-ui/core';
import PlayerProfile from '../../Icons/Components/PlayerProfile';

const GROUP_ONE = 1
const GROUP_TWO = 2

const GROUP_ONE_COLOR = "#FF9133"
const GROUP_TWO_COLOR = "#9933FF"

const GROUP_ONE_DIV = "innerDivGroup1"
const GROUP_TWO_DIV = "innerDivGroup2"

const FIRST_PLAYER_INDEX = 0
const SECOND_PLAYER_INDEX = 1
const THIRD_PLAYER_INDEX = 2

const styles = {
    groupBox: {
        borderRadius: '50px',
        opacity: '.8',
        margin: 'auto',
        position: 'absolute',
        height: '65vh',
        width: '10vw',
        top: '20vh'
    },
    outerDiv1: {
        position: 'absolute',
        left: '30%',
    },
    outerDiv2: {
        position: 'absolute',
        left: '83%',
    },
    innerDiv: {
        position: 'relative',
        top: '3%'
    },
    imageDiv: {
        position: 'relative',
        marginTop: '40%'
    }
}

function VerticalPlayerGroup(props) {
    console.log('here')
    console.log(props)
    const {classes} = props
    let isGroupOne = props.type == GROUP_ONE
    let groupColor = (isGroupOne) ? GROUP_ONE_COLOR : GROUP_TWO_COLOR;
    let formattingName = (isGroupOne) ? classes.outerDiv1 : classes.outerDiv2;
    var allLoginCodes = props.allLoginCodes
    //FIXME: delete this, only needed for user testing
    var tempPlayers;
    if (props.type == 1 && props.players.length == 0) {
        // tempPlayers = [allLoginCodes[0], allLoginCodes[1], allLoginCodes[2]]
    } 
    else if (props.type == 0 && props.players.length == 0) {
        // tempPlayers = [allLoginCodes[3], allLoginCodes[4], allLoginCodes[5]]
    }
    else {
        tempPlayers = props.players
    }
    return (
        <div className={formattingName}>
            <div className={classes.groupBox} style={{backgroundColor: groupColor}}>
                <div className={classes.innerDiv}>
                    {getFormattedImage(classes, tempPlayers[FIRST_PLAYER_INDEX], props.allLoginCodes)} 
                    {getFormattedImage(classes, tempPlayers[SECOND_PLAYER_INDEX], props.allLoginCodes)}                    
                    {getFormattedImage(classes, tempPlayers[THIRD_PLAYER_INDEX], props.allLoginCodes)}                    
                </div>
            </div>
        </div>
    )
}

function getFormattedImage(classes, code, allLoginCodes) {
    
    let codeIndex = allLoginCodes.indexOf(code);
    
    return(
        <div className={classes.imageDiv}>
            <PlayerProfile player={codeIndex}/>
        </div>
    )
}

export default withStyles(styles)(VerticalPlayerGroup);