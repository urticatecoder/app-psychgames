import { Box, Typography, withStyles } from "@material-ui/core";
import React from "react";
import Variants from "../../util/constants/stylings/Variants";

const INVEST_ODDS_LABEL = "Invest Payoffs: ";
const COMPETE_ODDS_LABEL = "Compete Payoffs: ";
const LARGE_WINDOW = 1300;
const MEDIUM_WINDOW = 1050;
const LARGE_FONT = "20px";
const LARGE_MEDIUM_FONT = "18px";
const MEDIUM_FONT = "17px";
const SMALL_FONT = "16px";
const ITALIC_FONT = "italic";
const BOLD_FONT = "fontWeightBold";

const styles = {
  fullDiv: {
    position: "absolute",
    top: "25px",
    left: "43vw",
    backgroundColor: "#0066ff",
    height: "85px",
    width: "18vw",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  investText: {
    position: "relative",
    alignItems: "center",
    verticalAlign: "middle",
  },
  competeText: {
    position: "relative",
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
  let marginTop = getMarginTop(props.windowWidth);
  let secondMarginTop = getSecondMarginTop(props.windowWidth);

  return (
    <div className={classes.fullDiv}>
      <Typography
        className={classes.investText}
        style={{ fontSize: font, top: marginTop }}
        variant={Variants.LARGE_TEXT}
      >
        <Box fontStyle={ITALIC_FONT} fontWeight={BOLD_FONT}>
          {INVEST_ODDS_LABEL + props.investOdds}
        </Box>
      </Typography>
      <Typography
        className={classes.competeText}
        style={{ fontSize: font, marginTop: secondMarginTop }}
        variant={Variants.LARGE_TEXT}
      >
        <Box fontStyle={ITALIC_FONT} fontWeight={BOLD_FONT}>
          {COMPETE_ODDS_LABEL + props.competeOdds}
        </Box>
      </Typography>
    </div>
  );
}

// FIXME: duplicated code with resource resutls
function getFontSize(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_FONT;
  else if (windowWidth >= 1200) return LARGE_MEDIUM_FONT;
  else if (windowWidth >= MEDIUM_WINDOW) return MEDIUM_FONT;
  else if (windowWidth >= 1000) return SMALL_FONT;
  else return "15px";
}

function getMarginTop(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return "17px";
  else if (windowWidth >= 1200) return "18px";
  else if (windowWidth >= MEDIUM_WINDOW) return "21px";
  else if (windowWidth >= 1000) return "19px";
  else return "22.5px";
}

function getSecondMarginTop(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return "21px";
  else if (windowWidth >= 1200) return "23px";
  else if (windowWidth >= MEDIUM_WINDOW) return "25px";
  else if (windowWidth >= 1000) return "30px";
  else return "27.5px";
}

export default withStyles(styles)(PayoutOdds);
