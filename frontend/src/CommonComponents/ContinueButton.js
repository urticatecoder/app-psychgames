
import React from 'react';
import {Button} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';


const BUTTON_MESSAGE = 'Continue';

const styles = ({
    continueButton: {        
        width: '200px',
        height: '50px',
    },
});

function ContinueButton(props) {

    const {classes} = props;

    return(
        
        <div>
            <Button
                className = {classes.continueButton}
                variant="contained" 
                color= {"primary"}
                onClick={() => props.history.push(props.route)}
                >
                {BUTTON_MESSAGE}
            </Button>
        </div>
    )
}

export default withStyles(styles)(withRouter(ContinueButton));