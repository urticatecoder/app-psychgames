import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import "../util/common_stylings/FullScreenDiv.css";
import ContinueButton from "../util/common_components/ContinueButton";
import Flame from "../icons/images/shapes/flame.png";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const PLAYER_DESCRIPTION = "You have been assigned the following player:";
const FULL_DIV = "fullDiv";
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 250;

const ALT_TEXT = "Flame Avatar";
const ALWAYS_ENABLED = false;
const BUTTON_MESSAGE = "Continue to Tutorial";
const GAME_ONE_ROUTE = "game-one";

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

/**
 * Screen used to show the player that they are the flame avatar.
 * @param {*} props is used to pass into Material UI's styling function.
 *
 * @author Eric Doppelt
 */
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
          route={GAME_ONE_ROUTE}
          disabled={ALWAYS_ENABLED}
          message={BUTTON_MESSAGE}
          height='50px' 
          width='200px'
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(MainAvatar);
