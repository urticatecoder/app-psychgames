import { Box, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import Token from './tokens.png'
import Variants from "../../util/constants/stylings/Variants";

const IMAGE_HEIGHT = '45vh';
const IMAGE_WIDTH = '45vh';
const TOKEN_ALT = 'Token Counter';

const TOKENS_LABEL = "Tokens Left: ";
const LARGE_WINDOW = 1300;
const LARGE_FONT = '20px';
const SMALL_FONT = '17px';

const ITALIC_FONT = "italic"
const BOLD_FONT = "fontWeightBold"

const styles = ({
    fullDiv: {
      position: 'absolute',
      top: '25px',
      left: '62vw',
      backgroundColor: '#0066ff',
      height: '85px',
      width: '15vw',
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
      top: '1vh',
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
          <Typography style={{fontSize: getFontSize(props.windowWidth)}} variant={Variants.LARGE_TEXT}>
            <Box fontStyle={ITALIC_FONT} fontWeight={BOLD_FONT}>
              {TOKENS_LABEL + props.tokens}
            </Box>
          </Typography>
        </div>
      </div>
    )
}

// FIXME: duplicated code with resource resutls
function getFontSize(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_FONT;
  else return SMALL_FONT;
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

