import React from "react";
import { useSpring, animated } from "react-spring";
import { withStyles } from "@material-ui/core";
import getBackgroundColor from "../../util/common_functions/getResourceBackgroundColor";
import getMarginLeft from "../../util/common_functions/getResourceMarginLeft";

const styles = {
  outerDiv: {
    position: "absolute",
    bottom: "35vh",
  },
  barFormatting: {
    position: "relative",
    borderRadius: 20,
    width: "80px",
    display: "inline-block",
    marginLeft: ".75vw",
  },
};

/**
 * Component utilizing the Spring package to provide animations for the vertical bars used in Game Two.
 * When a user removes or adds a token to a resource option, it triggers the animation in the Resource Bar.
 * @param {*} props provide the starting and ending height fot the animaiton, in addition to the type of resource the component is representing (which affectst its color and positioning.
 * 
 * @author Eric Doppelt
 */
function ResourceBar(props) {
  const spring = useSpring({
    from: {
      height: props.from + "vh",
    },
    to: {
      height: props.to + "vh",
    },
    config: {
      mass: 2,
    },
  });

  const { classes } = props;
  let background = getBackgroundColor(props.resource);
  let marginL = getMarginLeft(props.resource);
  return (
    <div className={classes.outerDiv}>
      <animated.div
        className={classes.barFormatting}
        style={{ ...spring, backgroundColor: background, left: marginL }}
      />
    </div>
  );
}

export default withStyles(styles)(ResourceBar);
