import { withStyles } from '@material-ui/core';
import React from 'react';
import Token from './money-bag.png'

const IMAGE_HEIGHT = '45vh'
const IMAGE_WIDTH = '45vh'
const TOKEN_ALT = 'Token Counter'

const TOKENS_LABEL = "Tokens Left: "
const styles = ({
    fullDiv: {
      position: 'absolute',
      top: '9vh',
      left: '53.5vw',
      backgroundColor: '#a83297',
      height: '10vh',
      width: '15vw',
      opacity: '.8',
      borderRadius: '20px',
      alignItems: 'center',
      verticalAlign: 'middle',
    },
    tokenIcon: {
      position: 'relative',
      top: '1vh',
    },
    tokenText: {
      position: 'relative',
      top: '1.5vh',
      alignItems: 'center',
      verticalAlign: 'middle',
    }
  });

  
/**
 * Component used to visualize the number of tokens a player has during a round of Game Two.
 * @param {*} props tells how many tokens a player has at the moment.
 * 
 * @author Eric Doppelt
 */
function TokenCounter(props) { 

    const {classes} = props;

    return (
      <div className={classes.fullDiv}>
        <div className={classes.tokenIcon}>
          {getTokenIcon()}
        </div>
        <div className={classes.tokenText}>
          {TOKENS_LABEL + props.tokens}
        </div>
      </div>
    )
}

function getTokenIcon() {
  return (
      <img
        src={Token}
        alt={TOKEN_ALT}
        width={IMAGE_HEIGHT}
        height={IMAGE_WIDTH}
        />
  )
}

export default withStyles(styles)(TokenCounter);

