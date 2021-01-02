import React, { useState } from "react";
import { Typography, Box, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";
import FadeIn from 'react-fade-in';

const ITALIC_FONT = "italic";

const GAME_TWO_PREFIX = "Game Two, Turn #";

const BLACK = "#282d36";
const GREEN = "#27961d";
const RED = "#fc3f3f";

const POSITIVE = "+";
const NEUTRAL = " ";

const ITEM_FONT_SIZE = 38;

const DECIMAL_PLACES = 2;

const GAME_ONE_HEIGHT_OFFSET = '20px';
const GAME_TWO_HEIGHT_OFFSET = '60px';

const GAME_ONE = "Game One"
const GAME_TWO = "Game Two"

const TOKENS = ' Tokens '

const styles = {
  game: {
    position: 'absolute',
    left: '5vw',
  },

  description: {
    position: 'relative',
    marginRight: '300px',
    marginTop: '80px',
    background: '#000000'
  },

  amount: {
    position: 'relative',
    marginRight: '1vw',
    marginTop: '-43px',
    background: '#ffffff'
  },

  

  gameOneFade: {
    position: 'relative',
    marginTop: '1vh',
  },

  gameTwoFade: {
    position: 'relative',
    marginTop: '3vh',
  }
};

/**
 * Screen shown at the end of the game for users, telling them their total compensation and providing a code used to get paid on the Prolific site.
 * This is the last screen in the UI.
 * @param {*} props is used to provide to tell the component the player's login code.
 *
 * @author Eric Doppelt
 */
function Receipt(props) {
  const { classes } = props;

  return (
      <div>
            {getGameOne('Winning Player:', 3.00, 1000, classes, 0)}
            {getGameTwo(7, 5000, classes)}
            {getGameTwoResource(5, 'Keep', 50, classes)}
      </div>
  );
}

function getGameOne(text, amount, delay, classes) {
    return(
        <FadeIn className={classes.gameOneFade} delay={delay}>
            <Typography className={classes.game} variant={Variants.NORMAL_TEXT}>
                <Box fontStyle={ITALIC_FONT}>
                    {GAME_ONE}
                </Box>
            </Typography>

            <div style={{position: 'relative', marginTop: GAME_ONE_HEIGHT_OFFSET}}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    >

                    <Grid item>
                        <Typography className={classes.description} style={{marginTop: '80px', fontSize: ITEM_FONT_SIZE}} variant={Variants.NORMAL_TEXT}>
                            <Box fontStyle={ITALIC_FONT}>
                                {text}
                            </Box>
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography className={classes.amount} variant={Variants.NORMAL_TEXT} style={{marginTop: '80px', fontSize: ITEM_FONT_SIZE, color: getColor(amount)}}>
                            {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                        </Typography>
                    </Grid>

                </Grid>
            </div>
        </FadeIn>
    );
}

function getGameTwo(turn, delay, classes) {
    return(
        <FadeIn className={classes.gameTwoFade} delay={delay}>
            <Typography className={classes.game} variant={Variants.NORMAL_TEXT}>
                <Box fontStyle={ITALIC_FONT}>
                    {GAME_TWO_PREFIX + turn}
                </Box>
            </Typography>
        </FadeIn>
    )
}

function getGameTwoResource(tokens, resource, amount, classes) {
    return(
        <FadeIn>
            <div className={classes.description}>
                <Typography style={{fontSize: ITEM_FONT_SIZE}} variant={Variants.NORMAL_TEXT}>
                    <Box fontStyle={ITALIC_FONT}>
                        {tokens + TOKENS + getResourceVerb(resource)}
                    </Box>
                </Typography>
            </div>

            <div className={classes.amount}>
                <Typography  style={{fontSize: ITEM_FONT_SIZE, color: getColor(amount)}} variant={Variants.NORMAL_TEXT}>
                    {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                </Typography>
            </div>
        </FadeIn>
    )
}

function getResourceVerb(resource) {
    if (resource == 'keep' || resource == 'Keep') return 'Kept:';
    else if (resource == 'compete' || resource == 'Compete') return 'Competed:';
    else return 'Invested:';
}

// function getTurnInfo(turn, delay, classes, pos) {
   
//     return(
//         <div style={{position: 'relative', top: pos * HEIGHT_OFFSET + 'px'}}>
//             <FadeIn delay={delay}>
//             <Typography className={classes.description} variant={Variants.NORMAL_TEXT}>
//                 <Box fontStyle={ITALIC_FONT}>
//                     {GAME_TWO_PREFIX + turn}
//                 </Box>
//             </Typography>
//             </FadeIn>
//         </div>
//     )
// }

function getSign(amount) {
    if (amount > 0) return POSITIVE;
    else return NEUTRAL;
}

function getColor(amount) {
    if (amount > 0) return GREEN;
    if (amount < 0) return RED;
    else return BLACK;
}

export default withStyles(styles)(Receipt);
