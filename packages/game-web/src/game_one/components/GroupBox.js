import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Variants from "../../util/constants/stylings/Variants";

const GROUP = "Group ";
const GROUP_ONE = "One";

const GROUP_ONE_COLOR = "#FF9133";
const GROUP_TWO_COLOR = "#9933FF";

const GROUP_ONE_TOP = "0vh";
const GROUP_TWO_TOP = "72vh";

const styles = {
  groupBox: {
    borderRadius: "50px",
    backgroundColor: "#FF9133",
    opacity: ".8",
    height: "55px",
    margin: "auto",
  },
  innerDiv: {
    position: "relative",
    top: "15%",
  },
};

/**
 * Component used to display the orange and purple rectangles indiciating Group 1 and Group 2.
 * @param {*} props tell the Box which group it respresents.
 * 
 * @author Eric Doppelt
 */
function GroupBox(props) {
  const { classes } = props;
  let groupColor = (props.groupNumber === GROUP_ONE) ? GROUP_ONE_COLOR : GROUP_TWO_COLOR;
  let marginTop = (props.groupNumber === GROUP_ONE) ? GROUP_ONE_TOP : GROUP_TWO_TOP;
  return (
    <div
      className={classes.groupBox}
      style={{ backgroundColor: groupColor, width: props.width, top: marginTop}}
    >
      <div className={classes.innerDiv}>
        <Typography className={classes.innerDiv} variant={Variants.SMALL_TEXT}>
          {GROUP} {getGroupLabel(props.groupNumber)}
        </Typography>
      </div>
    </div>
  );
}

function getGroupLabel(groupNumber) {
  if (groupNumber == 'One') {
    return 'One Winners'
  } else {
    return 'Two Losers'
  }
}

export default withStyles(styles)(GroupBox);
