import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core";
import PayoutCount from "./PayoutCount";
import Receipt from "./Receipt";



const styles = {
  countUp: {
      fontSize: 100,
  },
  wrapperDiv: {
    position: "absolute",
    top: "25vh",
    left: "30vw",
    backgroundColor: "#e0c760",
    height: "64vh",
    width: "40vw",
    opacity: ".8",
    borderRadius: "20px",
  }
};

/**
 * Animated numbers showing the payout.
 *
 * @author Eric Doppelt
 */
function Payout(props) {
  const { classes } = props;

  return (
    <div className={classes.wrapperDiv}>
        <PayoutCount/>
        <Receipt/>
    </div>
  );
}

export default withStyles(styles)(Payout);
