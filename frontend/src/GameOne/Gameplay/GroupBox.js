import React from 'react';
import {Typography, withStyles} from '@material-ui/core';

const GROUP = "Group ";
const GROUP_ONE = 'One'
const GROUP_ONE_COLOR = "#FF9133"
const GROUP_TWO_COLOR = "#9933FF"

const styles = {
    groupBox: {
        borderRadius: '20px',
        backgroundColor: '#FF9133',
        opacity: '80%',
        width: '60vw',
        height: '3vw',
        margin: 'auto'
    }
}
function GroupBox(props) {
    const {classes} = props
    console.log(props.groupNumber)
    console.log(props.groupNumber == GROUP_ONE)
    let groupColor = (props.groupNumber == GROUP_ONE) ? GROUP_ONE_COLOR : GROUP_TWO_COLOR
    
    return (
        <div style={{backgroundColor: groupColor}} className={classes.groupBox}>
            <Typography variant='h4'> {GROUP} {props.groupNumber} </Typography>
        </div>
    )
}

export default withStyles(styles)(GroupBox);