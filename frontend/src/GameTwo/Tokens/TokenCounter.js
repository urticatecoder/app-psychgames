import { withStyles } from '@material-ui/core';
import React from 'react';
import Token from '../Tokens/token.png'

const IMAGE_HEIGHT = '75vh'
const IMAGE_WIDTH = '75vh'

const TOKENS_LABEL = "Tokens Left: "
const styles = ({
    fullCounter: {
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
    }
  });

  
function TokenCounter(props) { 

    const {classes} = props;

    return (
        <div className={classes.fullCounter}>
          {getTokenIcon()}
          {TOKENS_LABEL + props.tokens}
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

