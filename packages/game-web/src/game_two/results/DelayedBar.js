import React, { useState } from "react";
import { withStyles } from "@material-ui/core";
import { useSpring, animated } from "react-spring";
import getBackgroundColor from "../../util/common_functions/getResourceBackgroundColor";

const INITIAL_HEIGHT = 0;
const COLON_SPACE = ": ";

const KEEP = "keep";
const INVEST = "invest";
const COMPETE = "compete";

const HEIGHT_SCALAR = 1.9;

const INITIAL_HEIGHT_FROM = "0vh";
const VERTICAL_WIDTH = "vw";
const VERTICAL_HEIGHT = "vh";
const IN_LINE = "inline-block";

const GROUP_ONE = 1;

const KEEP_OFFSET = 10;
const INVEST_OFFSET = 21.75;
const COMPETE_OFFSET = 33.5;

const GROUP_BOX_PERCENT = .40;

const styles = {
  outerDiv: {
    position: "absolute",
    bottom: "20vh",
  },
  barFormatting: {
    position: "relative",
    borderRadius: 20,
    width: "80px",
    backgroundColor: "#0066ff",
    display: "inline-block",
    marginLeft: ".75vw",
  },
  textDivWrapper: {
    position: "relative",
    marginTop: "30px",
    borderRadius: 20,
    height: "25px",
    width: "100px",
    backgroundColor: "#002984",
  },
  textDiv: {
    position: "relative",
    top: "3px",
    color: '#ffffff'
  },
};

/**
 * Component used in Game Two to display the results of each team's investment strategy after a given turn.
 * Uses the spring package to animate the vertical bar after a given delay to a height proportional to the number of tokens invested in the resource.
 * @param {*} props tells what type of resource the bar is (affects position and color) and the delay until animation.
 * 
 * @author Eric Doppelt
 */
function DelayedBar(props) {
  const { classes } = props;
  const [toHeight, setToHeight] = useState(INITIAL_HEIGHT);
  const spring = useSpring({
    from: {
      height: INITIAL_HEIGHT_FROM,
    },
    to: {
      height: scaleHeight(toHeight) + VERTICAL_HEIGHT,
    },
    config: {
      mass: 2,
    },
  });

  setTimeout(() => {
    setToHeight(props.tokens);
  }, props.delay);

  let background = getBackgroundColor(props.resource + 'Bar');
  let marginL = getMarginL(props.resource, props.group, props.windowWidth) + 'px';

  return (
    <div className={classes.outerDiv}>
      <animated.div
        className={classes.barFormatting}
        style={{
          ...spring,
          display: IN_LINE,
          backgroundColor: background,
          marginLeft: marginL,
        }}
      />

      <div
        className={classes.textDivWrapper}
        style={{marginLeft: marginL }}
      >
        <div className={classes.textDiv}>
          {props.resource + COLON_SPACE + props.tokens}
        </div>
      </div>
    </div>
  );
}

function scaleHeight(tokens) {
  return tokens * HEIGHT_SCALAR;
}

function getMarginL(resource, group, windowWidth) {
  let offset = (group === GROUP_ONE) ? .05 * windowWidth : .55 * windowWidth;
  let groupBoxWidth = windowWidth * GROUP_BOX_PERCENT;
  let groupMargin = groupBoxWidth - 300;
  let individualMargin = groupMargin / 3;
  let halfMargin = individualMargin / 2;

  switch (resource) {
    case COMPETE:
      return offset + halfMargin;
    case KEEP:
      return offset + halfMargin + 100 + individualMargin;
    case INVEST:
      return offset + halfMargin + 2 * (100 + individualMargin);
    default:
      return offset;
  }
}

export default withStyles(styles)(DelayedBar);
