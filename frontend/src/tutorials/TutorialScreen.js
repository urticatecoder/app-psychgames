import React, { useState } from "react";
import ReactPlayer from "react-player";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import ContinueButton from "../util/common_components/ContinueButton";
import { Typography, Box } from "@material-ui/core";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const FULL_DIV = "fullDiv";
const PLAY_VIDEO = true;
const PAUSE_VIDEO = false;

const ITALIC_FONT = "italic";
const ENABLE_BUTTON = true;
const FULL_SCREEN = "100%";

const BUTTON_MESSAGE = "Continue to Game One";
// const DISABLE_BUTTON = false;

const styles = {
  headerDiv: {
    marginTop: "25px",
  },
  videoOuterDiv: {
    position: "absolute",
    left: "12vw",
    top: "10vh",
    backgroundColor: "#ed6a66",
    padding: "50px 50px 50px 50px",
    borderRadius: "20px",
    width: "70vw",
  },
  videoInnerDiv: {
    position: "absolute",
    left: "15vw",
    top: "12vh",
  },
  buttonDiv: {
    position: "absolute",
    top: "92vh",
    left: "45vw",
  },
};

/**
 * Screen used before Game One and Game Two which provides the tutorial video for each Game and enables the button once it ends.
 * @param {*} props is used mainly to provide the relative file path to the tutorial video and the route to link to after it plays.
 * 
 * @author Eric Doppelt
 */
function TutorialScreen(props) {
  const [playVideo, setPlayVideo] = useState(PAUSE_VIDEO);
  const [enableButton, setEnableButton] = useState(ENABLE_BUTTON);

  setTimeout(() => {
    setPlayVideo(PLAY_VIDEO);
  }, props.initialPause);

  setTimeout(() => {
    setEnableButton(ENABLE_BUTTON);
    setPlayVideo(PAUSE_VIDEO);
  }, props.initialPause + props.videoLength);

  const { classes } = props;

  return (
    <div className={FULL_DIV}>
      <div className={classes.headerDiv}>
        <Typography variant={Variants.NORMAL_TEXT}>
          <Box fontStyle={ITALIC_FONT}>{props.text}</Box>
        </Typography>
      </div>
      <div className={classes.videoOuterDiv}>
        <ReactPlayer
          url={props.URL}
          width={FULL_SCREEN}
          height={FULL_SCREEN}
          playing={playVideo}
        />
      </div>
      <div className={classes.buttonDiv}>
        <ContinueButton  height='50px' width='200px' message={BUTTON_MESSAGE} route={props.nextRoute} disabled={!enableButton} />
      </div>
    </div>
  );
}

export default withStyles(styles)(TutorialScreen);
