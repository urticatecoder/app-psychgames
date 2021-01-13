import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import "../util/common_stylings/FullScreenDiv.css";
import ContinueButton from "../util/common_components/ContinueButton";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";
import PlayerOptions from '../icons/components/PlayerOptions';

const PLAYER_DESCRIPTION = "You are the following avatar:";
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 250;

const ALT_TEXT = "Flame Avatar";
const NUMBER_OF_PLAYERS = 24;
const IMAGE = 'image';

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
    <div>
      <Typography
        className={classes.playerDescription}
        variant={Variants.LARGE_TEXT}
      >
        {PLAYER_DESCRIPTION}
      </Typography>
      <div className={classes.playerProfile}>
        <img
          src={getSelectedAvatar(props.selectedIndex, props.setSelectedIndex)}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
          alt={ALT_TEXT}
        />
      </div>
    </div>
  );
}

function getSelectedAvatar(selectedIndex, setSelectedIndex) {
  if (selectedIndex < 0) {
    let randomIndex = Math.floor(Math.random() * NUMBER_OF_PLAYERS);
    setSelectedIndex(randomIndex);
    return PlayerOptions[IMAGE + randomIndex];
  } else return PlayerOptions[IMAGE + selectedIndex];
}

export default withStyles(styles)(MainAvatar);
