import React from "react";
import { withStyles } from "@material-ui/core";
import MovingComponent from 'react-moving-text';

const SINGLE = "Single";
const DOUBLE = "Double ";
const TRIPLE = "Triple ";
const BONUS = "Bonus!";

const SINGLE_BONUS_COLOR = "#f26b78"
const SINGLE_BONUS_TEXT_COLOR = "#d4d4d4"
const DOUBLE_BONUS_COLOR = "#fca103";
const DOUBLE_BONUS_TEXT_COLOR = "#242424";
const TRIPLE_BONUS_COLOR = "#0010f5";
const TRIPLE_BONUS_TEXT_COLOR = "#d4d4d4";

const LARGE_WIDTH_THRESHOLD = 1550;
const MEDIUM_WIDTH_THRESHOLD = 1150;
const styles = {
  mainDiv: {
    marginTop: "-72px",
    position: "absolute",
    top: "30vh",
    left: "5vw",
    backgroundColor: "#349eeb",
    height: "100px",
    opacity: ".75",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
    fontSize: 35,
  },
};

/**
 * Component that allows the submission of choices in Game One.
 * Handles the web socket call and sends choices passed in as props from Game One.
 * @param {*} props tell the choices to send in the web socket call.
 * 
 * @author Eric Doppelt
 */

function BonusShower(props) {
  const { classes } = props;

  let isDoubleBonus = (props.bonus == 'double');
  let backgroundColor = SINGLE_BONUS_COLOR;
  let textColor = SINGLE_BONUS_TEXT_COLOR;

  let bonusText = 'single';
  if (props.bonus == 'single') {
    bonusText = SINGLE;
    backgroundColor = SINGLE_BONUS_COLOR;
    textColor = SINGLE_BONUS_TEXT_COLOR;
  } else if (props.bonus == 'double') {
    bonusText = DOUBLE;
    backgroundColor = DOUBLE_BONUS_COLOR;
    textColor = DOUBLE_BONUS_TEXT_COLOR;
  } else {
    bonusText = TRIPLE;
    backgroundColor = TRIPLE_BONUS_COLOR;
    textColor = TRIPLE_BONUS_TEXT_COLOR;
  }

  // let bonusText = (isDoubleBonus) ? DOUBLE : TRIPLE;
  // let backgroundColor = (isDoubleBonus) ? DOUBLE_BONUS_COLOR : TRIPLE_BONUS_COLOR;
  // let textColor = (isDoubleBonus) ? DOUBLE_BONUS_TEXT_COLOR : TRIPLE_BONUS_TEXT_COLOR;
  let width = getWidth(props.windowWidth);
  let marginLeft = getMarginLeft(props.windowWidth);

  if (props.open) {
    return (
        <div className={classes.mainDiv} style={{backgroundColor: backgroundColor, color: textColor, width: width, marginLeft: marginLeft}}>
            <div style={{marginTop: '8px'}}>
            <MovingComponent
            type="popIn"
            duration="2000ms"
            delay="0s"
            direction="normal"
            timing="ease"
            iteration="4"
            fillMode="none">
            {bonusText}
            <br/>
            {BONUS}
            </MovingComponent>
        </div>
        </div>
    );
  } else return null;
}

function getWidth(windowWidth) {
    if (windowWidth >= LARGE_WIDTH_THRESHOLD) return '200px';
    else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return '180px';
    else return '160px';
  }
  
  function getMarginLeft(windowWidth) {
    if (windowWidth >= LARGE_WIDTH_THRESHOLD) return '5vw';
    else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return '2.5vw';
    else return '0px';
  }

export default withStyles(styles)(BonusShower);
