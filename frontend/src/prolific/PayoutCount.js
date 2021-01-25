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

const GAME_ONE_PAUSE = 2000;

const KEEP_PAUSE = 15000;

const INVEST_PAUSE = 9000;

const COMPETE_PAUSE = 21000;

const BLACK = "#282d36";
const GREEN = "#27961d";
const RED = "#fc3f3f";

const FINAL_PAUSE = 27000;

const BASE_PAYOUT = 0.00;

const READIED_DELAYS = true;
const HAVENT_READIED_DELAYS = false;

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

  const [lastPayout, setLastPayout] = useState(INITIAL_PAYOUT);
  const [newPayout, setNewPayout] = useState(INITIAL_PAYOUT);
  const [textColor, setTextColor] = useState(BLACK);
  
  const [readiedDelays, setReadiedDelay] = useState(HAVENT_READIED_DELAYS);

  
  useEffect(() => {

    if (props.recievedResults && !readiedDelays) {

        console.log('DATA IM WORKING WITH');
        console.log(props.gameOneAmount);
        console.log(props.investAmount);
        console.log(props.keepAmount);
        console.log(props.competeAmount);
        
        const AFTER_GAME_ONE = props.gameOneAmount;
        const AFTER_INVEST = AFTER_GAME_ONE + props.investAmount;
        const AFTER_KEEP = AFTER_INVEST + props.keepAmount;
        const AFTER_COMPETE = AFTER_KEEP + props.competeAmount;
        console.log('HIYA');
        console.log('AFTER GAME ONE');
        console.log(AFTER_GAME_ONE);

        setTimeout(() => {
            console.log('GAME ONE');
            updateTextColor(lastPayout, AFTER_GAME_ONE, setTextColor);
            setNewPayout(AFTER_GAME_ONE);
        }, GAME_ONE_PAUSE);

        console.log('AFTER INVEST');
        console.log(AFTER_INVEST);
        console.log(props.investAmount);
        setTimeout(() => {
            console.log('INVEST');
            updateTextColor(AFTER_GAME_ONE, AFTER_INVEST, setTextColor);
            setLastPayout(AFTER_GAME_ONE);
            setNewPayout(AFTER_INVEST);
        }, INVEST_PAUSE);


        console.log('AFTER KEEP');
        console.log(AFTER_KEEP);
        console.log(props.keepAmount);
        setTimeout(() => {
            console.log('KEEP');
            updateTextColor(AFTER_INVEST, AFTER_KEEP, setTextColor);
            setLastPayout(AFTER_INVEST);
            setNewPayout(AFTER_KEEP);
        }, KEEP_PAUSE);

        console.log('AFTER COMPETE');
        console.log(AFTER_COMPETE);
        console.log(props.competeAmount);
        setTimeout(() => {
            console.log('COMPETE');
            updateTextColor(AFTER_KEEP, AFTER_COMPETE, setTextColor);
            setLastPayout(AFTER_KEEP);
            setNewPayout(AFTER_COMPETE);
        }, COMPETE_PAUSE);

        
        setTimeout(() => {
            console.log('FINAL');
            setTextColor(GREEN);
            var finalPayout = (AFTER_COMPETE < 0) ? BASE_PAYOUT : AFTER_COMPETE;
            setLastPayout(finalPayout);
            setNewPayout(finalPayout);
        }, FINAL_PAUSE);

        setReadiedDelay(READIED_DELAYS);
        }
    });

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
