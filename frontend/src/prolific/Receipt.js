import React from "react";
import { Typography, Box } from "@material-ui/core";
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

const GAME_ONE = "Game One"
const GAME_TWO = "Game Two"

const TOKENS = ' Tokens '

const AMMOUNT_DELAY = 500;

const styles = {
  game: {
    position: 'relative',
    textAlign: 'center',
  },

  description: {
    position: 'relative',
    marginRight: '250px',
    marginTop: '10px',
    textAlign: 'right'
  },

  amount: {
    position: 'relative',
    marginRight: '8vw',
    marginTop: '-43px',
    textAlign: 'right',
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
            {getGameTwo(7, 7000, classes)}
            {getGameTwoResource(5, 'Keep', 2.5, 9000, classes)}
            {getGameTwoResource(0, 'Invest', 0, 16000, classes)}
            {getGameTwoResource(6, 'Compete', -3, 23000, classes)}

      </div>
  );
}

function getGameOne(text, amount, delay, classes) {
    return(
        <div className={classes.gameOneFade}>

        <FadeIn delay={delay}>
            <span>
                <Typography className={classes.game} variant={Variants.NORMAL_TEXT}>
                <Box fontStyle={ITALIC_FONT}>
                    {GAME_ONE}
                </Box>
                </Typography>
            </span>

               
            <div className={classes.description}>
            <span>
                 <Typography style={{fontSize: ITEM_FONT_SIZE}} variant={Variants.NORMAL_TEXT}>
                    <Box fontStyle={ITALIC_FONT}>
                        {text}
                    </Box>
                </Typography>
            </span>
            </div>

            <div className={classes.amount}>
            <span>
                <Typography variant={Variants.NORMAL_TEXT} style={{fontSize: ITEM_FONT_SIZE, color: getColor(amount)}}>
                    {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                </Typography>
                </span>
            </div>
        </FadeIn>
    </div>
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

function getGameTwoResource(tokens, resource, amount, delay, classes) {
    return(
        <div>
        <FadeIn delay={delay}>
            <div className={classes.description}>
                <Typography style={{fontSize: ITEM_FONT_SIZE}} variant={Variants.NORMAL_TEXT}>
                    <Box fontStyle={ITALIC_FONT}>
                        {tokens + TOKENS + getResourceVerb(resource)}
                    </Box>
                </Typography>
            </div>
        </FadeIn>
        <FadeIn delay={delay + AMMOUNT_DELAY}>
            <div className={classes.amount}>
                <Typography  style={{fontSize: ITEM_FONT_SIZE, color: getColor(amount)}} variant={Variants.NORMAL_TEXT}>
                    {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                </Typography>
            </div>
        </FadeIn>
        </div>
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
