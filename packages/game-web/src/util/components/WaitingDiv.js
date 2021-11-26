import React from "react";
import { Typography, withStyles, Box} from "@material-ui/core";
import Loader from "./Loader";

const WAITING_MESSAGE = "Waiting on others..."

const LARGE_WIDTH_THRESHOLD = 1550;
const MEDIUM_WIDTH_THRESHOLD = 1150;
const ITALIC_FONT = "italic"

const styles = {
  waitingDiv: {
    marginTop: "-72px",
    position: "absolute",
    top: "30vh",
    left: "5vw",
    backgroundColor: "#95e6af",
    height: "100px",
    opacity: ".75",
    borderRadius: "20px",
    alignItems: "center",
    verticalAlign: "middle",
  },
  text: {
    marginTop: "20px",
  },
};

function WaitingDiv(props) {
  const { classes } = props;
  let margin = getMarginLeft(props.windowWidth);
  let width = getWidth(props.windowWidth);

  if (props.show) {
    return (
      <div className={classes.waitingDiv} style={{marginLeft: margin, width: width}} >
        <Typography className={classes.text} style={{fontSize: 18}} variant={"body1"}>
        <Box fontStyle={ITALIC_FONT}>
            {WAITING_MESSAGE}
          </Box>
        </Typography>
        <Loader/>
      </div>
    );
  } else {
    return null;
  }
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

export default withStyles(styles)(WaitingDiv);