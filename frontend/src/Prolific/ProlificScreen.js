
import React, {useState, useEffect} from 'react';
import {Typography, Box, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import '../CommonStylings/FullScreenDiv.css'
import axios from 'axios';
const FULL_DIV = 'fullDiv';

const DEFAULT_CODE = '';
const INSTRUCTIONS_MESSAGE = 'Prolific Code: ';
const PAYOUT_MESSAGE = 'Final payout: $'
const THANK_YOU_MESSAGE = "Thank you for participating!"
const CODE_VARIANT = 'h3';
const THANKS_VARIANT = 'h2';
const PAYOUT_VARIANT = 'h3'
const DEFAULT_AMOUNT = '10.50';

const PROLIFIC_CODE_ID = 'prolificCode';

const styles = {
    prolificText: {
        marginTop: '140px',
    },
    payoutText: {
        marginTop: '30px',
    },
    thankYouText: {
        marginTop: '100px',
    },
}

function ProlificScreen(props) {

    const {classes} = props;
    const [prolificCode, setProlificCode] = useState(DEFAULT_CODE);
    const [payoutAmount, setPayoutAmount] = useState(DEFAULT_AMOUNT)
    
    
    useEffect(() => {
        console.log("CODE")
        console.log(props.code)
        axios.get('/verification-code', {
            params: {
                loginCode: props.code
            }
        }).then(res => {
            console.log(res)
            setProlificCode(res.data.code)
        }).catch(err => console.log(err));      
    }, [prolificCode]);

    return(
        <div className={FULL_DIV}>
            <Typography className={classes.thankYouText} variant={THANKS_VARIANT}>{THANK_YOU_MESSAGE}</Typography>
            <Typography id={PROLIFIC_CODE_ID} className={classes.prolificText} variant={CODE_VARIANT}>{INSTRUCTIONS_MESSAGE + prolificCode}</Typography>
            <Typography className={classes.payoutText} variant={PAYOUT_VARIANT}>{PAYOUT_MESSAGE + payoutAmount} </Typography>
        </div>
    )
}

export default withStyles(styles)(ProlificScreen);