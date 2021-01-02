import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core";
import CountUp from 'react-countup';
import FadeIn from 'react-fade-in';

const WON_GAME_ONE = true;
const LOST_GAME_ONE = false;
const INITIAL_PAYOUT = 0.00;
const ANIMATION_DURATION = 4.5;
const NUM_DECIMALS = 2;
const DECIMAL = ".";
const PREFIX = "$";

const NO_GAME_ONE_BONUS = 0.00;
const GAME_ONE_BONUS = 3.00;
const GAME_ONE_PAUSE = 2000;

const KEEP_TOKENS = 5;
const KEEP_INCREASE = .50;
const KEEP_PAUSE = 9000;

const INVEST_TOKENS = 0;
const INVEST_INCREASE = .50;
const INVEST_PAUSE = 16000;

const COMPETE_TOKENS = 6;
const COMPETE_REDUCTION = -.50;
const COMPETE_PAUSE = 23000;

const BLACK = "#282d36";
const GREEN = "#27961d";
const RED = "#fc3f3f";

const FINAL_PAUSE = 35000;


const styles = {
  countUp: {
      fontSize: 100,
  },
};

/**
 * Animated numbers showing the payout.
 *
 * @author Eric Doppelt
 */
function PayoutCount(props) {
  const { classes } = props;

  const [gameOne, setGameOne] = useState(WON_GAME_ONE);

  const [lastPayout, setLastPayout] = useState(INITIAL_PAYOUT);
  const [newPayout, setNewPayout] = useState(INITIAL_PAYOUT);
  const [textColor, setTextColor] = useState(BLACK);

  const AFTER_GAME_ONE = (gameOne) ? GAME_ONE_BONUS : NO_GAME_ONE_BONUS;
  const AFTER_KEEP = KEEP_TOKENS * KEEP_INCREASE + AFTER_GAME_ONE;
  const AFTER_INVEST = INVEST_TOKENS * INVEST_INCREASE + AFTER_KEEP;
  const AFTER_COMPETE = COMPETE_TOKENS * COMPETE_REDUCTION + AFTER_INVEST;
  
  useEffect(() => {

    setTimeout(() => {
        console.log('GAME ONE');
        updateTextColor(lastPayout, AFTER_GAME_ONE, setTextColor);
        setNewPayout(AFTER_GAME_ONE);
    }, GAME_ONE_PAUSE);

    setTimeout(() => {
        console.log('KEEP');
        updateTextColor(AFTER_GAME_ONE, AFTER_KEEP, setTextColor);
        setLastPayout(AFTER_GAME_ONE);
        setNewPayout(AFTER_KEEP);
    }, KEEP_PAUSE);

    setTimeout(() => {
        console.log('INVEST');
        updateTextColor(AFTER_KEEP, AFTER_INVEST, setTextColor);
        setLastPayout(AFTER_KEEP);
        setNewPayout(AFTER_INVEST);
    }, INVEST_PAUSE);

    setTimeout(() => {
        console.log('COMPETE');
        updateTextColor(AFTER_INVEST, AFTER_COMPETE, setTextColor);
        setLastPayout(AFTER_INVEST);
        setNewPayout(AFTER_COMPETE);
    }, COMPETE_PAUSE);

    setTimeout(() => {
        console.log('FINAL');
        setTextColor(GREEN);
        setLastPayout(AFTER_COMPETE);
        setNewPayout(AFTER_COMPETE);
    }, FINAL_PAUSE);

}, []);

  return (
        <CountUp
            start={lastPayout}
            end={newPayout}
            duration={ANIMATION_DURATION}
            decimals={NUM_DECIMALS}
            decimal={DECIMAL}
            prefix={PREFIX}
            >
            {({countUpRef}) => (
                <div>
                <span className={classes.countUp} style={{color: textColor}} ref={countUpRef} />                
                </div>
            )}
        </CountUp>
  );
}

function updateTextColor(last, curr, setColor) {
    let diff = curr - last;
    console.log(diff);
    if (diff > 0) setColor(GREEN);
    else if (diff < 0) setColor(RED);
    else setColor(BLACK);
}

export default withStyles(styles)(PayoutCount);
