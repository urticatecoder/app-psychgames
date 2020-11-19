import { Typography, withStyles } from '@material-ui/core';
import React from 'react';

const INVEST_ODDS_LABEL = "Invest Odds: "
const COMPETE_ODDS_LABEL = "Compete Odds: "

const styles = ({
    fullDiv: {
      position: 'absolute',
      top: '9vh',
      left: '5vw',
      backgroundColor: '#fffecf',
      height: '10vh',
      width: '15vw',
      opacity: '.8',
      borderRadius: '20px',
      alignItems: 'center',
      verticalAlign: 'middle',
    },
    investText: {
      position: 'relative',
      top: '2.5vh',        
      alignItems: 'center',
      verticalAlign: 'middle',
    },
    competeText: {
      position: 'relative',
      top: '3vh',
      alignItems: 'center',
      verticalAlign: 'middle',
    }
  });

  
function TokenCounter(props) { 

    const {classes} = props;

    return (
      <div className={classes.fullDiv}>
        <Typography className={classes.investText}> {INVEST_ODDS_LABEL + props.investOdds} </Typography>
        <Typography className={classes.competeText}> {COMPETE_ODDS_LABEL + props.competeOdds} </Typography>
      </div>
    )
}

export default withStyles(styles)(TokenCounter);

