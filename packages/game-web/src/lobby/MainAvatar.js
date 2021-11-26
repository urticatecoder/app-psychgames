import React from "react";

import Typography from '@mui/material/Typography';
import Variants from "../util/constants/stylings/Variants";
import PlayerOptions from '../icons/components/PlayerOptions';

const PLAYER_DESCRIPTION = "You are the following avatar!";
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 250;

const NUMBER_OF_PLAYERS = 24;
const IMAGE = 'image';

const styles = {
  playerDescription: {
    marginTop: "30vh",
  },
  playerProfile: {
    marginTop: "70px",
  },
  continueButton: {
    marginTop: "70px",
  },
};

/**
 * Low-level component used to show the player their avatar.
 * Formats the image to be larger than other avatars.
 *
 * @author Eric Doppelt
 */
function MainAvatar(props) {

  return (
    <div>
      <Typography
        sx={{...styles.playerDescription}}
        variant={Variants.LARGE_TEXT}
      >
        {PLAYER_DESCRIPTION}
      </Typography>

      <div style={{...styles.playerProfile}}>
        <img
          src={getSelectedAvatar(props.selectedIndex, props.setSelectedIndex)}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
        />
      </div>

    </div>
  );
}

// Gets the avatar picture for the main character.  If no avatar has been selected, randomly choose one.
function getSelectedAvatar(selectedIndex, setSelectedIndex) {
  // No avatar has been selected.
  if (selectedIndex < 0) {
    let randomIndex = Math.floor(Math.random() * NUMBER_OF_PLAYERS);
    setSelectedIndex(randomIndex);
    return PlayerOptions[IMAGE + randomIndex];
  } else return PlayerOptions[IMAGE + selectedIndex];
}

export default MainAvatar;
