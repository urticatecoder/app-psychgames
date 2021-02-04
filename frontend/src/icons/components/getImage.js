import React from "react";
import PlayerImages from "./PlayerImages";
import PlayerOptions from "./PlayerOptions";
import GameImage from './GameImage';

const IMAGE = 'image';
const NAME = 'name';
const IMAGE_HEIGHT = '85vh';
const IMAGE_WIDTH = '85vw';

function getImage(playerNumber, selectedIndex) {
    if (playerNumber > 0) {
      return (
        <GameImage
          image={PlayerImages[IMAGE + playerNumber]}
          id={PlayerImages[NAME + playerNumber]}
          alt={PlayerImages[NAME + playerNumber]}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
        />
      );
    } else {
      return (
        <GameImage
          image={PlayerOptions[IMAGE + selectedIndex]}
          id={PlayerOptions[NAME + selectedIndex]}
          alt={PlayerOptions[NAME + selectedIndex]}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
        />
      );
    }
  }

export default getImage;