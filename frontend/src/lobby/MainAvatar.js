import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import "../common/common_stylings/FullScreenDiv.css";
import ContinueButton from "../common/common_components/ContinueButton";
import Flame from "../icons/images/Shapes/flame.png";
import { Variants } from "../common/common_constants/stylings/StylingsBundler";

const PLAYER_DESCRIPTION = "You have been assigned the following player:";
const FULL_DIV = "fullDiv";
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 250;

const ALT_TEXT = "Flame Avatar";
const ALWAYS_ENABLED = false;

const styles = {
  playerDescription: {
    marginTop: "200px",
  },
  playerProfile: {
    marginTop: "70px",
  },
  continueButton: {
    marginTop: "70px",
  },
};

function MainAvatar(props) {
  const { classes } = props;

  return (
    <div className={FULL_DIV}>
      <Typography
        className={classes.playerDescription}
        variant={Variants.LARGE_TEXT}
      >
        {PLAYER_DESCRIPTION}
      </Typography>
      <div className={classes.playerProfile}>
        <img
          src={Flame}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
          alt={ALT_TEXT}
        />
      </div>
      <div className={classes.continueButton}>
        <ContinueButton
          className={classes.continueButton}
          route={"game-one"}
          disabled={ALWAYS_ENABLED}
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(MainAvatar);
