import React from 'react';
import {Typography, withStyles} from '@material-ui/core';

const GROUP = "Group ";
const GROUP_ONE = 'One'
const GROUP_ONE_COLOR = "#FF9133"
const GROUP_TWO_COLOR = "#9933FF"

const styles = {
    groupBox: {
        borderRadius: '50px',
        backgroundColor: '#FF9133',
        opacity: '.8',
        height: '55px',
        margin: 'auto',
    },
    innerDiv: {
        position: 'relative',
        top: '15%'
    }
}
function GroupBox(props) {
    const {classes} = props
    let groupColor = (props.groupNumber == GROUP_ONE) ? GROUP_ONE_COLOR : GROUP_TWO_COLOR
    return (
        <div style={{backgroundColor: groupColor, width: props.width}} className={classes.groupBox}>
            <div className={classes.innerDiv} >
            <Typography className={classes.innerDiv}  variant='h4'> {GROUP} {props.groupNumber} </Typography>
            </div>
        </div>
    )
}

export default withStyles(styles)(GroupBox);