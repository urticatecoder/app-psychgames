import React from "react";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Variants } from "../util/constants/stylings/StylingsBundler";
import FadeIn from 'react-fade-in';

const ITALIC_FONT = "italic";

const GAME_TWO_PREFIX = "Game Two, Turn #";

const BLACK = "#282d36";
const GREEN = "#27961d";
const RED = "#fc3f3f";

const POSITIVE = "+";
const NEUTRAL = " ";

const ITEM_FONT_SIZE = 35;
const RESOURCE_FONT_SIZE = 35;

const DECIMAL_PLACES = 2;

const GAME_ONE = "Game One"
const GAME_ONE_DELAY = 1000;

const GAME_TWO_DELAY = 7000;

const TOKENS = ' Tokens ';

const AMOUNT_DELAY = 500;

const WON_GAME_ONE_TEXT = "Winning Player: ";
const LOST_GAME_ONE_TEXT = "Losing Player: ";

const INVEST = 'Invested';
const INVEST_DELAY = 9000;

const KEEP = 'Kept';
const KEEP_DELAY = 15000;
const KEEP_RATE = .10;

const COMPETE = 'Competed';
const COMPETE_DELAY = 21000;

const styles = {
    game: {
        position: 'relative',
        textAlign: 'left',
        marginLeft: '75px',
    },

    description: {
        position: 'relative',
        marginRight: '180px',
        textAlign: 'right'
    },

    amount: {
        position: 'relative',
        marginRight: '50px',
        marginTop: '-39px',
        textAlign: 'right',
    },

    resourceDescription: {
        position: 'relative',
        marginRight: '180px',
        textAlign: 'right',
    },

    resourceAmount: {
        position: 'relative',
        marginRight: '50px',
        marginTop: '-39px',
        textAlign: 'right',
    },

    gameOneFade: {
        position: 'relative',
        marginTop: '10px',
    },

    gameTwoFade: {
        position: 'relative',
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
            {getGameOne(props.gameOneResult, props.gameOneAmount, classes, props.windowHeight)}
            {getGameTwo(props.gameTwoTurn, classes, props.windowHeight)}
            {getGameTwoResource(props.investTokens, INVEST, props.investRate, props.investAmount, INVEST_DELAY, classes, props.windowHeight)}
            {getGameTwoResource(props.keepTokens, KEEP, KEEP_RATE, props.keepAmount, KEEP_DELAY, classes, props.windowHeight)}
            {getGameTwoResource(props.competeTokens, COMPETE, props.competeRate, props.competeAmount, COMPETE_DELAY, classes, props.windowHeight)}

        </div>
    );
}

function getGameOne(won, amount, classes, windowHeight) {

    let marginResource = getResourceMargin(windowHeight);
    let marginGame = getGameOneMargin(windowHeight);

    return (
        <div className={classes.gameOneFade}>

            <FadeIn delay={GAME_ONE_DELAY}>
                <span>
                    <Typography className={classes.game} style={{ marginTop: marginGame }} variant={Variants.NORMAL_TEXT}>
                        <Box fontStyle={ITALIC_FONT}>
                            {GAME_ONE}
                        </Box>
                    </Typography>
                </span>


                <div className={classes.description}>
                    <span>
                        <Typography style={{ fontSize: ITEM_FONT_SIZE, marginTop: marginResource }} variant={Variants.NORMAL_TEXT}>
                            <Box fontStyle={ITALIC_FONT}>
                                {getGameOneResultText(won)}
                            </Box>
                        </Typography>
                    </span>
                </div>

                <div className={classes.amount}>
                    <span>
                        <Typography variant={Variants.NORMAL_TEXT} style={{ fontSize: ITEM_FONT_SIZE, color: getColor(amount) }}>
                            {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                        </Typography>
                    </span>
                </div>
            </FadeIn>
        </div>
    );
}

function getGameOneResultText(won) {
    if (won) return WON_GAME_ONE_TEXT;
    else return LOST_GAME_ONE_TEXT;
}

function getGameTwo(turn, classes, windowHeight) {
    let margin = getGameTwoMargin(windowHeight);
    return (
        <FadeIn className={classes.gameTwoFade} delay={GAME_TWO_DELAY}>
            <Typography className={classes.game} style={{ marginTop: margin }} variant={Variants.NORMAL_TEXT}>
                <Box fontStyle={ITALIC_FONT}>
                    {GAME_TWO_PREFIX + turn}
                </Box>
            </Typography>
        </FadeIn>
    )
}

function getGameTwoResource(tokens, resource, rate, amount, delay, classes, windowHeight) {
    let marginTop = getGameTwoResourceMargin(windowHeight);

    return (
        <div>
            <FadeIn delay={delay}>
                <div className={classes.resourceDescription}>
                    <Typography style={{ fontSize: RESOURCE_FONT_SIZE, marginTop: marginTop }} variant={Variants.NORMAL_TEXT}>
                        <Box fontStyle={ITALIC_FONT}>
                            {tokens + TOKENS + resource + getRate(rate)}
                        </Box>
                    </Typography>
                </div>
            </FadeIn>
            <FadeIn delay={delay + AMOUNT_DELAY}>
                <div className={classes.resourceAmount}>
                    <Typography style={{ fontSize: ITEM_FONT_SIZE, color: getColor(amount) }} variant={Variants.NORMAL_TEXT}>
                        {getSign(amount) + amount.toFixed(DECIMAL_PLACES)}
                    </Typography>
                </div>
            </FadeIn>
        </div>
    )
}

function getRate(rate) {
    return ' @ ' + rate.toFixed(2) + 'x:';
}

function getSign(amount) {
    if (amount >= 0) return POSITIVE;
    else return NEUTRAL;
}

function getColor(amount) {
    if (amount > 0) return GREEN;
    if (amount < 0) return RED;
    else return BLACK;
}

function getGameOneMargin(windowHeight) {
    if (windowHeight >= 775) return '15px';
    else return '-15px';
}

function getGameTwoMargin(windowHeight) {
    if (windowHeight >= 775) return '15px';
    else return '0px';
}

function getResourceMargin(windowHeight) {
    if (windowHeight >= 775) return '13px';
    else return '5px';
}

function getGameTwoResourceMargin(windowHeight) {
    if (windowHeight >= 775) return '13px';
    else return '5px';
}

export default withStyles(styles)(Receipt);
