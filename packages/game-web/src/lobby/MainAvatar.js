import React from "react";

import Typography from '@mui/material/Typography';
import MainPlayerImages from "../icons/components/MainPlayerImages";

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
        variant={"h2"}
      >
        {"You are the following avatar!"}
      </Typography>

      <div style={{...styles.playerProfile}}>
        <img
          src={getSelectedAvatar(props.selectedIndex, props.setSelectedIndex)}
          width={250}
          height={250}
        />
      </div>

    </div>
  );
}

// Gets the avatar picture for the main character.  If no avatar has been selected, randomly choose one.
function getSelectedAvatar(selectedIndex, setSelectedIndex) {
  // No avatar has been selected.
  if (selectedIndex < 0) {
    console.log("no avatar selected");
    // let randomIndex = Math.floor(Math.random() * 24);
    let randomIndex = 1;
    setSelectedIndex(randomIndex);
    return MainPlayerImages.images[randomIndex];
    // Images
  } else return MainPlayerImages.images[selectedIndex];
}

export default MainAvatar;
