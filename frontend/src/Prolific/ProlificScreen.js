
import React, {useState, useEffect} from 'react';
import {Typography, Box, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import '../CommonStylings/FullScreenDiv.css'
import axios from 'axios';
const FULL_DIV = 'fullDiv';

const DEFAULT_CODE = '';
const INSTRUCTIONS_MESSAGE = 'Please enter the following code into Prolific to get paid: ';
const THANK_YOU_MESSAGE = "Thank you for participating!"
const CODE_VARIANT = 'h3';
const THANKS_VARIANT = 'h3';

const styles = {
    prolificText: {
        marginTop: '150px',
    },
    thankYouText: {
        marginTop: '10px',
    },
}

function ProlificScreen(props) {

    const {classes} = props;
    const [prolificCode, setProlificCode] = useState(DEFAULT_CODE);

    useEffect(() => {
        axios.get('/verification-code').then(res => {
            console.log(res);
            this.setState({ data: res.data}, () => {
                setTimeout(() => {
                    this.gameOneDataLink.current.link.click();
                }, 0);
            })
        }).catch(err => console.log(err));      
    }, [prolificCode]);

    return(
        <div className={FULL_DIV}>
            <Typography className={classes.prolificText} variant={CODE_VARIANT}>{INSTRUCTIONS_MESSAGE + prolificCode}</Typography>
            <Typography className={classes.thankYouText} variant={THANKS_VARIANT}>{THANK_YOU_MESSAGE}</Typography>
        </div>
    )
}

export default withStyles(styles)(ProlificScreen);