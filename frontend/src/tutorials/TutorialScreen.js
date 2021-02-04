import React, { useState } from "react";
import ReactPlayer from "react-player";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Box, Button } from "@material-ui/core";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const PLAY_VIDEO = true;
const PAUSE_VIDEO = false;

const ITALIC_FONT = "italic";
const ENABLE_BUTTON = true;
const DISABLE_BUTTON = false;
const FULL_SCREEN = "100%";
const PRIMARY_COLOR = "primary";

// const DISABLE_BUTTON = false;

const styles = {
  headerDiv: {
    marginTop: "135px",
  },
  videoOuterDiv: {
    position: "relative",
    marginTop: "4vh",
    marginLeft: '17vw',
    backgroundColor: "#ed6a66",
    padding: "6vh 6vw 6vh 6vw",
    borderRadius: "20px",
    width: "54vw",
    height: '50vh',
  },
  buttonDiv: {
    position: "relative",
    marginTop: '4vh',
    textAlign: 'center'
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

  setTimeout(() => {
    console.log('play');
    setPlayVideo(PLAY_VIDEO);
  }, props.initialPause);

  setTimeout(() => {
    console.log('pause');
    setPlayVideo(PAUSE_VIDEO);
  }, props.initialPause + props.videoLength);

  const { classes } = props;

  console.log(playVideo)
  return (
    <div>
      <div className={classes.headerDiv}>
        <Typography variant={Variants.LARGE_TEXT}>
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
    </div>
  );
}

export default withStyles(styles)(TutorialScreen);
