import React, {useState} from 'react';
import {Typography, withStyles} from '@material-ui/core';
import '../CommonStylings/FullScreenDiv.css'
import ContinueButton from './ContinueButton';

const styles = ({
    title: {
        marginTop: '25%',
    },
    instructions: {
        marginTop: '7%',
        marginLeft: '10%',
        marginRight: '10%',
    },
});

function InstructionsScreen(props) {
    const FULL_DIV = 'fullDiv';
    const DEFAULT_INSTRUCTIONS = 'Loading Instructions...';
    const TITLE_VARIANT = 'h3';
    const [instructions, setIntructions] = useState(DEFAULT_INSTRUCTIONS);

    const {classes} = props;
    fetch(props.file)
    .then((r) => r.text())
    .then(text  => {
      setIntructions(text)
    })

    return(
        <div className = {FULL_DIV}>
            <div>
            <Typography className={classes.title} variant={TITLE_VARIANT}>{props.title}</Typography>
            <Typography className={classes.instructions}>{instructions}</Typography>         
            </div>   
        </div>
    )
}

export default withStyles(styles)(InstructionsScreen);