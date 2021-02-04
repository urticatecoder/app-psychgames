import { Typography, withStyles } from "@material-ui/core";
import React from "react";
import Variants from "../../util/common_constants/stylings/Variants";

const INVEST_ODDS_LABEL = "Invest Odds: ";
const COMPETE_ODDS_LABEL = "Compete Odds: ";
const LARGE_WINDOW = 1300;
const LARGE_FONT = '20px';
const SMALL_FONT = '17px';

const styles = {
  fullDiv: {
    position: 'absolute',
    top: '25px',
    left: '43vw',
    backgroundColor: '#a83297',
    height: '85px',
    width: '15vw',
    opacity: '.8',
    borderRadius: '20px',
    alignItems: 'center',
    verticalAlign: 'middle',
  },
  investText: {
    position: "relative",
    top: "2.5vh",
    alignItems: "center",
    verticalAlign: "middle",
  },
  competeText: {
    position: "relative",
    top: "3vh",
    alignItems: "center",
    verticalAlign: "middle",
  },
};

/**
 * Component used to visualize the payout odds given by the backend on each turn in Game Two.
 * These are displayed as simple doubles such that the odds represent the multiples for each turn described in the Game Two tutorial.
 * @param {*} props tells what the invest and compete odds are for a given turn.
 *
 * @author Eric Doppelt
 */
function PayoutOdds(props) {
  const { classes } = props;
  let font = getFontSize(props.windowWidth);
  return (
    <div className={classes.fullDiv}>
      <Typography className={classes.investText} style={{fontSize: font}} variant={Variants.LARGE_TEXT}>
        {INVEST_ODDS_LABEL + props.investOdds}
      </Typography>
      <Typography className={classes.competeText} style={{fontSize: font}} variant={Variants.LARGE_TEXT}>
        {COMPETE_ODDS_LABEL + props.competeOdds}
      </Typography>
    </div>
  );
}

// FIXME: duplicated code with resource resutls
function getFontSize(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_FONT;
  else return SMALL_FONT;
}


export default withStyles(styles)(PayoutOdds);
