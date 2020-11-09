import { Typography, withStyles } from '@material-ui/core';
import React from 'react';
import Token from '../Tokens/money-bag.png'

const IMAGE_HEIGHT = '45vh'
const IMAGE_WIDTH = '45vh'

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
      position: 'absolute',
      top: '2vh',
      left: '5.8vh'
    },
    competeText: {
      position: 'absolute',
      top: '5vh',
      left: '4.5vh'

    //   alignItems: 'center',
    //   verticalAlign: 'middle',
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

function getTokenIcon() {
  return (
      <img
        src={Token}
        width={IMAGE_HEIGHT}
        height={IMAGE_WIDTH}
        />
  )
}

export default withStyles(styles)(TokenCounter);

