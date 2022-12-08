import React, {useState, useEffect} from "react";
import { withStyles, Typography } from "@material-ui/core";
import CountUp from 'react-countup';
import FadeIn from 'react-fade-in';

const WON_GAME_ONE = true;
const LOST_GAME_ONE = false;
const INITIAL_PAYOUT = 0.00;
const ANIMATION_DURATION = 4.5;
const NUM_DECIMALS = 2;
const DECIMAL = ".";
const PREFIX = "$";

const GAME_ONE_PAUSE = 3000;

const GAME_TWO_PAUSE = 8000;

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
        console.log("state in payout count: ", props.currentState);
        if (props.recievedResults && !readiedDelays) {
            var AFTER_GAME_ONE = 0;
            if (props.isGameOneWinner) {
                AFTER_GAME_ONE = 3;
            }
            console.log("net money: ", props.currentState.playerResults.netMoney);
            var AFTER_GAME_TWO = AFTER_GAME_ONE + Number.parseFloat(props.currentState.playerResults.netMoney);
            console.log("after game two: ", AFTER_GAME_TWO);
            setTimeout(() => {
                console.log("animate after game two");
                updateTextColor(lastPayout, AFTER_GAME_ONE, setTextColor);
                setNewPayout(AFTER_GAME_ONE);
            }, GAME_ONE_PAUSE);
            setTimeout(() => {
                updateTextColor(AFTER_GAME_ONE, AFTER_GAME_TWO, setTextColor);
                setLastPayout(AFTER_GAME_ONE);
                setNewPayout(AFTER_GAME_TWO);
            }, GAME_TWO_PAUSE);
            setReadiedDelay(READIED_DELAYS);
        }
    }, [props.currentState]);


  return (
      <div>
        <CountUp
            start={lastPayout}
            end={newPayout}
            duration={ANIMATION_DURATION}
            decimals={NUM_DECIMALS}
            decimal={DECIMAL}
            prefix={PREFIX}
            >
            {({countUpRef}) => (
                <span className={classes.countUp} style={{color: textColor}} ref={countUpRef} />          
            )}
        </CountUp>
    </div>
  );
}

function updateTextColor(last, curr, setColor) {
    let diff = curr - last;
    if (diff > 0) setColor(GREEN);
    else if (diff < 0) setColor(RED);
    else setColor(BLACK);
}

export default withStyles(styles)(PayoutCount);
