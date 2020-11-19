import React from 'react';
import '../../CommonStylings/FullScreenDiv.css'
import ContinueButton from '../../CommonComponents/ContinueButton';
import InstructionsText from '../../CommonComponents/InstructionsText';
import {withStyles} from '@material-ui/core';

const FULL_DIV = 'fullDiv';

const styles = ({
    instructions: {
        marginTop: '100px',
        marginLeft: '10%',
        marginRight: '10%',
    },
    button: {
        marginTop: '50px',
        marginLeft: '10%',
        marginRight: '10%',
    },
});

function Welcome(props) {
    const {classes} = props;

    return(
        <div className = {FULL_DIV}>
            <div className={classes.instructions}>
                <InstructionsText
                    file={props.file}
                    title={props.title}
                />
            </div>
            <div className={classes.button}>
                <ContinueButton route={props.route}/>
            </div>
        </div>
    )
}

export default withStyles(styles)(Welcome);