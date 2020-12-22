import { Typography, withStyles } from "@material-ui/core";
import React from "react";

const INVEST_ODDS_LABEL = "Invest Odds: ";
const COMPETE_ODDS_LABEL = "Compete Odds: ";

const styles = {
  fullDiv: {
    position: "absolute",
    top: "9vh",
    left: "5vw",
    backgroundColor: "#fffecf",
    height: "10vh",
    width: "15vw",
    opacity: ".8",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
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

  return (
    <div className={classes.fullDiv}>
      <Typography className={classes.investText}>
        {INVEST_ODDS_LABEL + props.investOdds}
      </Typography>
      <Typography className={classes.competeText}>
        {COMPETE_ODDS_LABEL + props.competeOdds}
      </Typography>
    </div>
  );
}

export default withStyles(styles)(PayoutOdds);
