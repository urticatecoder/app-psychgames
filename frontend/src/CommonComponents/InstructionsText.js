import React, {useState} from 'react';
import {Typography, withStyles} from '@material-ui/core';
import '../CommonStylings/FullScreenDiv.css'
import ContinueButton from './ContinueButton';

const styles = ({
    title: {
        marginLeft: '20%',
        marginRight: '20%',
    },
    instructions: {
        marginTop: '50px',
        marginLeft: '10%',
        marginRight: '10%',
    },
});

function InstructionsText(props) {
    const FULL_DIV = 'fullDiv';
    const DEFAULT_INSTRUCTIONS = '';
    const TITLE_VARIANT = 'h3';
    const INSTRUCTION_VARIANT = 'h5';
    const [instructions, setIntructions] = useState(DEFAULT_INSTRUCTIONS);

    const {classes} = props;
    
    fetch(props.file)
    .then((r) => r.text())
    .then(text  => {
      setIntructions(text)
    })

    return(
        <div>
            <Typography className={classes.title} variant={TITLE_VARIANT}>{props.title}</Typography>
            <Typography className={classes.instructions} variant={INSTRUCTION_VARIANT}>{instructions}</Typography>         
        </div>
    )
}

export default withStyles(styles)(InstructionsText);